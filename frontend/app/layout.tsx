import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "They Cut, We Code",
  description: "Offline-first LeetCode-like coding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
