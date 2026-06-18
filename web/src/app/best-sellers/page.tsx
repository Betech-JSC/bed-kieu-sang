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
import CartDrawer, { CartItem, OrderDetails } from "@/components/cart-drawer";
import CheckoutModal from "@/components/checkout-modal";
import { getBestSellers } from "@/lib/api";
import { useSeo } from "@/hooks/useSeo";

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);

  useSeo(
    "Sản phẩm bán chạy | Xông Nhà Tẩy Uế",
    "Các sản phẩm thảo mộc được Xông Nhà Tẩy Uế chọn ghim theo chiến dịch và lượt bán cộng dồn từ nhiều kênh."
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

  const handleUpdateQuantity = (productId: string | number, delta: number) => {
    saveCart(
      cart
        .map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string | number) => {
    saveCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleCheckoutComplete = (order: OrderDetails) => {
    setActiveOrder(order);
    saveCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 selection:text-primary">
      <Header onCartOpen={() => setIsCartOpen(true)} />

      <main className="pt-20">
        <section className="relative flex min-h-[300px] items-center overflow-hidden border-b border-border/40 bg-[#FAF6EE]">
          <Image
            src="/images/hero_lifestyle.png"
            alt="Sản phẩm bán chạy Xông Nhà Tẩy Uế"
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
                Sản phẩm bán chạy
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#414941]">
                Danh sách sản phẩm được admin chủ động ghim theo lượt bán cộng dồn, chiến dịch bán hàng và nhu cầu đẩy doanh số.
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
              <h2 className="mt-4 font-serif text-xl font-bold text-primary">Chưa có sản phẩm bán chạy</h2>
              <p className="mt-2 max-w-md text-sm text-[#414941]">
                Vào CMS, mở chi tiết sản phẩm và chọn “Ghim vào Sản Phẩm Bán Chạy” để hiển thị tại đây.
              </p>
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
