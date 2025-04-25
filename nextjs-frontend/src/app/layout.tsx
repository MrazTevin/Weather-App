import type React from "react";
import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WeatherWise - Weather Forecast App",
  description: "Get accurate weather forecasts for any location",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body
        className={inter.className} 
      >
        {children}
      </body>
    </html>
  );
}
