import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";

import { siteConfig } from "@/shared/config/site";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
      data-density="comfortable"
      data-motion="full"
      data-text-size="default"
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var raw = localStorage.getItem('english-os:appearance-preferences');
                  if (!raw) return;
                  var p = JSON.parse(raw);
                  var el = document.documentElement;
                  if (p.theme) el.setAttribute('data-theme', p.theme);
                  if (p.textSize) el.setAttribute('data-text-size', p.textSize);
                  if (p.density) el.setAttribute('data-density', p.density);
                  if (p.motion) el.setAttribute('data-motion', p.motion);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
