"use client";
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const AdWrapper = ({ children }) => {
  const { data: session } = useSession();

  useEffect(() => {
    const handleAdComplete = () => {
      if (session) {
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'ad_watch',
            points: 2
          }),
        });
      }
    };

    // Listen for ad completion events
    window.addEventListener('adComplete', handleAdComplete);

    return () => {
      window.removeEventListener('adComplete', handleAdComplete);
    };
  }, [session]);

  return children;
};

export default AdWrapper;
