"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export interface Product {
  id: string | number;
  name: string;
  price: number;
  category: string;
  rating: number;
  description: string;
  image: string;
  benefits: string[];
  badge?: string;
  originalPrice?: number;
  slug?: string;
  total_sales?: number;
  is_best_seller?: boolean;
  seo_title?: string;
  seo_desc?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="group relative flex flex-col w-full h-full overflow-hidden rounded-[32px] border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(4,54,22,0.06)]">
      <Link href={`/products/${product.slug || product.id}`} className="flex flex-col flex-1">
        {/* Product Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-background/50 border-b border-border/40">
          {product.badge && (
            <span className="absolute top-4 left-4 z-10 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-[#112215] shadow-xs">
              {product.badge}
            </span>
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col p-4">
          {/* Category */}
          <span className="text-[10px] text-primary/70 font-semibold tracking-wider uppercase mb-1">
            {typeof product.category === "object" && product.category !== null
              ? (product.category as any).name
              : product.category}
          </span>

          {/* Title */}
          <h3 className="font-serif text-base font-semibold leading-6 text-primary mb-2 group-hover:text-secondary transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
        </div>
      </Link>

      {/* Price & Add to Cart */}
      <div className="flex items-center justify-between p-4 pt-3 border-t border-border/40">
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Giá bán</span>
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
              {new Intl.NumberFormat("vi-VN").format(product.total_sales || 0)} lượt bán
            </span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-white font-bold text-[10px] uppercase tracking-wider transition-all duration-300 hover:bg-secondary hover:shadow-[0_4px_12px_rgba(4,54,22,0.15)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        >
          <ShoppingBag className="h-3 w-3" />
          <span>Thêm</span>
        </button>
      </div>
    </div>
  );
}
