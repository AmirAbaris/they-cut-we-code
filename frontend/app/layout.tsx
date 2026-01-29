import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <footer className="border-t">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <p className="text-sm text-muted-foreground">
                  To the brave people of Iran ❤️🕊️
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
