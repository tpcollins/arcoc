"use client";

import { ReactNode, useEffect } from 'react';
import localFont from "next/font/local";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js'); 
  }, []);

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   useEffect(() => {
//     // Dynamically import Bootstrap JS
//     import('bootstrap/dist/js/bootstrap.bundle.min.js');
//   }, []);

  return (
    <>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </>
  );
}


