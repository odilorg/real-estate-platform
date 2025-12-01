import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { ComparisonProvider } from '@/contexts/ComparisonContext'
import { Toaster } from 'sonner'
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
  title: "EstateHub - Найдите недвижимость вашей мечты",
  description: "Покупка, продажа и аренда недвижимости в Узбекистане. Квартиры, дома, земельные участки и коммерческая недвижимость.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextIntlClientProvider messages={messages}>
            <FavoritesProvider>
              <ComparisonProvider>
                {children}
              </ComparisonProvider>
            </FavoritesProvider>
          </NextIntlClientProvider>
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
