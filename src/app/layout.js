import localFont from "next/font/local";
import "../app/globals.css";
import { Providers } from './providers';
import Navbar from "./navbar";
import { CustomCursor } from './CustomCursor.js';
import ActivityTracker from './components/ActivityTracker/ActivityTracker';
import { headers } from "next/headers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  metadataBase: new URL(`https://www.rateministere.com`),
  title: 'Rate Ministère',
  description: "RateMinstere is a innovative teacher rating platform where students can compete in AstrArena challenges, connect with peers in AstrAlumna forums, and follow teacher competitions. Together, let's help every student to reach a higher grade",
  icons: {
    icon: '/images/favicon/favicon.png',
  },
  verification: {
    yandex: '299dca6f82a48833',
  },
  alternates: {
    canonical: './'
  }
}

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const path = headersList.get('x-url')?.split('?')[0] || '';

  return (
    <html lang="en">
      <body className={`page-body ${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <CustomCursor />
          <ActivityTracker />
          <div className="global-app-wrapper">
            <Navbar />
            {children}
          </div>

        </Providers>
      </body>
    </html>
  );
}
