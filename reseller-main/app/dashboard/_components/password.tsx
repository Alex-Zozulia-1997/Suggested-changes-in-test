import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const PasswordCard = ({ userData }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = userData?.authorization?.password || 'N/A';
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // Reset "Copied" status after 2 seconds
      },
      (err) => {
        console.error('Failed to copy text: ', err);
      }
    );
  };

  return (
    <Card className="w-1/2 " onClick={handleCopy}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Password:</CardTitle>
      </CardHeader>
      <CardContent className="hover: pb-1">
        <div className=" text-center text-lg px-6 py-4 bg-gray-900 text-blue-400 rounded-md font- break-words overflow-wrap cursor-pointer hover:bg-gray-800">
          {userData?.authorization?.password || 'N/A'}
        </div>
      </CardContent>
      <CardFooter className="m-0 pt-0">
        <p className="text-xs text-muted-foreground">
          {copied ? 'Copied!' : 'Click to copy'}
        </p>
      </CardFooter>
    </Card>
  );
};

export default PasswordCard;
