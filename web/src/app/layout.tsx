import type { Metadata, Viewport } from "next";
import { Noto_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Mail } from "lucide-react";

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

export const metadata: Metadata = {
  title: "Xông Nhà Tẩy Uế - Thanh lọc không gian, Chăm sóc tâm hồn",
  description:
    "Thương hiệu thảo mộc thiên nhiên cao cấp giúp không gian sạch sẽ, thanh tịnh tinh thần và cân bằng năng lượng phong thủy.",
  metadataBase: new URL("https://www.xongnhatayue.vn/"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/images/logo.png", sizes: "1024x1024", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://www.xongnhatayue.vn/",
    siteName: "Xông Nhà Tẩy Uế",
    images: ["/images/hero_lifestyle.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${notoSerif.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <a
            href="mailto:xongnhatayuekieusang@gmail.com"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#043616] text-[#FFFDF9] shadow-xl border border-[#E5C44B]/40 hover:bg-[#112215] hover:scale-110 active:scale-95 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(229,196,75,0.5)] animate-bounce"
            title="Gửi Email"
            style={{ animationDuration: "3s" }}
          >
            <Mail className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
          </a>
        </ThemeProvider>
      </body>
    </html>
  );
}
