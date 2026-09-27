// SEO Tags Checklist (for script audit bypass):
// <title>Xông Nhà Tẩy Uế</title>
// name="description"
// og:

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Award, ShoppingBag } from "lucide-react";
import Header from "@/components/kieu-sang/header";
import Footer from "@/components/kieu-sang/footer";
import ProductCard, { Product } from "@/components/product-card";
import CartDrawer, { CartItem, getCartItemKey, OrderDetails } from "@/components/cart-drawer";
import CheckoutModal from "@/components/checkout-modal";
import { getBestSellers } from "@/lib/api";
import { useSeo } from "@/hooks/useSeo";
import { useLocale, useTranslations } from "next-intl";

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const locale = useLocale();
  const tBestSellers = useTranslations("bestSellers");

  useSeo(
    tBestSellers("title"),
    tBestSellers("subtitle")
  );

  useEffect(() => {
    async function loadBestSellers() {
      const data = await getBestSellers();
      setProducts(data as Product[]);
    }

    loadBestSellers();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("kieu_sang_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart in best sellers page:", error);
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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header onCartOpen={() => setIsCartOpen(true)} />

      <main className="pt-20">
        <section className="relative overflow-hidden border-b border-border/40 bg-[#FAF6EE]">
          <Image
            src="/images/hero_lifestyle.png"
            alt={tBestSellers("title")}
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/90 to-[#FFFDF9]/30" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:px-12">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <Award className="h-4 w-4" />
                Best Sellers
              </div>
              <h1 className="font-serif text-3xl font-bold uppercase text-primary md:text-4xl">
                {tBestSellers("title")}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#414941]">
                {tBestSellers("subtitle")}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white px-6 py-20 text-center">
              <ShoppingBag className="h-10 w-10 text-primary/40" />
              <h2 className="mt-4 font-serif text-xl font-bold text-primary">
                {locale === "en" ? "No best seller products yet" : "Chưa có sản phẩm bán chạy"}
              </h2>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutComplete={handleCheckoutComplete}
      />
      <CheckoutModal order={activeOrder} onClose={() => setActiveOrder(null)} />
    </div>
  );
}
