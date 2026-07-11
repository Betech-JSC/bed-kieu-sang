import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import { getProduct } from "@/lib/api";
import { Product } from "@/components/product-card";

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    if (!product) {
      return {
        title: "Không tìm thấy sản phẩm | Xông Nhà Tẩy Uế",
      };
    }
    const title = product.seo_title || `${product.name} | Xông Nhà Tẩy Uế`;
    const description = product.seo_desc || product.description;
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
            alt: product.name,
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
      title: "Sản phẩm | Xông Nhà Tẩy Uế",
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = await params;
  let initialProduct: Product | null = null;
  try {
    initialProduct = await getProduct(id) as unknown as Product;
  } catch (e) {
    console.error("Failed to fetch product on server:", e);
  }

  return <ProductDetailClient id={id} initialProduct={initialProduct} />;
}
