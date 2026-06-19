"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
              Xông Nhà Tẩy Uế
            </span>
          </Link>
          <p className="text-xs leading-relaxed font-light">
            Nuôi dưỡng tâm hồn lành mạnh và thanh lọc không gian qua những tinh túy từ thảo dược cổ truyền Việt Nam.
          </p>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white rounded-lg border border-border text-primary hover:text-secondary transition-colors"
            >
              <Facebook className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white rounded-lg border border-border text-primary hover:text-secondary transition-colors"
            >
              <Instagram className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* Column 2: Products routing links */}
        <div className="space-y-6 text-left">
          <h4 className="text-xs font-semibold text-primary uppercase border-b border-primary/10 pb-2">
            Sản Phẩm
          </h4>
          <ul className="space-y-3 font-medium text-xs">
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/products?category=Thanh Lọc Không Gian">Thảo Mộc Xông Nhà</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/products?category=Thư Giãn Tinh Thần">Nụ Trầm Thảo Mộc</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/products?category=Thanh Lọc Không Gian">Nước Xịt Thanh Lọc</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/products?category=Trà An Yên">Trà Thảo Mộc An Yên</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Site pages navigation */}
        <div className="space-y-6 text-left">
          <h4 className="text-xs font-semibold text-primary uppercase border-b border-primary/10 pb-2">
            Khám phá
          </h4>
          <ul className="space-y-3 font-medium text-xs">
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/">Trang chủ</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/about">Giới thiệu</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/products">Sản phẩm</Link>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/blog">Góc an yên (Blog)</Link>
            </li>
            {/* <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/contact">Liên hệ</Link>
            </li> */}
            <li className="hover:text-primary transition-colors cursor-pointer">
              <Link href="/faq">Câu hỏi thường gặp</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Address, contact & newsletter */}
        <div className="space-y-6 text-left">
          <h4 className="text-xs font-semibold text-primary uppercase border-b border-primary/10 pb-2">
            Liên hệ & Đăng ký
          </h4>
          <p className="text-[11px] italic leading-relaxed text-muted-foreground font-light">
            Địa chỉ: Quận 1, Tp. Hồ Chí Minh <br />
            Hotline: 0779 440 918 (Zalo) <br />
            Email: lienhe@xongnhatayue.vn
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex border-b-2 border-primary/20 py-2 focus-within:border-primary transition-all"
          >
            <input
              className="bg-transparent border-none outline-none focus:ring-0 text-xs w-full placeholder:text-muted-foreground/40 text-primary"
              placeholder="Email của bạn"
              type="email"
              required
            />
            <button
              type="submit"
              className="text-primary hover:translate-x-1 transition-transform cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="py-8 border-t border-border/40 text-center text-[10px] opacity-80">
        © {currentYear} Xông Nhà Tẩy Uế. Nuôi dưỡng tĩnh lặng qua trí tuệ cổ truyền.
      </div>
    </footer>
  );
}
