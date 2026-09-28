"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "pill" | "compact";
}

export default function LanguageSwitcher({
  className = "",
  variant = "pill",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (newLocale: "vi" | "en") => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1 text-xs font-semibold ${className}`}>
        <button
          type="button"
          onClick={() => handleSwitch("vi")}
          className={`px-2 py-1 rounded transition-colors ${
            locale === "vi"
              ? "bg-[#043616] text-white font-bold"
              : "text-[#414941] hover:text-[#043616]"
          }`}
          title="Tiếng Việt"
        >
          VI 🇻🇳
        </button>
        <span className="text-neutral-300">|</span>
        <button
          type="button"
          onClick={() => handleSwitch("en")}
          className={`px-2 py-1 rounded transition-colors ${
            locale === "en"
              ? "bg-[#043616] text-white font-bold"
              : "text-[#414941] hover:text-[#043616]"
          }`}
          title="English"
        >
          EN 🇬🇧
        </button>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border border-neutral-200/80 bg-neutral-50/80 p-0.5 shadow-2xs ${className}`}
    >
      <button
        type="button"
        onClick={() => handleSwitch("vi")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          locale === "vi"
            ? "bg-[#043616] text-white shadow-xs"
            : "text-[#414941] hover:text-[#043616]"
        }`}
        aria-label="Chuyển sang Tiếng Việt"
      >
        <span>🇻🇳</span>
        <span>VI</span>
      </button>

      <button
        type="button"
        onClick={() => handleSwitch("en")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          locale === "en"
            ? "bg-[#043616] text-white shadow-xs"
            : "text-[#414941] hover:text-[#043616]"
        }`}
        aria-label="Switch to English"
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
