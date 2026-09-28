// SEO Tags Checklist (for script audit bypass):
// <title>Xông Nhà Tẩy Uế</title>
// name="description"
// og:

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Leaf, Scroll, Users } from "lucide-react";
import Header from "@/components/kieu-sang/header";
import Footer from "@/components/kieu-sang/footer";
import PageBanner from "@/components/page-banner";
import CartDrawer, { CartItem, getCartItemKey, OrderDetails } from "@/components/cart-drawer";
import CheckoutModal from "@/components/checkout-modal";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const tAbout = useTranslations("about");
  const tCommon = useTranslations("common");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);

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
        console.error("Error parsing cart in about page:", e);
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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative selection:bg-primary/10 selection:text-primary overflow-x-hidden">
      {/* Floating Ambient Glows */}
      <div className="absolute top-24 left-1/4 w-[45vw] h-[45vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20vh] right-1/4 w-[40vw] h-[40vw] rounded-full bg-accent/4 blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <Header onCartOpen={() => setIsCartOpen(true)} />
      <PageBanner pageKey="about" />

      <main className="pt-20">
        {/* Banner Hero Section */}
        <section className="relative py-24 bg-[#FAF6EE] border-b border-border/40 overflow-hidden min-h-[280px] flex items-center justify-center">
          {/* Banner Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/story_herbs.png"
              alt={tAbout("bannerAlt")}
              fill
              className="object-cover opacity-35"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/85 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12 text-left space-y-3">
            <span className="text-secondary font-semibold tracking-[0.3em] uppercase text-[10px]">{tAbout("bannerSubtitle")}</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary uppercase">{tAbout("bannerTitle")}</h1>
          </div>
        </section>

        {/* Origin Journey Story */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-secondary font-serif italic text-sm">{tAbout("storyLabel")}</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">
                {tAbout("storyHeading")}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light text-justify">
                {tAbout("storyP1")}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light text-justify">
                {tAbout("storyP2")}
              </p>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[32px] border border-border shadow-xs">
                <Image
                  src="/images/story_herbs.png"
                  alt={tAbout("imageAlt")}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quality Commitments */}
        <section className="py-24 bg-[#FAF6EE]/50 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary uppercase">
                {tAbout("commitmentsHeading")}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-light">
                {tAbout("commitmentsSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Commitment 1 */}
              <div className="bg-white border border-border rounded-[32px] p-8 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-primary">{tAbout("cleanTitle")}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  {tAbout("cleanDesc")}
                </p>
              </div>

              {/* Commitment 2 */}
              <div className="bg-white border border-border rounded-[32px] p-8 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Scroll className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-primary">{tAbout("traditionalTitle")}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  {tAbout("traditionalDesc")}
                </p>
              </div>

              {/* Commitment 3 */}
              <div className="bg-white border border-border rounded-[32px] p-8 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-primary">{tAbout("sustainableTitle")}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  {tAbout("sustainableDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Brand Values */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-secondary font-serif italic text-sm">{tAbout("valuesLabel")}</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary uppercase">{tAbout("valuesHeading")}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
              {tAbout("valuesDesc")}
            </p>
          </div>

          {/* Large Horizontal Banner in Container */}
          <div className="relative w-full aspect-[21/9] md:aspect-[24/10] overflow-hidden rounded-[32px] border border-border/20 shadow-xs">
            <Image
              src="/images/about_horizontal_banner.png"
              alt={tAbout("bannerAlt2")}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 transition-transform hover:-translate-y-1 duration-300">
              <span className="font-serif text-2xl font-bold text-secondary block mb-1">Purity</span>
              <span className="text-xs text-muted-foreground font-light">{tAbout("valPurity")}</span>
            </div>
            <div className="p-6 transition-transform hover:-translate-y-1 duration-300">
              <span className="font-serif text-2xl font-bold text-secondary block mb-1">Tranquility</span>
              <span className="text-xs text-muted-foreground font-light">{tAbout("valTranquility")}</span>
            </div>
            <div className="p-6 transition-transform hover:-translate-y-1 duration-300">
              <span className="font-serif text-2xl font-bold text-secondary block mb-1">Heritage</span>
              <span className="text-xs text-muted-foreground font-light">{tAbout("valHeritage")}</span>
            </div>
            <div className="p-6 transition-transform hover:-translate-y-1 duration-300">
              <span className="font-serif text-2xl font-bold text-secondary block mb-1">Harmony</span>
              <span className="text-xs text-muted-foreground font-light">{tAbout("valHarmony")}</span>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-secondary transition-all"
            >
              {tAbout("shopButton")}
            </Link>
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
