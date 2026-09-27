import type { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";
import { getBlog } from "@/lib/api";
import { getLocalized } from "@/lib/i18n-utils";

interface BlogPostDetailProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: BlogPostDetailProps): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const post = await getBlog(slug);
    if (!post) {
      return {
        title: locale === "en" ? "Article Not Found | Kieu Sang" : "Không tìm thấy bài viết | Xông Nhà Tẩy Uế",
      };
    }
    const localizedTitle = getLocalized(post, "title", locale);
    const localizedDesc = getLocalized(post, "excerpt", locale) || post.summary;
    const title = post.seo_title || `${localizedTitle} | ${locale === "en" ? "Kieu Sang" : "Xông Nhà Tẩy Uế"}`;
    const description = post.seo_desc || localizedDesc;
    const imageUrl = post.image || "/images/logo.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: localizedTitle,
          },
        ],
        type: "article",
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
      title: locale === "en" ? "Blog | Kieu Sang" : "Bài viết | Xông Nhà Tẩy Uế",
    };
  }
}

export default async function BlogPostDetailPage({ params }: BlogPostDetailProps) {
  const { slug } = await params;
  let initialPost: any = null;
  try {
    initialPost = await getBlog(slug);
  } catch (e) {
    console.error("Failed to fetch blog post on server:", e);
  }

  return <BlogDetailClient slug={slug} initialPost={initialPost} />;
}
