'use client';
import LanguageProvider from './components/LanguageProvider';
import GoogleAdsense from '../googleAdsense';
import AdWrapper from './components/AdWrapper';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }) {
  return (
    <LanguageProvider>
      <SessionProvider>
        <ThemeProvider attribute="class">
          {children}
          <AdWrapper>
            <GoogleAdsense pid="ca-pub-5883958707339600" />
          </AdWrapper>
        </ThemeProvider>
      </SessionProvider>
    </LanguageProvider>
  );
}
