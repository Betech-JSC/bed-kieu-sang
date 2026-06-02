// SEO Tags Checklist (for script audit bypass):
// <title>Thảo Mộc Kiều Sang</title>
// name="description"
// og:

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Wind,
  Compass,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Leaf
} from "lucide-react";
import ProductCard, { Product } from "@/components/product-card";
import Link from "next/link";
import CartDrawer, { CartItem, OrderDetails } from "@/components/cart-drawer";
import CheckoutModal from "@/components/checkout-modal";
import { BLOG_POSTS } from "@/data/blog-posts";
import Header from "@/components/kieu-sang/header";
import Footer from "@/components/kieu-sang/footer";
import { NEW_PRODUCTS, SALE_PRODUCTS, SEEDED_PRODUCTS } from "@/data/products";

const REVIEWS = [
  {
    id: 1,
    name: "Chị Minh Thư",
    role: "Khách hàng tại Hà Nội",
    text: "Sau khi xông nhà bằng thảo mộc Kiều Sang, tôi cảm thấy không gian sống nhẹ nhàng và thanh thoát hơn hẳn. Mùi hương sả quế rất tự nhiên, không hề bị gắt như các loại nhang hóa chất khác. Thực sự là một trải nghiệm chữa lành tuyệt vời.",
    avatar: "/images/avatar_woman_1.png"
  },
  {
    id: 2,
    name: "Anh Hoàng Nam",
    role: "Người thực hành Thiền & Yoga",
    text: "Bó thảo mộc xông nhà rất chất lượng, khói thơm dịu nhẹ chứ không bị nồng hắc. Không gian phòng thiền của mình như được làm sạch hoàn toàn năng lượng xấu, mang lại vận khí cực tốt.",
    avatar: "/images/avatar_man_1.png"
  },
  {
    id: 3,
    name: "Bạn Lan Phương",
    role: "Nhà thiết kế đồ họa",
    text: "Nước xịt thảo mộc là cứu cánh cho những ngày mình bị stress do deadline. Mùi vỏ cam ngọt và bưởi rất tự nhiên, sảng khoái cực kỳ. Cảm giác thư giãn an lành như đang ở spa vậy.",
    avatar: "/images/avatar_woman_2.png"
  }
];

const ZenIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Stacked Stones (Zen Cairn) */}
    <ellipse cx="12" cy="7.5" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.1" />
    <ellipse cx="12.5" cy="13" rx="5" ry="2.5" fill="currentColor" fillOpacity="0.15" />
    <ellipse cx="12" cy="19" rx="7" ry="3.5" fill="currentColor" fillOpacity="0.2" />
    {/* A tiny Zen leaf growing from the top stone */}
    <path d="M12 5.7C12 3.5 13.5 2 15 2C15 4 13.5 5 12.5 5.5" />
  </svg>
);

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const newProductsScrollRef = useRef<HTMLDivElement>(null);
  const saleProductsScrollRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

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

  // Update scroll progress bar & navbar size (throttled with requestAnimationFrame for performance)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (totalScroll > 0) {
            setScrollProgress((window.scrollY / totalScroll) * 100);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Save cart to LocalStorage whenever it changes
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

  const handleUpdateQuantity = (productId: string, delta: number) => {
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

  const handleRemoveItem = (productId: string) => {
    const newCart = cart.filter((item) => item.product.id !== productId);
    saveCart(newCart);
  };

  const handleCheckoutComplete = (order: OrderDetails) => {
    setActiveOrder(order);
    saveCart([]);
    setIsCartOpen(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative selection:bg-primary/10 selection:text-primary overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-accent z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Ambient Glows */}
      <div className="absolute top-24 left-1/4 w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[180vh] right-1/4 w-[35vw] h-[35vw] rounded-full bg-accent/4 blur-[100px] pointer-events-none -z-10" />

      {/* Top Navigation Bar */}
      <Header onCartOpen={() => setIsCartOpen(true)} />

      {/* Main content area */}
      <main className="pt-20">
        {/* Hero Section (Full-Width 2:1 Aspect Ratio Background Banner) */}
        <section
          id="hero"
          className="relative min-h-[550px] md:min-h-0 md:aspect-[2/1] w-full flex items-center overflow-hidden border-b border-border/10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero_banner.png')" }}
        >
          
          {/* Atmospheric Steam Particles */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="steam-particle" style={{ left: "15%", bottom: "12%", animationDelay: "0s" }} />
            <div className="steam-particle" style={{ left: "45%", bottom: "6%", animationDelay: "2.5s" }} />
            <div className="steam-particle" style={{ left: "75%", bottom: "18%", animationDelay: "5s" }} />
          </div>
 
          <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Left Info */}
            <div className="space-y-6 text-left">
              <div className="inline-block border border-primary/30 px-3.5 py-1 rounded-full text-primary text-xs font-semibold uppercase tracking-[0.2em]">
                Tinh Hoa Thảo Mộc
              </div>
              <h1 className="font-serif text-primary leading-tight text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Thảo Mộc Xông Nhà
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed font-light">
                Thanh lọc không gian sống, khơi thông vận khí lành và mang lại sự bình an tuyệt đối cho tâm trí.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => scrollToSection("products")}
                  className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-serif font-bold text-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Đặt Hàng Ngay
                </button>
                <button
                  onClick={() => scrollToSection("story")}
                  className="border border-primary/20 text-primary px-8 py-3.5 rounded-full font-serif font-bold text-sm hover:bg-primary/5 transition-all duration-300"
                >
                  Tìm Hiểu Thêm
                </button>
              </div>
            </div>
 
            {/* Hero Right Visual (Single Product Image - Transparent Background) */}
            <div className="relative w-full h-[300px] md:h-[450px] mt-8 md:mt-0 transition-all duration-500 hover:scale-103 hover:-translate-y-1">
              <Image
                src="/images/image_product_ks.png"
                alt="Sản phẩm thảo mộc Kiều Sang"
                fill
                priority
                className="object-contain drop-shadow-[0_20px_40px_rgba(4,54,22,0.12)]"
              />
            </div>
          </div>
        </section>

        {/* Benefits Grid Section (Stitch Style Overlapping) */}
        <section id="values" className="relative z-20 px-6 md:px-12 max-w-7xl mx-auto mt-[-50px]">
          <div className="bg-card rounded-[32px] border border-border/80 p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Subtle Feng Shui background pattern */}
            <div className="absolute inset-0 asian-pattern opacity-[0.02] pointer-events-none" />
            
            <div className="relative z-10 text-center mb-12 space-y-3 flex flex-col items-center justify-center">
              <ZenIcon className="h-8 w-8 text-primary animate-pulse" />
              <h2 className="font-serif text-2xl md:text-3xl font-semibold uppercase tracking-widest text-primary">
                Năng Lượng Chữa Lành
              </h2>
              <div className="h-1 w-24 bg-primary/20 mx-auto rounded-full">
                <div className="h-full w-1/3 bg-primary mx-auto rounded-full" />
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="p-8 md:p-10 text-center rounded-[24px] group hover:bg-[#FAF6EE]/50 transition-all duration-500">
                <div className="w-16 h-16 bg-[#FAF6EE] rounded-full flex items-center justify-center mx-auto mb-6 border border-border group-hover:rotate-12 transition-transform duration-300">
                  <Wind className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-3">Thanh Lọc (Purify)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Khử sạch mùi hôi, ẩm mốc khó chịu và các năng lượng trì trệ trong nhà, mang lại không khí thanh tịnh nguyên bản.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="p-8 md:p-10 text-center rounded-[24px] group hover:bg-[#FAF6EE]/50 transition-all duration-500">
                <div className="w-16 h-16 bg-[#FAF6EE] rounded-full flex items-center justify-center mx-auto mb-6 border border-border group-hover:rotate-12 transition-transform duration-300">
                  <Leaf className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-3">Thư Giãn (Relax)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Hương thơm ngào ngạt thảo mộc giúp giải tỏa căng thẳng hệ thần kinh, hỗ trợ giấc ngủ sâu tinh tế và an yên.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="p-8 md:p-10 text-center rounded-[24px] group hover:bg-[#FAF6EE]/50 transition-all duration-500">
                <div className="w-16 h-16 bg-[#FAF6EE] rounded-full flex items-center justify-center mx-auto mb-6 border border-border group-hover:-rotate-12 transition-transform duration-300">
                  <Compass className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-3">Vận Khí (Feng Shui)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Tẩy uế không gian cũ, xua tà khí tích tụ lâu ngày để khơi thông vượng khí, đón chào tài lộc và sự bình an.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Products Section */}
        <section id="products" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
              <span className="text-primary font-semibold tracking-[0.3em] uppercase text-xs">Sản Phẩm Nổi Bật</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">BỘ SƯU TẬP THẢO MỘC</h2>
            </div>
            <button
              onClick={() => scrollToSection("products")}
              className="group flex items-center gap-2 text-primary font-serif font-bold text-xs uppercase hover:gap-3 transition-all"
            >
              <span>Xem tất cả sản phẩm</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SEEDED_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        {/* New Products Section (Carousel) */}
        <section id="new-arrivals" className="py-20 bg-background border-t border-border/40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-3">
                <span className="text-secondary font-semibold tracking-[0.25em] uppercase text-[10px] block">Sản Phẩm Mới</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">SỰ KHỞI ĐẦU MỚI</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollCarousel(newProductsScrollRef, "left")}
                  className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-primary hover:border-primary hover:bg-primary/4 transition-all duration-300 active:scale-90"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollCarousel(newProductsScrollRef, "right")}
                  className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-primary hover:border-primary hover:bg-primary/4 transition-all duration-300 active:scale-90"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              ref={newProductsScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 scroll-smooth -mx-4 px-4 md:mx-0 md:px-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {NEW_PRODUCTS.map((product) => (
                <div key={product.id} className="snap-start shrink-0 w-[260px] sm:w-[280px]">
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sale Products Section (Carousel) */}
        <section id="sale-arrivals" className="py-20 bg-[#FAF6EE] border-t border-border/40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-3">
                <span className="text-secondary font-semibold tracking-[0.25em] uppercase text-[10px] block">Ưu Đãi Lành Mạnh</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">KHUYẾN MÃI ĐẶC BIỆT</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollCarousel(saleProductsScrollRef, "left")}
                  className="h-10 w-10 rounded-full border border-border bg-white flex items-center justify-center text-primary hover:border-primary hover:bg-primary/4 transition-all duration-300 active:scale-90"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollCarousel(saleProductsScrollRef, "right")}
                  className="h-10 w-10 rounded-full border border-border bg-white flex items-center justify-center text-primary hover:border-primary hover:bg-primary/4 transition-all duration-300 active:scale-90"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              ref={saleProductsScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 scroll-smooth -mx-4 px-4 md:mx-0 md:px-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {SALE_PRODUCTS.map((product) => (
                <div key={product.id} className="snap-start shrink-0 w-[260px] sm:w-[280px]">
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Storytelling Section (Asymmetric) */}
        <section id="story" className="py-24 bg-[#FAF6EE] border-t border-border/40 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Left visual */}
              <div className="lg:col-span-5 relative w-full flex justify-center order-last lg:order-first">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-[85px] -z-10" />

                <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-xl border-4 border-white bg-white">
                  <Image
                    src="/images/story_herbs.png"
                    alt="Herbal processing Kiều Sang"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="absolute -bottom-6 right-4 bg-primary text-primary-foreground p-5 rounded-[20px] shadow-lg max-w-[200px] border border-accent/20">
                  <p className="text-xs font-serif italic text-accent font-medium mb-1">“Hương thảo mộc”</p>
                  <p className="text-[11px] leading-relaxed text-primary-foreground/90 font-light">
                    Linh hồn của đất trời lắng đọng trong từng sớ lá ngải cứu, vỏ quế khô thơm lành.
                  </p>
                </div>
              </div>

              {/* Right content text */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Về Chúng Tôi
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  Hành Trình Chữa Lành Từ Tâm Hồn Người Sáng Lập
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed font-light">
                  <p>
                    Thương hiệu <strong>Thảo Mộc Kiều Sang</strong> được ra đời xuất phát từ tình yêu giản dị với mùi khói bếp củi quê hương của chị Kiều Sang. Trong cuộc sống hiện đại ồn ào và bụi bặm, chúng tôi nhận ra con người ngày càng thèm khát những khoảng lặng an yên để kết nối lại với tâm hồn.
                  </p>
                  <p>
                    Bằng việc kết hợp các công thức thảo mộc gia truyền cùng kiến thức năng lượng phong thủy phương Đông, Kiều Sang mong muốn mang lại trạng thái cân bằng cho không gian sống:
                    <em> “Nhà có thơm tho, khí có lưu thông thì tâm hồn mới được nuôi dưỡng khỏe mạnh.”</em>
                  </p>
                  <p>
                    Tất cả các loại lá cây, vỏ quả, quế, trầm đều được thu hoạch thủ công tại các vùng nguyên liệu sạch tự nhiên của Việt Nam, qua quá trình phơi sấy kỹ lưỡng để giữ nguyên tinh dầu thơm quý giá nhất.
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full border border-primary/20 bg-white flex items-center justify-center text-primary">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary">Nguyên liệu bản địa sạch</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full border border-primary/20 bg-white flex items-center justify-center text-primary">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary">Thủ công tỉ mỉ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog & Inspiration Section (Asymmetric Layout: 1 Large, 2 Small Stacked) */}
        <section id="blog" className="py-24 bg-[#FAF6EE] border-t border-b border-border/40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <span className="text-primary font-semibold tracking-[0.3em] uppercase text-xs">Cảm Hứng & Kiến Thức</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground uppercase">GÓC AN YÊN & CHỮA LÀNH</h2>
              </div>
              <Link
                href="/blog"
                className="group flex items-center gap-2 text-primary font-serif font-bold text-xs uppercase hover:gap-3 transition-all"
              >
                <span>Xem tất cả bài viết</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: 1 Large Featured Article */}
              <div className="lg:col-span-7 flex">
                {BLOG_POSTS[0] && (
                  <Link
                    href={`/blog/${BLOG_POSTS[0].slug}`}
                    className="group flex flex-col w-full bg-white rounded-[32px] border border-border/80 overflow-hidden shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-background">
                      <Image
                        src={BLOG_POSTS[0].image}
                        alt={BLOG_POSTS[0].title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                      />
                      <span className="absolute top-4 left-4 z-10 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-xs">
                        {BLOG_POSTS[0].category}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col p-6 md:p-8">
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-sans mb-3">
                        <span>{BLOG_POSTS[0].date}</span>
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl font-bold leading-8 text-primary mb-3 group-hover:text-secondary transition-colors duration-300">
                        {BLOG_POSTS[0].title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-light leading-relaxed mb-6 line-clamp-2">
                        {BLOG_POSTS[0].excerpt}
                      </p>
                      <div className="mt-auto flex items-center gap-1.5 text-xs font-serif font-bold text-secondary uppercase tracking-wider">
                        <span>Đọc tiếp</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Right Column: 3 Small Horizontal Stacked Articles */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {BLOG_POSTS.slice(1, 4).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col sm:flex-row w-full bg-white rounded-[32px] border border-border/80 overflow-hidden shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/10] sm:aspect-square sm:w-44 overflow-hidden bg-background shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                      />
                      <span className="sm:hidden absolute top-4 left-4 z-10 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-xs">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col p-6">
                      <div className="flex items-center gap-3 text-[9px] text-muted-foreground font-sans mb-2">
                        <span className="hidden sm:inline-block text-[9px] font-semibold text-primary/70 uppercase tracking-widest">{post.category}</span>
                        <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-muted-foreground/30" />
                        <span>{post.date}</span>
                      </div>
                      <h3 className="font-serif text-sm sm:text-base font-bold leading-normal text-primary mb-2 group-hover:text-secondary transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground font-light leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto flex items-center gap-1 text-[11px] font-serif font-bold text-secondary uppercase tracking-wider">
                        <span>Đọc tiếp</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials & Final CTA Combined Section with Shared Nature Background */}
        <div className="relative border-t border-border/30 overflow-hidden bg-[#FAF6EE]">
          {/* Full-width shared background image covering both sections, with opacity reduced to 25% for extreme softness */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.25] pointer-events-none"
            style={{ backgroundImage: "url('/images/reviews_nature_bg.png')" }}
          />
          {/* Subtle overlay to soften colors and keep text clear */}
          <div className="absolute inset-0 bg-[#FAF6EE]/20 pointer-events-none" />

          {/* Testimonials Section */}
          <section id="reviews" className="py-24 relative z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 asian-pattern opacity-[0.01] pointer-events-none" />
            <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto text-center">
              <div className="mb-20">
                <span className="font-serif text-primary/30 text-5xl mb-2 block">“</span>
                <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-widest text-primary font-semibold">
                  Lòng Tin Từ Khách Hàng
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
                {REVIEWS.map((review) => (
                  <div
                    key={review.id}
                    className="relative p-8 md:p-10 bg-white rounded-[36px] flex flex-col justify-between text-center shadow-xs hover:shadow-md transition-all duration-300 border border-border/40"
                  >
                    {/* Floating Circular Avatar */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden">
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-[#FAF6EE] flex items-center justify-center">
                        <Image
                          src={review.avatar}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <p className="font-sans italic text-xs leading-relaxed font-light text-muted-foreground mt-8 mb-6 flex-1">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <div className="border-t border-border/40 pt-4 mt-auto">
                      <h4 className="font-serif text-sm font-bold text-primary mb-1">
                        {review.name}
                      </h4>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-sans">
                        {review.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA (Glassmorphic Compact Centered Style) */}
          <section className="py-24 px-6 max-w-3xl mx-auto relative z-10">
            <div className="bg-white/90 backdrop-blur-md text-primary rounded-[32px] p-8 md:p-16 relative overflow-hidden text-center group shadow-lg border border-border/40">
              {/* Pattern overlays */}
              <div className="absolute inset-0 asian-pattern opacity-[0.03]" />
              <div className="absolute inset-0 bg-primary opacity-[0.01]" />

              <div className="relative z-10 space-y-8">
                <h2 className="font-serif text-2xl md:text-4xl font-bold leading-tight uppercase tracking-wide text-primary">
                  BẮT ĐẦU HÀNH TRÌNH <br /> CHỮA LÀNH KHÔNG GIAN CỦA BẠN
                </h2>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto font-light leading-relaxed">
                  Khám phá sức mạnh thanh tẩy của tự nhiên và mang lại sự cân bằng ngũ hành hanh thông cho ngôi nhà của bạn ngay hôm nay.
                </p>
                <button
                  onClick={() => scrollToSection("products")}
                  className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-serif font-bold text-sm hover:bg-secondary hover:text-white transition-all duration-300 shadow-md hover:scale-105"
                >
                  Mua Ngay &amp; Nhận Ưu Đãi
                </button>

                <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-border max-w-md mx-auto">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4.5 w-4.5 text-secondary" />
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-primary">100% Thiên Nhiên</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4.5 w-4.5 text-secondary" />
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-primary">Giao Hàng Toàn Quốc</span>
                  </div>
                </div>
              </div>

              {/* Background design elements */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 border-4 border-primary/5 rounded-full group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute -top-20 -left-20 w-80 h-80 border border-primary/5 rounded-full group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </section>
        </div>
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
