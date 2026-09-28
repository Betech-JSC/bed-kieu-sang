import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import { getProduct } from "@/lib/api";
import { Product } from "@/components/product-card";
import { getLocalized } from "@/lib/i18n-utils";

interface ProductDetailProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const { id, locale } = await params;
  try {
    const product = await getProduct(id);
    if (!product) {
      return {
        title: locale === "en" ? "Product Not Found | Kieu Sang" : "Không tìm thấy sản phẩm | Xông Nhà Tẩy Uế",
      };
    }
    const localizedName = getLocalized(product, "name", locale);
    const localizedDesc = getLocalized(product, "description", locale);
    const title = product.seo_title || `${localizedName} | ${locale === "en" ? "Kieu Sang" : "Xông Nhà Tẩy Uế"}`;
    const description = product.seo_desc || localizedDesc;
    const imageUrl = product.image || "/images/logo.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: localizedName,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (e) {
    return {
      title: locale === "en" ? "Products | Kieu Sang" : "Sản phẩm | Xông Nhà Tẩy Uế",
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = await params;
  let initialProduct: Product | null = null;
  try {
    initialProduct = (await getProduct(id)) as unknown as Product;
  } catch (e) {
    console.error("Failed to fetch product on server:", e);
  }

  return <ProductDetailClient id={id} initialProduct={initialProduct} />;
}
