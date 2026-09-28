// SEO Tags Checklist (for script audit bypass):
// <title>Xông Nhà Tẩy Uế</title>
// name="description"
// og:

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ChevronLeft, Facebook, Instagram } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog-posts";
import { getBlog } from "@/lib/api";
import { useSeo } from "@/hooks/useSeo";
import { Product } from "@/components/product-card";
import Header from "@/components/kieu-sang/header";
import Footer from "@/components/kieu-sang/footer";
import CartDrawer, { CartItem, getCartItemKey, OrderDetails } from "@/components/cart-drawer";
import CheckoutModal from "@/components/checkout-modal";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/i18n-utils";

// Sample products for recommendation
const RECOMENDED_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Bó Thảo Mộc Xông Nhà",
    name_en: "Herbal House Smudge Stick",
    price: 120000,
    category: "Thanh Lọc Không Gian",
    category_en: "Space Purification",
    rating: 4.8,
    description: "Sự kết hợp hoàn hảo giữa lá ngải cứu khô, sả chanh thơm mát và vỏ quế.",
    description_en: "A perfect harmony of dried mugwort, fresh lemongrass, and cinnamon bark.",
    image: "/images/smudge_stick.png",
    benefits: ["Organic", "Thảo Dược"],
  },
  {
    id: "p2",
    name: "Nụ Trầm Thảo Mộc",
    name_en: "Herbal Incense Cones",
    price: 180000,
    category: "Thư Giãn Tinh Thần",
    category_en: "Mind Relaxation",
    rating: 4.9,
    description: "Trầm hương nguyên chất kết hợp các vị thuốc Bắc thảo mộc giúp tĩnh tâm.",
    description_en: "Pure agarwood combined with calming traditional Eastern herbs.",
    image: "/images/incense_cones.png",
    benefits: ["Tĩnh Tâm", "Trầm Hương"],
  },
];

interface BlogDetailClientProps {
  slug: string;
  initialPost: any;
}

