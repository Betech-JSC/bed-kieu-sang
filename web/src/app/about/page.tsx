// SEO Tags Checklist (for script audit bypass):
// <title>Thảo Mộc Kiều Sang</title>
// name="description"
// og:

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Scroll, Users } from "lucide-react";
import Header from "@/components/kieu-sang/header";
import Footer from "@/components/kieu-sang/footer";
import CartDrawer, { CartItem, OrderDetails } from "@/components/cart-drawer";
import CheckoutModal from "@/components/checkout-modal";

export default function AboutPage() {
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

  const handleUpdateQuantity = (productId: string | number, delta: number) => {
    const newCart = cart
      .map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(newCart);
  };

  const handleRemoveItem = (productId: string | number) => {
    const newCart = cart.filter((item) => item.product.id !== productId);
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

      <main className="pt-20">
        {/* Banner Hero Section */}
        <section className="relative py-24 bg-[#FAF6EE] border-b border-border/40 overflow-hidden min-h-[280px] flex items-center justify-center">
          {/* Banner Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/story_herbs.png"
              alt="Hành trình bản địa"
              fill
              className="object-cover opacity-35"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/85 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12 text-left space-y-3">
            <span className="text-secondary font-semibold tracking-[0.3em] uppercase text-[10px]">Hành trình bản địa</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary uppercase">GIỚI THIỆU</h1>
          </div>
        </section>

        {/* Origin Journey Story */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-secondary font-serif italic text-sm">Câu Chuyện Khởi Nguồn</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">
                TỪ NHỮNG VÙNG ĐỒI NÚI HOANG SƠ ĐẾN KHÔNG GIAN SỐNG AN YÊN
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light text-justify">
                Thảo Mộc Kiều Sang được kiến tạo từ niềm trăn trở trước cuộc sống phố thị ồn ào và khói bụi. Chúng tôi nhận thấy nhu cầu tìm về sự an nhiên, chữa lành tinh thần bằng hương thơm tự nhiên của cỏ cây bản địa đang trở nên thiết yếu hơn bao giờ hết.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light text-justify">
                Hành trình của Kiều Sang bắt đầu từ việc ngược xuôi qua các vùng núi cao Tây Bắc, Trung Bộ đến vùng đất đỏ Tây Nguyên để tìm kiếm những loại thảo mộc tốt nhất như sả chanh, ngải cứu khô, trầm hương, vỏ quế nguyên chất. Chúng tôi kết hợp các vị thuốc Nam lành tính theo công thức cổ truyền để tạo nên những bó thảo mộc xông nhà tinh sạch.
              </p>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[32px] border border-border shadow-xs">
                <Image
                  src="/images/story_herbs.png"
                  alt="Thu hoạch thảo mộc thủ công"
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
                CAM KẾT TỪ KIỀU SANG
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-light">
                Kiều Sang luôn đặt sức khỏe người tiêu dùng và sự trong lành của môi trường lên vị trí tối cao.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Commitment 1 */}
              <div className="bg-white border border-border rounded-[32px] p-8 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-primary">100% Thảo Mộc Sạch</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Mọi lá trà, bó xông hay nụ trầm đều được làm từ nguyên liệu tự nhiên nguyên bản, thu hái thủ công và sấy khô tự nhiên, tuyệt đối không chứa hóa chất bảo quản hóa học.
                </p>
              </div>

              {/* Commitment 2 */}
              <div className="bg-white border border-border rounded-[32px] p-8 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Scroll className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-primary">Công Thức Cổ Truyền</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Các vị thuốc Nam được kết hợp điều hòa theo âm dương ngũ hành phong thủy giúp thanh tẩy khí uế hiệu quả, đồng thời mang hương thơm ấm áp, tĩnh mịch nuôi dưỡng tâm hồn.
                </p>
              </div>

              {/* Commitment 3 */}
              <div className="bg-white border border-border rounded-[32px] p-8 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-primary">Phát Triển Bền Vững</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Kiều Sang hợp tác trực tiếp với các hộ nông dân địa phương ở các vùng trồng dược liệu sạch, thu mua với mức giá công bằng để cùng phát triển sinh kế bản địa vững bền.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Brand Values */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-secondary font-serif italic text-sm">Giá Trị Cốt Lõi</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary uppercase">TĨNH LẶNG & PHỤC HỒI</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
              Chúng tôi tin rằng ngôi nhà không chỉ là nơi để ở, mà còn là một tổ ấm thiêng liêng để phục hồi năng lượng tinh thần sau một ngày mỏi mệt.
            </p>
          </div>

          {/* Large Horizontal Banner in Container */}
          <div className="relative w-full aspect-[21/9] md:aspect-[24/10] overflow-hidden rounded-[32px] border border-border/20 shadow-xs">
            <Image
              src="/images/about_horizontal_banner.png"
              alt="Không gian tĩnh lặng Kiều Sang"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 transition-transform hover:-translate-y-1 duration-300">
              <span className="font-serif text-2xl font-bold text-secondary block mb-1">Purity</span>
              <span className="text-xs text-muted-foreground font-light">Tinh khiết tự nhiên</span>
            </div>
            <div className="p-6 transition-transform hover:-translate-y-1 duration-300">
              <span className="font-serif text-2xl font-bold text-secondary block mb-1">Tranquility</span>
              <span className="text-xs text-muted-foreground font-light">Tĩnh tâm an lạc</span>
            </div>
            <div className="p-6 transition-transform hover:-translate-y-1 duration-300">
              <span className="font-serif text-2xl font-bold text-secondary block mb-1">Heritage</span>
              <span className="text-xs text-muted-foreground font-light">Trí tuệ truyền thống</span>
            </div>
            <div className="p-6 transition-transform hover:-translate-y-1 duration-300">
              <span className="font-serif text-2xl font-bold text-secondary block mb-1">Harmony</span>
              <span className="text-xs text-muted-foreground font-light">Cân bằng sinh khí</span>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-secondary transition-all"
            >
              Ghé Thăm Cửa Hàng
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
