import { PRODUCTS } from "@/data/products";
import { BLOG_POSTS } from "@/data/blog-posts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

function mapProduct(p: any) {
  if (!p) return p;
  return {
    ...p,
    category: typeof p.category === "object" && p.category !== null ? p.category.name : p.category,
    image: p.image_path || p.image,
    originalPrice: p.original_price !== undefined ? p.original_price : p.originalPrice,
  };
}

function mapBlog(b: any) {
  if (!b) return b;
  return {
    ...b,
    category: typeof b.category === "object" && b.category !== null ? b.category.name : b.category,
    image: b.image_path || b.image,
    date: b.published_at ? new Date(b.published_at).toLocaleDateString("vi-VN") : b.date || "Gần đây",
  };
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return await res.json() as T;
  } catch (error) {
    console.warn(`[API Fallback] Request failed for ${path}:`, error);
    return null;
  }
}

export async function getProducts(category?: string) {
  const path = category ? `/products?category=${encodeURIComponent(category)}` : "/products";
  const data = await fetchJson<{ data: any[] }>(path);
  
  if (data && Array.isArray(data.data)) {
    return data.data.map(mapProduct);
  }
  
  // Fallback to static mock data
  if (category) {
    return PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  return PRODUCTS;
}

export async function getProduct(idOrSlug: string) {
  const data = await fetchJson<any>(`/products/${encodeURIComponent(idOrSlug)}`);
  if (data) {
    return mapProduct(data);
  }
  
  return PRODUCTS.find((p: any) => p.id === idOrSlug || p.slug === idOrSlug) || null;
}

export async function getBlogs(category?: string) {
  const path = category ? `/blogs?category=${encodeURIComponent(category)}` : "/blogs";
  const data = await fetchJson<{ data: any[] }>(path);
  
  if (data && Array.isArray(data.data)) {
    return data.data.map(mapBlog);
  }
  
  // Fallback to static mock data
  if (category) {
    return BLOG_POSTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  return BLOG_POSTS;
}

export async function getBlog(slug: string) {
  const data = await fetchJson<any>(`/blogs/${encodeURIComponent(slug)}`);
  if (data) {
    return mapBlog(data);
  }
  
  // Fallback to static mock data
  return BLOG_POSTS.find(p => p.slug === slug) || null;
}

export async function submitContact(payload: {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}) {
  const data = await fetchJson<any>("/contacts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data || { success: true, message: "Mock contact submission success" };
}

export async function submitOrder(payload: {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  shipping_address: string;
  notes?: string;
  payment_method: string;
  items: Array<{ product_id: string | number; quantity: number }>;
}) {
  const data = await fetchJson<any>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data || { success: true, order_code: "KS-MOCK123", message: "Mock order checkout success" };
}
