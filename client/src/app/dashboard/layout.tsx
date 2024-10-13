"use client";

import Navbar from "@/components/navbar";
import { WebSocketProvider } from "../WebSocketContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <WebSocketProvider>{children}</WebSocketProvider>
      </body>
    </html>
  );
}
