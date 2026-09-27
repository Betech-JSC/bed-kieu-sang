"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Facebook, Instagram, ArrowRight } from "lucide-react";
import { getSettings } from "@/lib/api";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const tFooter = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  useEffect(() => {
    getSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  return (
    <footer className="bg-[#FAF6EE] border-t border-border/80 text-muted-foreground w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 py-20 max-w-7xl mx-auto">

        {/* Column 1: Brand details & socials */}
        <div className="space-y-6">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <Image
              src="/images/logo_ks2.png"
              alt="Logo Xông Nhà Tẩy Uế"
              width={36}
              height={36}
              className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-serif text-sm tracking-widest text-primary font-bold uppercase">
              {tCommon("brandName")}
            </span>
          </Link>
          <p className="text-xs leading-relaxed font-light">
            {tFooter("brandDesc")}
          </p>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="p-2 bg-white rounded-lg border border-border text-primary hover:text-secondary transition-colors"
            >
              <Facebook className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2 bg-white rounded-lg border border-border text-primary hover:text-secondary transition-colors"
            >
              <Instagram className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* Column 2: Products routing links */}
        <div className="space-y-6 text-left">
          <h4 className="text-xs font-semibold text-primary uppercase border-b border-primary/10 pb-2">
            {tFooter("products")}
          </h4>
          <ul className="space-y-3 font-medium text-xs">
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/products?category=Thanh Lọc Không Gian">{tFooter("purify")}</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/products?category=Thư Giãn Tinh Thần">{tFooter("incense")}</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/products?category=Thanh Lọc Không Gian">{tFooter("mist")}</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/products?category=Trà An Yên">{tFooter("tea")}</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Site pages navigation */}
        <div className="space-y-6 text-left">
          <h4 className="text-xs font-semibold text-primary uppercase border-b border-primary/10 pb-2">
            {tFooter("explore")}
          </h4>
          <ul className="space-y-3 font-medium text-xs">
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/">{tNav("home")}</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/about">{tNav("about")}</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/products">{tNav("products")}</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/blog">{tNav("blog")}</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/faq">{tNav("faq")}</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Address, contact & newsletter */}
        <div className="space-y-6 text-left">
          <h4 className="text-xs font-semibold text-primary uppercase border-b border-primary/10 pb-2">
            {tFooter("contact")}
          </h4>
          <p className={`text-[11px] italic leading-relaxed text-muted-foreground font-light transition-opacity duration-300 ${settings ? "opacity-100" : "opacity-0"}`}>
            {tFooter("address")}: {settings?.store_address || ""} <br />
            {tFooter("email")}: {settings?.store_email || ""}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex border-b-2 border-primary/20 py-2 focus-within:border-primary transition-all"
          >
            <input
              className="bg-transparent border-none outline-none focus:ring-0 text-xs w-full placeholder:text-muted-foreground/40 text-primary"
              placeholder={tFooter("emailPlaceholder")}
              type="email"
              required
            />
            <button
              type="submit"
              aria-label={tFooter("subscribe")}
              className="text-primary hover:translate-x-1 transition-transform cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="py-8 border-t border-border/40 text-center text-[10px] opacity-80">
        © {currentYear} {tCommon("brandName")}. {tFooter("copyright")}
      </div>
    </footer>
  );
}
