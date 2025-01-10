import { userCreate } from '@/utils/data/user/userCreate';
import { userUpdate } from '@/utils/data/user/userUpdate';
import { updateUser } from '@/utils/data/user/userUpdate1';
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  const createUaseOnAPI = async (data: any) => {
    console.log(data);
  };
  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  console.log('WEBHOOK_SECRET:', WEBHOOK_SECRET);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
  console.log('Received event type:', eventType);
  // PI CAL DEF++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const createUserOnAPI = async (data: {
    email: string;
    serviceType: string; // "RESIDENTIAL-PREMIUM", "HTML-SCRAPPER", "SHARED-DATACENTER"
    traffic_limit: number;
    username: string; // Only letters, numbers, underscores allowed
    password: string; // UUID or similar, 36 chars
    current_period_end: string; // "YYYY-MM-DD"
  }) => {
    const url = 'https://app-api.geonode.com/api/reseller/user/create';
    const headers = {
      'r-api-key': 'geonode.A^ImqMeuTJylnBcp$fLZzfIeohIM!jucRjQB',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to create user: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log('User created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating user on API:', error);
      throw error;
    }
  };
  function generateUsername(prefix = 'proxy') {
    const randomNumber = Math.floor(Math.random() * 100); // Random number 0-99
    return `${prefix}${randomNumber}`;
  }
  // API CALl++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  switch (eventType) {
    case 'user.created':
      try {
        // Insert the initial user info
        await userCreate({
          email: payload?.data?.email_addresses?.[0]?.email_address,
          first_name: payload?.data?.first_name,
          last_name: payload?.data?.last_name,
          profile_image_url: payload?.data?.profile_image_url,
          user_id: payload?.data?.id,
        });

        console.log('User info inserted');

        // Prepare data for API call
        const userData = {
          email: payload?.data?.email_addresses?.[0]?.email_address,
          serviceType: 'RESIDENTIAL-PREMIUM',
          traffic_limit: 2000,
          username: generateUsername(), // Only letters, numbers, underscores allowed
          password: uuidv4(), // UUID, 36 characters
          current_period_end: '2025-11-03', // YYYY-MM-DD format
        };

        // Call the external API to create the user
        const response = await createUserOnAPI(userData);
        console.log('API Response:', response);

        const resId = response?.data?.id; // Extract the ID from the response
        console.log('User ID:', resId);

        // Update the user table with the resId
        if (resId) {
          await updateUser({
            email: payload?.data?.email_addresses?.[0]?.email_address,
            resID: resId,
          });
          console.log('resId updated in user table');
        } else {
          console.warn('resID not found in API response');
        }

        return NextResponse.json({
          status: 200,
          message: 'User info inserted and resId updated',
        });
      } catch (error) {
        console.error('Error handling user.created:', error.message);
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }

    case 'user.updated':
      try {
        await userUpdate({
          email: payload?.data?.email_addresses?.[0]?.email_address,
          first_name: payload?.data?.first_name,
          last_name: payload?.data?.last_name,
          profile_image_url: payload?.data?.profile_image_url,
          user_id: payload?.data?.id,
        });

        return NextResponse.json({
          status: 200,
          message: 'User info updated',
        });
      } catch (error: any) {
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }

    default:
      return new Response('Error occured -- unhandeled event type', {
        status: 400,
      });
  }
}
