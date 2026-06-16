"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";

interface HeaderProps {
  onCartOpen: () => void;
}

export default function Header({ onCartOpen }: HeaderProps) {
  const pathname = usePathname();
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
    { name: "Trang Chủ", href: "/" },
    { name: "Giới Thiệu", href: "/about" },
    { name: "Sản Phẩm", href: "/products" },
    { name: "Bán Chạy", href: "/best-sellers" },
    { name: "Góc An Yên", href: "/blog" },
    { name: "Liên Hệ", href: "/contact" },
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
            alt="Kiều Sang Logo"
            width={44}
            height={44}
            className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-serif text-[16px] md:text-[18px] tracking-widest text-[#043616] font-bold uppercase">
            Kiều Sang
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
        <div className="flex items-center gap-4">
          {/* Cart Icon button */}
          <button
            onClick={onCartOpen}
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
            Cửa Hàng
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden h-11 w-11 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-[#043616] transition-all active:scale-95 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-neutral-200 shadow-lg py-6 px-8 flex flex-col gap-4 text-sm font-semibold animate-fade-in text-[#414941]">
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
        </div>
      )}
    </nav>
  );
}
