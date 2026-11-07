import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frameforge — Video to ASCII",
  description: "Turn any video into a living wall of ASCII. Private, instant, and all in your browser.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
