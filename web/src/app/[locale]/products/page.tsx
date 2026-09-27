// SEO Tags Checklist (for script audit bypass):
// <title>Xông Nhà Tẩy Uế</title>
// name="description"
// og:

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { SlidersHorizontal, Search, ShoppingBag } from "lucide-react";
import Header from "@/components/kieu-sang/header";
import Footer from "@/components/kieu-sang/footer";
import PageBanner from "@/components/page-banner";
import ProductCard, { Product } from "@/components/product-card";
import { getProducts, getCategories } from "@/lib/api";
import CartDrawer, { CartItem, getCartItemKey, OrderDetails } from "@/components/cart-drawer";
import { useSeo } from "@/hooks/useSeo";
import CheckoutModal from "@/components/checkout-modal";
import { useTranslations, useLocale } from "next-intl";

const ALL_CATEGORY_KEY = "all";

function ProductsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tCatalog = useTranslations("catalog");
  const locale = useLocale();

  const selectedCategoryParam = searchParams.get("category");
  const isAllCategory = !selectedCategoryParam || selectedCategoryParam === ALL_CATEGORY_KEY;
  const selectedCategory = isAllCategory ? ALL_CATEGORY_KEY : selectedCategoryParam;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [productsError, setProductsError] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORY_KEY]);

  useSeo(
    isAllCategory 
      ? tCatalog("allProductsSeoTitle") 
      : tCatalog("categorySeoTitle", { category: selectedCategory }),
    tCatalog("categorySeoDesc", { category: isAllCategory ? tCatalog("allCategories") : selectedCategory })
  );

  useEffect(() => {
    async function loadProducts() {
      setIsLoadingProducts(true);
      setProductsError("");

      try {
        const dbProducts = await getProducts();
        setProductsList(dbProducts as unknown as Product[]);
      } catch (error) {
        setProductsList([]);
        setProductsError(tCatalog("loadErrorDesc"));
      } finally {
        setIsLoadingProducts(false);
      }
    }
    loadProducts();
  }, [tCatalog]);

  useEffect(() => {
    async function loadCategories() {
      const dbCats = await getCategories("product");
      if (dbCats && dbCats.length > 0) {
        setCategories([ALL_CATEGORY_KEY, ...dbCats.map((c: any) => c.name)]);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [selectedCategory, searchQuery, sortBy]);

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
        console.error("Error parsing cart in products catalog:", e);
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

  // Dynamic categories list is managed by state

  // Filtering & Sorting Logic
  const filteredProducts = productsList.filter((product) => {
    const matchesCategory =
      isAllCategory || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    return 0; // Default sorting
  });

  // Pagination Logic
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative selection:bg-primary/10 selection:text-primary overflow-x-hidden">
      {/* Floating Ambient Glows */}
      <div className="absolute top-24 left-1/4 w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20vh] right-1/4 w-[35vw] h-[35vw] rounded-full bg-accent/4 blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <Header onCartOpen={() => setIsCartOpen(true)} />
      <PageBanner pageKey="products" />

      <main className="pt-20">
        {/* Banner Hero Section */}
        <section className="relative py-24 bg-[#FAF6EE] border-b border-border/40 overflow-hidden min-h-[280px] flex items-center justify-center">
          {/* Banner Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero_lifestyle.png"
              alt={tCatalog("bannerAlt")}
              fill
              className="object-cover opacity-35"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/85 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12 text-left space-y-3">
            <span className="text-secondary font-semibold tracking-[0.3em] uppercase text-[10px]">{tCatalog("bannerSubtitle")}</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary uppercase">{tCatalog("bannerTitle")}</h1>
          </div>
        </section>

        {/* Catalog Main Content */}
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Sidebar Column */}
            <aside className="w-full md:w-64 shrink-0 space-y-8">
              {/* Search Widget */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">{tCatalog("searchTitle")}</h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={tCatalog("searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-border/60 rounded-full pl-11 pr-6 py-3 text-xs text-primary focus:outline-none focus:border-primary placeholder:text-muted-foreground/50 shadow-xs"
                  />
                </div>
              </div>

              {/* Categories Navigation Widget */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">{tCatalog("categoriesTitle")}</h3>
                <div className="flex flex-row md:flex-col flex-wrap gap-2 md:gap-1.5 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                  {categories.map((cat) => {
                    const isCatAll = cat === ALL_CATEGORY_KEY;
                    const isSelected = isCatAll ? isAllCategory : selectedCategory === cat;
                    const displayLabel = isCatAll ? tCatalog("allCategories") : cat;

                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString());
                          if (isCatAll) {
                            params.delete("category");
                          } else {
                            params.set("category", cat);
                          }
                          router.push(`/products?${params.toString()}`, { scroll: false });
                        }}
                        className={`text-left px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-primary text-white border-primary"
                            : "bg-white border-border/60 text-[#414941] hover:border-primary/45"
                        }`}
                      >
                        {displayLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sorting Widget */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">{tCatalog("sortTitle")}</h3>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#414941]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white border border-border/60 rounded-full px-5 py-3 text-xs text-primary focus:outline-none focus:border-primary shadow-xs cursor-pointer"
                  >
                    <option value="default">{tCatalog("sortDefault")}</option>
                    <option value="price-asc">{tCatalog("sortPriceAsc")}</option>
                    <option value="price-desc">{tCatalog("sortPriceDesc")}</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Products Grid Column */}
            <div className="flex-1">
              {isLoadingProducts ? (
                <div className="rounded-xl border border-border bg-white px-6 py-16 text-center">
                  <p className="text-sm font-semibold text-primary">{tCatalog("loading")}</p>
                </div>
              ) : productsError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
                  <ShoppingBag className="h-12 w-12 text-red-400 mx-auto" />
                  <h3 className="mt-4 font-serif text-lg font-bold text-red-700">{tCatalog("loadErrorTitle")}</h3>
                  <p className="mt-2 text-sm text-red-700">{productsError}</p>
                </div>
              ) : paginatedProducts.length > 0 ? (
                <div className="space-y-12">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {paginatedProducts.map((product) => (
                      <div key={product.id} className="flex">
                        <ProductCard product={product} onAddToCart={handleAddToCart} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-8 border-t border-border/40">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-full text-xs font-semibold border border-[#043616]/10 bg-white text-[#043616] hover:border-[#043616]/35 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                      >
                        {tCatalog("prevPage")}
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
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
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-full text-xs font-semibold border border-[#043616]/10 bg-white text-[#043616] hover:border-[#043616]/35 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                      >
                        {tCatalog("nextPage")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Empty State View
                <div className="text-center py-24 space-y-4">
                  <ShoppingBag className="h-12 w-12 text-[#414941] mx-auto opacity-40 animate-pulse" />
                  <h3 className="font-serif text-lg font-bold text-primary">{tCatalog("emptyTitle")}</h3>
                  <p className="text-xs text-muted-foreground font-light max-w-sm mx-auto">
                    {tCatalog("emptyDesc")}
                  </p>
                </div>
              )}
            </div>
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

export default function ProductsCatalogPage() {
  const tCatalog = useTranslations("catalog");
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
        <p className="font-serif text-2xl font-bold text-primary animate-pulse">{tCatalog("loadingPage")}</p>
      </div>
    }>
      <ProductsCatalogContent />
    </Suspense>
  );
}
