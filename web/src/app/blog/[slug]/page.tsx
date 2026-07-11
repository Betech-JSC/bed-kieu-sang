import type { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";
import { getBlog } from "@/lib/api";

interface BlogPostDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostDetailProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlog(slug);
    if (!post) {
      return {
        title: "Không tìm thấy bài viết | Xông Nhà Tẩy Uế",
      };
    }
    const title = post.seo_title || `${post.title} | Xông Nhà Tẩy Uế`;
    const description = post.seo_desc || post.summary || post.excerpt;
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
            alt: post.title,
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
      title: "Bài viết | Xông Nhà Tẩy Uế",
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
