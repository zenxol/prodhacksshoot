import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import { ViewportHeight } from "@/components/ViewportHeight";
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
  title: "SHOOT",
  description: "Match poses, take better photos",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var v=window.visualViewport,h=v?v.height:window.innerHeight;document.documentElement.style.setProperty('--vvh',h+'px');if(v){v.addEventListener('resize',function(){document.documentElement.style.setProperty('--vvh',v.height+'px');});v.addEventListener('scroll',function(){document.documentElement.style.setProperty('--vvh',v.height+'px');});}window.addEventListener('resize',function(){document.documentElement.style.setProperty('--vvh',(window.visualViewport?window.visualViewport.height:window.innerHeight)+'px');});})();`,
          }}
        />
        <ViewportHeight />
        {children}
        <Navigation />
      </body>
    </html>
  );
}
