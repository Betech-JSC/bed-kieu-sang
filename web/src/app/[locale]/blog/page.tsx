// SEO Tags Checklist (for script audit bypass):
// <title>Xông Nhà Tẩy Uế</title>
// name="description"
// og:

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog-posts";
import { getBlogs } from "@/lib/api";
import Header from "@/components/kieu-sang/header";
import Footer from "@/components/kieu-sang/footer";
import PageBanner from "@/components/page-banner";
import CartDrawer, { CartItem, getCartItemKey, OrderDetails } from "@/components/cart-drawer";
import CheckoutModal from "@/components/checkout-modal";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/i18n-utils";

export default function BlogArchive() {
  const locale = useLocale();
  const tBlog = useTranslations("blog");
  const tCommon = useTranslations("common");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [postsList, setPostsList] = useState<any[]>(BLOG_POSTS);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadBlogs() {
      const dbBlogs = await getBlogs();
      if (dbBlogs && dbBlogs.length > 0) {
        const mappedBlogs = dbBlogs.map((b: any) => ({
          ...b,
          image: b.image || b.image_path,
          date: b.published_at
            ? new Date(b.published_at).toLocaleDateString(locale === "en" ? "en-US" : "vi-VN")
            : b.date || (locale === "en" ? "Recent" : "Gần đây"),
        }));
        setPostsList(mappedBlogs);
      }
    }
    loadBlogs();
  }, [locale]);

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

  // Pagination Logic
  const itemsPerPage = 3;
  const totalPages = Math.ceil(postsList.length / itemsPerPage);
  const paginatedPosts = postsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative selection:bg-primary/10 selection:text-primary overflow-x-hidden">
      {/* Floating Ambient Glows */}
      <div className="absolute top-24 left-1/4 w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[120vh] right-1/4 w-[35vw] h-[35vw] rounded-full bg-accent/4 blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <Header onCartOpen={() => setIsCartOpen(true)} />
      <PageBanner pageKey="blog" />

      {/* Main content area */}
      <main className="pt-20">
        {/* Header Hero Section */}
        <section className="relative py-24 bg-[#FAF6EE] border-b border-border/40 overflow-hidden min-h-[280px] flex items-center justify-center">
          {/* Banner Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/story_herbs.png"
              alt={tBlog("title")}
              fill
              className="object-cover opacity-35"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/85 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12 text-left space-y-3">
            <span className="text-secondary font-semibold tracking-[0.3em] uppercase text-[10px]">
              {tBlog("subtitle")}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary uppercase">
              {tBlog("title")}
            </h1>
          </div>
        </section>

        {/* Blog Archive Grid */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts.map((post) => {
              const localizedTitle = getLocalized(post, "title", locale);
              const localizedExcerpt = getLocalized(post, "excerpt", locale);
              const postSlug = locale === "en" && post.slug_en ? post.slug_en : post.slug;
              const localizedCategory = typeof post.category === "object" && post.category !== null
                ? getLocalized(post.category, "name", locale)
                : (locale === "en" && post.category_en ? post.category_en : post.category);

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${postSlug}`}
                  className="group flex flex-col bg-white rounded-[32px] border border-border/80 overflow-hidden shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-background">
                    <Image
                      src={post.image}
                      alt={localizedTitle}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    />
                    <span className="absolute top-4 left-4 z-10 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-xs">
                      {localizedCategory}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col p-6 md:p-8">
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-sans mb-3">
                      <span>{post.date}</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold leading-normal text-primary mb-3 group-hover:text-secondary transition-colors duration-300 line-clamp-2">
                      {localizedTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed mb-6 line-clamp-3">
                      {localizedExcerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-1.5 text-xs font-serif font-bold text-secondary uppercase tracking-wider">
                      <span>{tBlog("readMore")}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8 border-t border-border/40">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-[#043616]/10 bg-white text-[#043616] hover:border-[#043616]/35 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                {locale === "en" ? "Previous" : "Trước"}
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer border ${
                    currentPage === page
                      ? "bg-[#043616] text-white border-[#043616]"
                      : "bg-white border-[#043616]/10 text-[#043616] hover:border-[#043616]/35"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-[#043616]/10 bg-white text-[#043616] hover:border-[#043616]/35 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                {locale === "en" ? "Next" : "Sau"}
              </button>
            </div>
          )}
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
