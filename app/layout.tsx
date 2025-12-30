import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Connect 4 Online - Multiplayer Game",
  description: "Play Connect 4 online with friends or challenge the AI. Modern, beautiful, and fun!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
