"use client";
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const ActivityTracker = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
    let lastPing = Date.now();
    let activityTimeout;

    const handleActivity = () => {
      const now = Date.now();
      // Only ping the server every 30 seconds
      if (now - lastPing >= 30000) {
        fetch('/api/user/activity', {
          method: 'POST'
        });
        lastPing = now;
      }

      // Reset the inactivity timer
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        // User has been inactive, reset lastPing to ensure next activity starts a new session
        lastPing = 0;
      }, 60000); // Reset after 1 minute of inactivity
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeout(activityTimeout);
    };
  }, [session]);

  return null;
};

export default ActivityTracker;
