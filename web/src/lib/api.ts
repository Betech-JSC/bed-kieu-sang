import { BLOG_POSTS } from "@/data/blog-posts";

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL);
  }

  if (typeof window === "undefined") {
    return "http://127.0.0.1:8000/api/v1";
  }

  const { protocol, hostname } = window.location;
  const baseHostname = hostname.startsWith("www.") ? hostname.slice(4) : hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://127.0.0.1:8000/api/v1";
  }

  if (hostname.startsWith("cms.")) {
    return `${protocol}//${hostname}/api/v1`;
  }

  return `${protocol}//cms.${baseHostname}/api/v1`;
}

function normalizeApiUrl(url: string) {
  return url
    .replace("://www.cms.", "://cms.")
    .replace(/\/+$/, "")
    .replace(/\/api$/, "/api/v1");
}

function resolveImageUrl(path: string | undefined | null): string {
  if (!path) return "/images/logo.png";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/storage/")) {
    const apiUrl = getApiUrl();
    try {
      const urlObj = new URL(apiUrl);
      return `${urlObj.protocol}//${urlObj.host}${path}`;
    } catch (e) {
      return `http://127.0.0.1:8000${path}`;
    }
  }
  return path;
}

function mapProduct(p: any) {
  if (!p) return p;
  return {
    ...p,
    price: Number(p.price || 0),
    category: typeof p.category === "object" && p.category !== null ? p.category.name : p.category,
    image: resolveImageUrl(p.image_path || p.image),
    originalPrice: p.original_price != null ? Number(p.original_price) : p.originalPrice,
    total_sales: p.total_sales ?? p.totalSales ?? 0,
    is_best_seller: Boolean(p.is_best_seller),
    has_variants: Boolean(p.has_variants),
    variants: Array.isArray(p.variants) ? p.variants.map((variant: any) => ({
      ...variant,
      price: Number(variant.price || 0),
      original_price: variant.original_price != null ? Number(variant.original_price) : undefined,
      stock: Number(variant.stock || 0),
      image: variant.image_path ? resolveImageUrl(variant.image_path) : undefined,
    })) : [],
  };
}

function mapBlog(b: any) {
  if (!b) return b;
  return {
    ...b,
    category: typeof b.category === "object" && b.category !== null ? b.category.name : b.category,
    image: resolveImageUrl(b.image_path || b.image),
    date: b.published_at ? new Date(b.published_at).toLocaleDateString("vi-VN") : b.date || "Gần đây",
  };
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${getApiUrl()}${path}`, {
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

async function fetchRequiredJson<T>(path: string, options?: RequestInit): Promise<T> {
  const data = await fetchJson<T>(path, options);
  if (!data) {
    throw new Error(`API request failed for ${path}`);
  }
  return data;
}

export async function getProducts(category?: string, perPage?: number) {
  const params = new URLSearchParams();
  if (category) {
    params.append("category", category);
  }
  params.append("per_page", perPage?.toString() || "100");
  const path = `/products?${params.toString()}`;
  const data = await fetchRequiredJson<{ data: any[] }>(path);
  return Array.isArray(data.data) ? data.data.map(mapProduct) : [];
}

export async function getBestSellers() {
  const data = await fetchJson<{ data: any[] }>("/products?best_seller=1&per_page=24");

  if (data && Array.isArray(data.data)) {
    return data.data.map(mapProduct);
  }

  return [];
}

export async function getProduct(idOrSlug: string) {
  const data = await fetchJson<any>(`/products/${encodeURIComponent(idOrSlug)}`);
  if (data) {
    return mapProduct(data);
  }
  
  return null;
}

export async function getBlogs(category?: string) {
  const path = category ? `/blogs?category=${encodeURIComponent(category)}` : "/blogs";
  const data = await fetchJson<{ data: any[] }>(path);
  
  if (data && Array.isArray(data.data)) {
    return data.data.map(mapBlog);
  }
  
  return [];
}

export async function getBlog(slug: string) {
  const data = await fetchJson<any>(`/blogs/${encodeURIComponent(slug)}`);
  if (data) {
    return mapBlog(data);
  }
  
  // Fallback to static mock data
  return BLOG_POSTS.find(p => p.slug === slug) || null;
}

export async function getBanners(page = "home", position = "hero") {
  const data = await fetchJson<{ data: any[] }>(`/banners?page=${encodeURIComponent(page)}&position=${encodeURIComponent(position)}`);
  if (data && Array.isArray(data.data)) {
    return data.data.map(b => ({
      ...b,
      image: resolveImageUrl(b.image_path || b.image)
    }));
  }
  return [];
}

export async function getTestimonials() {
  const data = await fetchJson<{ data: any[] }>("/testimonials");
  if (data && Array.isArray(data.data)) {
    return data.data.map(t => ({
      id: t.id,
      name: t.customer_name,
      role: t.is_featured ? "Khách hàng thân thiết" : "Khách hàng",
      text: t.comment,
      avatar: t.customer_avatar || "/images/avatar_woman_1.png"
    }));
  }
  return [];
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
  order_code?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  shipping_address: string;
  notes?: string;
  payment_method: string;
  items: Array<{ product_id?: string | number; product_slug?: string; variant_id?: number; quantity: number }>;
}) {
  const data = await fetchJson<any>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!data?.success) {
    throw new Error("Không thể gửi đơn hàng về CMS. Vui lòng kiểm tra API và database.");
  }

  return data;
}

export async function getFaqs() {
  const data = await fetchRequiredJson<{ data: Array<{ id: number; question: string; answer: string }> }>("/faqs");
  return data.data || [];
}

export async function getProductQuestions(productSlug: string) {
  const data = await fetchJson<{ data: Array<{ id: number; customer_name: string; question: string; answer: string; answered_at: string }> }>(`/products/${encodeURIComponent(productSlug)}/questions`);
  return data?.data || [];
}

export async function submitProductQuestion(productSlug: string, payload: { customer_name: string; customer_email?: string; question: string }) {
  return fetchRequiredJson<{ success: boolean; message: string }>(`/products/${encodeURIComponent(productSlug)}/questions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCategories(type: "product" | "blog" = "product") {
  const data = await fetchJson<any[]>(`/categories?type=${type}`);
  if (data && Array.isArray(data)) {
    return data;
  }
  
  // Fallback to static mock categories
  if (type === "product") {
    return [
      { id: "1", name: "Thanh Lọc Không Gian", slug: "thanh-loc-khong-gian" },
      { id: "2", name: "Thư Giãn Tinh Thần", slug: "thu-gian-tinh-than" },
      { id: "3", name: "Trà An Yên", slug: "tra-an-yen" }
    ];
  } else {
    return [
      { id: "1", name: "Phong Thủy", slug: "phong-thuy" },
      { id: "2", name: "Wellness", slug: "wellness" }
    ];
  }
}

export async function getSettings() {
  const data = await fetchJson<Record<string, string>>("/settings");
  return data || null;
}
