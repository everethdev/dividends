import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { Providers } from '@/app/providers';
import '@rainbow-me/rainbowkit/styles.css';

const inter = Mulish({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EverETH Reflect - Ethereum Rewards Protocol",
  description: "Decentralised dividend protocol running on Binance Smart Chain.",
  icons: {
    icon: '/icon.png', // /public path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

      <Providers>{children}</Providers>

      </body>
    </html>
  );
}
