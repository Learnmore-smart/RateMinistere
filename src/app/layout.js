/*
 * Copyright 2025 Learnmore_Smart
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  metadataBase: new URL(`https://www.your-url/rateministere`),
  title: 'Rate Ministère',
  description: "RateMinstere is a innovative teacher rating platform where students can compete in AstrArena challenges, connect with peers in AstrAlumna forums, and follow teacher competitions. Together, let's help every student to reach a higher grade",
  icons: {
    icon: '/rateministere/images/favicon/favicon.png',
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
