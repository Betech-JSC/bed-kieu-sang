"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Layers3, ShoppingBag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/i18n-utils";

export interface ProductVariant {
  id: number;
  name: string;
  name_en?: string;
  sku: string;
  label: string;
  label_en?: string;
  price: number;
  original_price?: number;
  image_path?: string;
  image?: string;
  stock: number;
  status: "active" | "inactive";
}

export interface Product {
  id: string | number;
  name: string;
  name_en?: string;
  price: number;
  category: string | { id?: string | number; name: string; name_en?: string };
  category_en?: string;
  rating: number;
  description: string;
  description_en?: string;
  image: string;
  benefits: string[];
  benefits_en?: string[];
  badge?: string;
  badge_en?: string;
  originalPrice?: number;
  slug?: string;
  slug_en?: string;
  total_sales?: number;
  is_best_seller?: boolean;
  seo_title?: string;
  seo_desc?: string;
  has_variants?: boolean;
  variants?: ProductVariant[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations("product");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const localizedName = getLocalized(product, "name", locale);
  const localizedBadge = getLocalized(product, "badge", locale);
  const productSlug = locale === "en" && product.slug_en ? product.slug_en : (product.slug || product.id);

  const getCategoryName = () => {
    if (typeof product.category === "object" && product.category !== null) {
      return getLocalized(product.category, "name", locale);
    }
    if (locale === "en" && product.category_en) {
      return product.category_en;
    }
    return product.category || "";
  };

  return (
    <div className="group relative flex flex-col w-full h-full overflow-hidden rounded-[32px] border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(4,54,22,0.06)]">
      <Link href={`/products/${productSlug}`} className="flex flex-col flex-1">
        {/* Product Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-background/50 border-b border-border/40">
          {localizedBadge && (
            <span className="absolute top-4 left-4 z-10 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-[#112215] shadow-xs">
              {localizedBadge}
            </span>
          )}
          <Image
            src={product.image}
            alt={localizedName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col p-4">
          {/* Category */}
          <span className="text-[10px] text-primary/70 font-semibold tracking-wider uppercase mb-1">
            {getCategoryName()}
          </span>

          {/* Title */}
          <h3 className="font-serif text-base font-semibold leading-6 text-primary mb-2 group-hover:text-secondary transition-colors duration-300 line-clamp-1">
            {localizedName}
          </h3>
        </div>
      </Link>

      {/* Price & Add to Cart */}
      <div className="max-sm:space-y-3 lg:flex items-center justify-between p-4 pt-3 border-t border-border/40">
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest">
            {product.has_variants ? t("priceFrom") : t("price")}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-bold text-primary font-sans leading-none">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[9px] text-muted-foreground/60 line-through font-sans">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {(product.total_sales ?? 0) > 0 && (
            <span className="mt-1 text-[10px] font-medium text-[#414941]">
              {new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN").format(product.total_sales || 0)} {t("sold")}
            </span>
          )}
        </div>

        {product.has_variants ? (
          <Link
            href={`/products/${productSlug}`}
            className="max-sm:w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-white font-bold text-[10px] uppercase tracking-wider transition-all duration-300 hover:bg-secondary hover:shadow-[0_4px_12px_rgba(4,54,22,0.15)] hover:scale-[1.03] active:scale-[0.98]"
          >
            <Layers3 className="h-3 w-3" />
            <span>{t("selectVariant")}</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="max-sm:w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-white font-bold text-[10px] uppercase tracking-wider transition-all duration-300 hover:bg-secondary hover:shadow-[0_4px_12px_rgba(4,54,22,0.15)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <ShoppingBag className="h-3 w-3" />
            <span>{t("add")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
