"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ShoppingBag, Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface HeaderProps {
  onCartOpen?: () => void;
}

export default function Header({ onCartOpen }: HeaderProps) {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tHeader = useTranslations("header");
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const savedCart = localStorage.getItem("kieu_sang_cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          const count = parsed.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
          setCartCount(count);
        } catch (e) {
          console.error("Error parsing cart in header:", e);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCount();
    window.addEventListener("kieu-sang-cart-update", updateCount);
    // Also listen to storage events to support multi-tab synchronization
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("kieu-sang-cart-update", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const navLinks = [
    { name: tNav("home"), href: "/" },
    { name: tNav("about"), href: "/about" },
    { name: tNav("products"), href: "/products" },
    { name: tNav("bestSellers"), href: "/best-sellers" },
    { name: tNav("blog"), href: "/blog" },
  ];

  return (
    <nav className="fixed top-0 w-full z-40 bg-white border-b border-neutral-200/60 shadow-xs h-20 transition-all">
      <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto h-full">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <Image
            src="/images/logo_ks2.png"
            alt="Logo Xông Nhà Tẩy Uế"
            width={44}
            height={44}
            className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-serif text-[16px] md:text-[18px] tracking-widest text-[#043616] font-bold uppercase">
            Xông Nhà Tẩy Uế
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-[#414941]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors pb-1 hover:text-[#043616] ${
                  isActive
                    ? "text-[#043616] font-bold border-b-2 border-[#043616]"
                    : "text-[#414941]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Header CTA & Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Language Switcher (Desktop) */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Cart Icon button */}
          <button
            type="button"
            onClick={onCartOpen}
            aria-label={tHeader("cart")}
            className="relative h-11 w-11 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-[#043616] transition-all duration-300 hover:border-[#043616] hover:shadow-[0_4px_12px_rgba(4,54,22,0.08)] active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-[#112215] border border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Shop Direct button */}
          <Link
            href="/products"
            className="hidden sm:block bg-[#043616] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#2d6a3e] transition-all duration-300"
          >
            {tHeader("shopNow")}
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={tHeader("menu")}
            className="md:hidden h-11 w-11 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-[#043616] transition-all active:scale-95 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-neutral-200 shadow-lg py-6 px-8 flex flex-col gap-4 text-sm font-semibold animate-fade-in text-[#414941]">
          {/* Mobile Language Switcher */}
          <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-normal">{tHeader("language")}:</span>
            <LanguageSwitcher />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-left py-2 border-b border-neutral-100 hover:text-primary ${
                pathname === link.href ? "text-[#043616] font-bold" : "text-[#414941]"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-2 text-center bg-[#043616] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#2d6a3e] transition-all"
          >
            {tHeader("shopNow")}
          </Link>
        </div>
      )}
    </nav>
  );
}
