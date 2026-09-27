import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Noto_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AiChatBox from "@/components/AiChatBox";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4EAD5" },
    { media: "(prefers-color-scheme: dark)", color: "#112215" },
  ],
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  return {
    title: tMeta("title"),
    description: tMeta("description"),
    keywords: tMeta("keywords"),
    metadataBase: new URL("https://www.xongnhatayue.vn/"),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/images/logo_ks2.png", type: "image/png" },
      ],
      apple: [{ url: "/images/logo_ks2.png", sizes: "180x180", type: "image/png" }],
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "vi_VN",
      url: "https://www.xongnhatayue.vn/",
      siteName: tMeta("siteName"),
      title: tMeta("ogTitle"),
      description: tMeta("ogDescription"),
      images: ["/images/hero_lifestyle.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: tMeta("title"),
      description: tMeta("description"),
      images: ["/images/hero_lifestyle.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${plusJakarta.variable} ${notoSerif.variable} antialiased`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q8CEZCY45R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Q8CEZCY45R');
          `}
        </Script>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <AiChatBox />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
