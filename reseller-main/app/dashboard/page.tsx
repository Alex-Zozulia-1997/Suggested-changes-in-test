'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GaugeChartComponent } from './_components/bar-chart';
import { BarChartBetter } from './_components/bar-chart-better';
import CurlTest from './_components/curl-test';
import UsernameCard from './_components/username';
import PasswordCard from './_components/password';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const subuserId = 'fca52069-9276-49e9-b9c4-29d2bcdbbdd2';
    const url = `https://app-api.geonode.com/api/reseller/user/${subuserId}`;
    const headers = {
      'r-api-key': 'geonode.A^ImqMeuTJylnBcp$fLZzfIeohIM!jucRjQB',
      'Content-Type': 'application/json',
    };

    fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then((text) => {
            throw new Error(`Request failed: ${response.status} - ${text}`);
          });
        }
      })
      .then((data) => {
        setUserData(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-start flex-wrap px-1 pt-4 gap-4 w-full">
      <div className="text-3xl lg:text-5xl font-bold  w-full text-center py-2">
        <h1>Overview</h1>
      </div>
      <div className="flex justify-center items-center gap-2 w-full">
        <UsernameCard userData={userData} />

        <PasswordCard userData={userData} />
      </div>

      {/* Charts */}
      <div className="flex flex-col md:flex-row gap-2">
        <GaugeChartComponent
          used={userData.usageBandwidth / 1000 || 0.4}
          total={Number(userData.traffic_limit / 1000)}
        />
        <BarChartBetter />
      </div>
      <div className="flex justify-center items-center gap-2 w-full">
        <CurlTest userData={userData} />
      </div>
    </div>
  );
}
