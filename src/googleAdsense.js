import Script from "next/script";
import { useEffect } from 'react';

const GoogleAdsense = ({ pId }) => {
  useEffect(() => {
    const handleAdLoad = () => {
      // Initialize ad event listeners
      (window.adsbygoogle = window.adsbygoogle || []).push({
        onAdLoad: () => {
          window.dispatchEvent(new Event('adComplete'));
        }
      });
    };

    if (process.env.NODE_ENV === "production") {
      handleAdLoad();
    }

    return () => {
      window.removeEventListener('adComplete', () => {});
    };
  }, []);

  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};

export default GoogleAdsense;
