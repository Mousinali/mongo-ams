import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asset Management System",
  description: "Asset Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#18181b",
              color: "#fafafa",
              fontSize: "14px",
              fontWeight: "500",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
