import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";

import { siteConfig } from "@/shared/config/site";

import QueryProvider from "@/app/providers/QueryProvider";

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
                  var p = {
                    theme: 'system',
                    textSize: 'default',
                    density: 'comfortable',
                    motion: 'full'
                  };
                  if (raw) {
                    var parsed = JSON.parse(raw);
                    p = {
                      theme: parsed.theme || p.theme,
                      textSize: parsed.textSize || p.textSize,
                      density: parsed.density || p.density,
                      motion: parsed.motion || p.motion
                    };
                  }
                  var el = document.documentElement;
                  var resolvedTheme = p.theme === 'system'
                    ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : p.theme;
                  if (resolvedTheme) el.setAttribute('data-theme', resolvedTheme);
                  if (p.textSize) el.setAttribute('data-text-size', p.textSize);
                  if (p.density) el.setAttribute('data-density', p.density);
                  if (p.motion) el.setAttribute('data-motion', p.motion);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body><QueryProvider>{children}</QueryProvider></body>
    </html>
  );
}