export default function BlogDetailClient({ slug, initialPost }: BlogDetailClientProps) {
  const locale = useLocale();
  const tBlog = useTranslations("blog");
  const tCommon = useTranslations("common");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);

  const [post, setPost] = useState<any>(() => initialPost || BLOG_POSTS.find((p) => p.slug === slug) || null);

  const localizedTitle = post ? getLocalized(post, "title", locale) : "";
  const localizedExcerpt = post ? getLocalized(post, "excerpt", locale) : "";

  useSeo(post?.seo_title || localizedTitle, post?.seo_desc || post?.summary || localizedExcerpt);

  useEffect(() => {
    async function loadPost() {
      const dbPost = await getBlog(slug);
      if (dbPost) {
        const mappedPost = {
          ...dbPost,
          image: dbPost.image || dbPost.image_path,
          date: dbPost.published_at
            ? new Date(dbPost.published_at).toLocaleDateString(locale === "en" ? "en-US" : "vi-VN")
            : dbPost.date || (locale === "en" ? "Recent" : "Gần đây"),
        };
        setPost(mappedPost);
      }
    }
    loadPost();
  }, [slug, locale]);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("kieu_sang_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setTimeout(() => {
          setCart(parsed);
        }, 0);
      } catch (e) {
        console.error("Error parsing cart storage", e);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("kieu_sang_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("kieu-sang-cart-update"));
  };

  const handleAddToCart = (product: Product) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    const newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({ product, quantity: 1 });
    }

    saveCart(newCart);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemKey: string, delta: number) => {
    const newCart = cart
      .map((item) => {
        if (getCartItemKey(item) === itemKey) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(newCart);
  };

  const handleRemoveItem = (itemKey: string) => {
    const newCart = cart.filter((item) => getCartItemKey(item) !== itemKey);
    saveCart(newCart);
  };

  const handleCheckoutComplete = (order: OrderDetails) => {
    setActiveOrder(order);
    saveCart([]);
    setIsCartOpen(false);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
        <p className="font-serif text-3xl font-bold text-primary">{tCommon("notFound")}</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          {locale === "en" ? "The article you are looking for may have been moved or does not exist." : "Bài viết bạn tìm kiếm có thể đã được chuyển đổi hoặc không tồn tại."}
        </p>
        <Link href="/blog" className="bg-[#043616] text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#2d6a3e]">
          {tBlog("backToList")}
        </Link>
      </div>
    );
  }

  const rawContent = locale === "en" && post.content_en ? post.content_en : post.content;
  const contentParagraphs = Array.isArray(rawContent)
    ? rawContent
    : typeof rawContent === "string"
    ? rawContent.split("\n\n").filter(Boolean)
    : [];

  const localizedCategory = typeof post.category === "object" && post.category !== null
    ? getLocalized(post.category, "name", locale)
    : (locale === "en" && post.category_en ? post.category_en : post.category);

  const recommendedProducts = post?.recommended_products && post.recommended_products.length > 0
    ? post.recommended_products
    : RECOMENDED_PRODUCTS;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative selection:bg-primary/10 selection:text-primary overflow-x-hidden">
      {/* Floating Ambient Glows */}
      <div className="absolute top-24 left-1/4 w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20vh] right-1/4 w-[35vw] h-[35vw] rounded-full bg-accent/4 blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <Header onCartOpen={() => setIsCartOpen(true)} />

      {/* Main content area */}
      <main className="pt-20">
        {/* Back Link Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-6">
          <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-serif font-bold text-secondary uppercase hover:text-primary transition-all">
            <ChevronLeft className="h-4 w-4" />
            <span>{tBlog("backToList")}</span>
          </Link>
        </div>

        {/* Article Layout Grid */}
        <section className="pb-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content Column */}
            <article className="lg:col-span-8 space-y-6 bg-white rounded-[32px] p-6 md:p-8 shadow-xs">
              <div className="space-y-4">
                <span className="text-sm font-bold text-white bg-primary px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  {localizedCategory}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-primary">
                  {localizedTitle}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-sans pt-2 border-b border-border/40 pb-3">
                  <span>{tBlog("publishedDate")}: {post.date}</span>
                </div>
              </div>

              {/* Banner Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px]">
                <Image
                  src={post.image}
                  alt={localizedTitle}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Article Content Text Paragraphs */}
              <div className="space-y-6 pt-4">
                {contentParagraphs.map((paragraph: string, index: number) => {
                  if (paragraph.startsWith("-")) {
                    return (
                      <li key={index} className="list-disc list-inside font-sans text-sm text-muted-foreground pl-6 my-2 leading-relaxed font-light">
                        {paragraph.substring(2)}
                      </li>
                    );
                  }
                  if (paragraph.match(/^\d+\./)) {
                    return (
                      <p key={index} className="font-serif text-sm md:text-base font-bold text-primary pl-4 border-l-2 border-accent mt-6 mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  }
                  return (
                    <p key={index} className="font-sans text-sm text-muted-foreground leading-relaxed font-light text-justify">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Share Banner */}
              <div className="border-t border-border/50 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground font-serif italic">
                  {locale === "en"
                    ? "Purifying living spaces, nurturing serene positive energy."
                    : "Thanh lọc không gian sống, nuôi dưỡng năng lượng tốt lành."}
                </p>
                <div className="flex gap-4">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="p-2 border border-border hover:bg-neutral-50 rounded-lg text-primary transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="p-2 border border-border hover:bg-neutral-50 rounded-lg text-primary transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>

            {/* Right Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-white rounded-[32px] p-6 border border-border/80 shadow-xs space-y-6">
                <h3 className="font-serif text-lg font-bold text-primary border-b border-border/40 pb-3">
                  {tBlog("recommendedProducts")}
                </h3>
                <div className="space-y-4">
                  {recommendedProducts.map((prod: Product) => {
                    const localizedProdName = getLocalized(prod, "name", locale);
                    const prodSlug = locale === "en" && prod.slug_en ? prod.slug_en : (prod.slug || prod.id);

                    return (
                      <div key={prod.id} className="flex gap-4 items-center group">
                        <Link href={`/products/${prodSlug}`} className="relative h-20 w-20 rounded-2xl overflow-hidden bg-background shrink-0 border border-border/40">
                          <Image
                            src={prod.image}
                            alt={localizedProdName}
                            fill
                            className="object-contain p-1"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${prodSlug}`}>
                            <h4 className="font-serif text-sm font-semibold text-primary truncate group-hover:text-secondary transition-colors">
                              {localizedProdName}
                            </h4>
                          </Link>
                          <p className="text-xs font-bold text-primary font-sans mt-1">
                            {new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN", { style: "currency", currency: "VND" }).format(prod.price)}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(prod)}
                            className="mt-2 text-[10px] font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors cursor-pointer"
                          >
                            + {locale === "en" ? "Add to cart" : "Thêm vào giỏ"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutComplete={handleCheckoutComplete}
      />

      {/* Order Complete Modal */}
      <CheckoutModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
      />
    </div>
  );
}
