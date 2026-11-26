import type { Metadata } from "next";
import "./globals.css";
import { Open_Sans, Roboto_Mono, Unbounded } from "next/font/google";

const openSans = Open_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const robotoMono = Roboto_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

const unbounded = Unbounded({
  weight: ["500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  title: "veneito",
  description: "veneito: Rust apps, homelab, Roblox dev",
  openGraph: { title: "veneito", description: "Rust apps, homelab, Roblox dev" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} ${robotoMono.variable} ${unbounded.variable} antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}
