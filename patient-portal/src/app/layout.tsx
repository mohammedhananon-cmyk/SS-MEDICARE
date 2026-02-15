import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SS MEDICARE | Patient Portal",
  description: "Secure Personal Health Dashboard for Citizens",
};

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="layout-wrapper">
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>
          <div className="main-content">
            <Header />
            <main style={{ flex: 1, padding: "1rem 0" }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
