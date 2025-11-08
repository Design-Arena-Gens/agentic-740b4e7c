import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GPT Clone",
  description: "A ChatGPT-like interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
