import type { Metadata } from "next";
import { Manrope, Spectral, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const serif = Spectral({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const TITLE = "Tildra — AI-редактор Tilda для фрилансеров";
const DESCRIPTION =
  "Закрывай пакеты клиентских правок в 5× быстрее. Цены, даты, картинки — одной фразой. Превью, история версий, откат за 1 клик. Tilda Export ZIP — туда и обратно.";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Tildra",
  },
  description: DESCRIPTION,
  applicationName: "Tildra",
  authors: [{ name: "Tildra" }],
  keywords: [
    "Tilda",
    "Tilda редактор",
    "AI редактор",
    "редактор Tilda",
    "правки Tilda",
    "Zero Block",
    "Tilda фрилансер",
    "Tilda export",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Tildra",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${sans.variable} ${serif.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
