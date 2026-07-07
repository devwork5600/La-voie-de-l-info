import type { Metadata } from "next";
import { Geist, Geist_Mono, Libre_Baskerville, Playfair_Display } from "next/font/google";
import "./globals.css";
import { TanstackProvider } from "@/components/providers/Tanstackprovider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthModalManager } from "@/components/auth/AuthModalManager";
import { WriterRedirectModal } from "@/components/modals/WriterRedirectModal";




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
  title: "La Voie de l'Info",
  description: "Journal d'information indépendant",
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
      <body className="min-h-full flex flex-col">
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
