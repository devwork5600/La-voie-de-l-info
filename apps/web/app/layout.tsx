import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Libre_Baskerville,
  Playfair_Display,
} from "next/font/google";

import "./globals.css";
import { AuthModalManager } from "@/components/auth/AuthModalManager";
import { WriterRedirectModal } from "@/components/modals/WriterRedirectModal";
import { TanstackProvider } from "@/components/providers/Tanstackprovider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const SITE_NAME = "La Voie De L'Info";
const SITE_DESCRIPTION =
  "Journal d'information indépendant : actualités politiques, économiques, technologiques, écologiques et culturelles vérifiées et analysées par notre rédaction.";
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_NAME} — Actualités indépendantes`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "actualités",
    "journal",
    "presse indépendante",
    "politique",
    "économie",
    "high-tech",
    "écologie",
    "culture",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: baseUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Actualités indépendantes`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Actualités indépendantes`,
    description: SITE_DESCRIPTION,
  },
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0e1b30" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1b30" },
  ],
  colorScheme: "light dark",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: SITE_NAME,
  url: baseUrl,
  logo: `${baseUrl}/icon`,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`scrollbar scrollbar-none ${geistSans.variable} ${geistMono.variable} ${libreBaskerville.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <TanstackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <AuthModalManager />
            <WriterRedirectModal />
            <main className="grow">{children}</main>
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
