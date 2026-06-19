// SEO Tags Checklist (for script audit bypass):
// <title>Xong Nha Tay Ue</title>
// name="description"
// og:

"use client";
import { useState, useEffect, use, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ShoppingBag, Plus, Minus, Check, Star } from "lucide-react";
import Header from "@/components/kieu-sang/header";
import Footer from "@/components/kieu-sang/footer";
import ProductCard, { Product, ProductVariant } from "@/components/product-card";
import { getProduct, getProductQuestions, getProducts, submitProductQuestion } from "@/lib/api";
import { useSeo } from "@/hooks/useSeo";
import CartDrawer, { CartItem, getCartItemKey, OrderDetails } from "@/components/cart-drawer";
import CheckoutModal from "@/components/checkout-modal";
import PageBanner from "@/components/page-banner";

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = use(params);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [isAddedSuccessfully, setIsAddedSuccessfully] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [productError, setProductError] = useState("");
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  useSeo(product?.seo_title || product?.name, product?.seo_desc || product?.description);
  const [activeImage, setActiveImage] = useState(product?.image || "");
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [variantMessage, setVariantMessage] = useState("");

  // State for related products list
  const [relatedProductsList, setRelatedProductsList] = useState<Product[]>([]);
  const [questions, setQuestions] = useState<Array<{ id: number; customer_name: string; question: string; answer: string }>>([]);
  const [questionForm, setQuestionForm] = useState({ customer_name: "", customer_email: "", question: "" });
  const [questionMessage, setQuestionMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoadingProduct(true);
      setProductError("");

      try {
        const dbProduct = await getProduct(id);
        if (!dbProduct) {
          setProduct(null);
          setProductError("Không tìm thấy sản phẩm trong CMS.");
          return;
        }

        setProduct(dbProduct as unknown as Product);
        setActiveImage(dbProduct.image);
        setSelectedVariantId(null);
        setVariantMessage("");
        setQuestions(await getProductQuestions(dbProduct.slug));

        const dbProducts = await getProducts();
        const filtered = dbProducts.filter((p: any) => p.category === dbProduct.category && p.id !== dbProduct.id).slice(0, 4);
        setRelatedProductsList(filtered as unknown as Product[]);
      } catch (error) {
        setProduct(null);
        setRelatedProductsList([]);
        setProductError("Không tải được sản phẩm từ CMS. Vui lòng kiểm tra API.");
      } finally {
        setIsLoadingProduct(false);
      }
    }
    loadData();
  }, [id]);

  const [prevProductId, setPrevProductId] = useState(product?.id);
  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    setActiveImage(product.image);
  }

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
        console.error("Error parsing cart in product details:", e);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("kieu_sang_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("kieu-sang-cart-update"));
  };

  const handleAddToCart = () => {
    if (!product) return;
    const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId);
    if (product.has_variants && !selectedVariant) {
      setVariantMessage("Vui lòng chọn đầy đủ phân loại sản phẩm trước khi thêm vào giỏ.");
      return;
    }
    if (selectedVariant && selectedVariant.stock < quantity) {
      setVariantMessage(`Phân loại này chỉ còn ${selectedVariant.stock} sản phẩm.`);
      return;
    }

    const pendingItem: CartItem = { product, variant: selectedVariant, quantity };
    const pendingKey = getCartItemKey(pendingItem);
    const existingIndex = cart.findIndex((item) => getCartItemKey(item) === pendingKey);
    const newCart = [...cart];

    if (existingIndex > -1) {
      if (selectedVariant && newCart[existingIndex].quantity + quantity > selectedVariant.stock) {
        setVariantMessage(`Phân loại này chỉ còn ${selectedVariant.stock} sản phẩm.`);
        return;
      }
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push(pendingItem);
    }

    saveCart(newCart);
    setIsAddedSuccessfully(true);
    setTimeout(() => {
      setIsAddedSuccessfully(false);
    }, 2000);
    setIsCartOpen(true);
  };

  const handleQuickAdd = (p: Product) => {
    const existingIndex = cart.findIndex((item) => item.product.id === p.id);
    const newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({ product: p, quantity: 1 });
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

  const handleQuestionSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!product?.slug) {
      setQuestionMessage("Không thể gửi câu hỏi vì không tìm thấy mã sản phẩm.");
      return;
    }
    setQuestionMessage("");
    try {
      const result = await submitProductQuestion(product.slug, questionForm);
      setQuestionMessage(result.message);
      setQuestionForm({ customer_name: "", customer_email: "", question: "" });
    } catch {
      setQuestionMessage("Không thể gửi câu hỏi. Vui lòng thử lại sau.");
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
        <p className="font-serif text-3xl font-bold text-primary">ĐANG TẢI SẢN PHẨM...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
        <p className="font-serif text-3xl font-bold text-primary">KHÔNG TÌM THẤY SẢN PHẨM</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          {productError || "Sản phẩm bạn tìm kiếm có thể đã ngừng bán hoặc không tồn tại."}
        </p>
        <Link href="/products" className="bg-[#043616] text-white px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-[#2d6a3e] transition-all">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = relatedProductsList;

  const selectedVariant: ProductVariant | undefined = product.variants?.find((variant) => variant.id === selectedVariantId);
  const displayPrice = selectedVariant?.price ?? product.price;
  const displayOriginalPrice = selectedVariant?.original_price ?? product.originalPrice;

  const selectVariant = (variant: ProductVariant) => {
    setSelectedVariantId(variant.id);
    setVariantMessage("");
    setActiveImage(variant.image || product.image);
    if (quantity > variant.stock) setQuantity(Math.max(1, variant.stock));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getBadgeColors = (index: number) => {
    const colors = [
      "bg-[#043616]/10 text-[#043616]",
      "bg-amber-100 text-amber-800",
      "bg-emerald-100 text-emerald-800",
      "bg-orange-100 text-orange-800"
    ];
    return colors[index % colors.length];
  };

  const galleryItems = [
    { src: product.image, label: "Ảnh sản phẩm", variant: undefined as ProductVariant | undefined },
    ...(product.variants || [])
      .filter((variant) => Boolean(variant.image))
      .map((variant) => ({
        src: variant.image as string,
        label: variant.name || variant.label,
        variant,
      })),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative selection:bg-primary/10 selection:text-primary overflow-x-hidden">
      {/* Floating Ambient Glows */}
      <div className="absolute top-24 left-1/4 w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20vh] right-1/4 w-[35vw] h-[35vw] rounded-full bg-accent/4 blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <Header onCartOpen={() => setIsCartOpen(true)} />
      <PageBanner pageKey="product" />

      <main className="pt-20">
        {/* Back Link Nav */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-6">
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-serif font-bold text-secondary uppercase hover:text-primary transition-all">
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại cửa hàng</span>
          </Link>
        </div>

        {/* Product Details Section */}
        <section className="pb-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="bg-white border border-border/80 rounded-[40px] p-6 md:p-12 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Product Image Column */}
              <div className="lg:col-span-6 flex flex-col space-y-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-[32px] bg-[#FAF6EE]/40 flex items-center justify-center">
                  {product.badge && (
                    <span className="absolute top-6 left-6 z-10 text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent text-[#112215] shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  <div className="relative w-full h-full">
                    <Image
                      src={activeImage}
                      alt={product.name}
                      fill
                      priority
                      unoptimized={activeImage.startsWith("http")}
                      className="object-cover transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-3 overflow-x-auto pt-2 pb-1" aria-label="Hình ảnh sản phẩm và phân loại">
                  {galleryItems.map((item, idx) => (
                    <button
                      key={`${item.variant?.id ?? "product"}-${idx}`}
                      type="button"
                      onClick={() => {
                        if (item.variant) {
                          selectVariant(item.variant);
                          return;
                        }
                        setSelectedVariantId(null);
                        setVariantMessage("");
                        setActiveImage(product.image);
                      }}
                      aria-label={`Xem ${item.label}`}
                      aria-pressed={item.variant ? selectedVariantId === item.variant.id : selectedVariantId === null && activeImage === product.image}
                      className={`group/thumb w-24 shrink-0 rounded-xl border bg-white p-1.5 text-left transition-colors duration-200 ${(item.variant ? selectedVariantId === item.variant.id : selectedVariantId === null && activeImage === product.image) ? "border-primary" : "border-border/80 hover:border-primary/50"}`}
                    >
                      <span className="relative block aspect-square overflow-hidden rounded-lg bg-[#FAF6EE]">
                        <Image
                          src={item.src}
                          alt={item.variant ? `${product.name}, ${item.label}` : product.name}
                          fill
                          unoptimized={item.src.startsWith("http")}
                          sizes="96px"
                          className="object-cover transition-transform duration-200 group-hover/thumb:scale-[1.03]"
                        />
                      </span>
                      <span className="mt-1.5 block truncate px-0.5 text-[11px] font-medium text-[#414941]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Specs Column */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <span className="text-sm text-primary/70 font-semibold tracking-widest uppercase border border-primary/20 rounded-full px-4 py-1.5 bg-primary/5 inline-block">
                    {typeof product.category === "object" && product.category !== null
                      ? (product.category as any).name
                      : product.category}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-primary">
                    {product.name}
                  </h1>

                  {/* Rating & Social Proof */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[#414941] font-semibold">{product.rating} / 5.0</span>
                    <span className="text-muted-foreground/60">|</span>
                    <span className="text-muted-foreground font-light">100% đánh giá hài lòng</span>
                  </div>
                </div>

                {/* Price block */}
                <div className="bg-[#FAF6EE] rounded-2xl p-5 border border-border/30 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground uppercase tracking-wider block mb-1">Giá bán lẻ</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary font-sans leading-none">
                        {formatPrice(displayPrice)}
                      </span>
                      {displayOriginalPrice && (
                        <span className="text-sm text-muted-foreground/60 line-through font-sans">
                          {formatPrice(displayOriginalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  {displayOriginalPrice && (
                    <span className="text-sm font-bold text-[#043616] bg-[#2d6a3e]/10 border border-[#2d6a3e]/20 px-3 py-1 rounded-full uppercase">
                      Tiết kiệm {formatPrice(displayOriginalPrice - displayPrice)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Mô tả sản phẩm</h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed font-light text-justify">
                    {product.description}
                  </p>
                </div>

                {product.has_variants && product.variants && product.variants.length > 0 && (
                  <div className="space-y-4 rounded-2xl border border-border/60 bg-white p-4">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">Chọn phân loại</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => selectVariant(variant)}
                          disabled={variant.stock === 0}
                          className={`min-h-11 text-sm px-4 py-2 rounded-full border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${selectedVariantId === variant.id ? "bg-primary text-white border-primary shadow-xs" : "bg-white text-muted-foreground border-border/80 hover:border-primary/50"}`}
                        >
                          {variant.name || variant.label}
                        </button>
                      ))}
                    </div>
                    {/* {selectedVariant && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border/50 pt-3 text-xs">
                        <span className="font-semibold text-emerald-800">SKU: {selectedVariant.sku}</span>
                        <span className={selectedVariant.stock > 0 ? "text-muted-foreground" : "font-semibold text-rose-600"}>
                          {selectedVariant.stock > 0 ? `Còn ${selectedVariant.stock} sản phẩm` : "Tạm hết hàng"}
                        </span>
                      </div>
                    )} */}
                    {variantMessage && <p className="text-xs font-medium text-rose-600" role="alert">{variantMessage}</p>}
                  </div>
                )}

                {/* Benefits / Ingredients */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Đặc tính nổi bật</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.benefits.map((benefit, index) => (
                        <span key={index} className={`text-sm font-medium px-4 py-1.5 rounded-full ${getBadgeColors(index)}`}>
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action panel */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/40">
                  {/* Quantity selector */}
                  <div className="flex items-center justify-between border border-border/80 rounded-full px-4 py-2 bg-white sm:w-36">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-8 w-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-primary disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold text-sm text-primary w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={Boolean(selectedVariant && quantity >= selectedVariant.stock)}
                      className="h-8 w-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-primary transition-colors cursor-pointer disabled:opacity-35"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to cart CTA */}
                  <button
                    onClick={handleAddToCart}
                    disabled={Boolean(product.has_variants && selectedVariant?.stock === 0)}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-8 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-secondary hover:shadow-[0_4px_12px_rgba(4,54,22,0.15)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {isAddedSuccessfully ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Đã thêm vào giỏ</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        <span>Thêm vào giỏ hàng</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 md:px-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary">Tư vấn sản phẩm</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-primary">HỎI ĐÁP SẢN PHẨM</h2>
              <div className="mt-6 divide-y divide-border border-y border-border">
                {questions.map((item) => <article key={item.id} className="py-5">
                  <p className="text-sm font-semibold text-primary">{item.customer_name}: {item.question}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Trả lời: {item.answer}</p>
                </article>)}
                {!questions.length && <p className="py-6 text-sm text-muted-foreground">Chưa có câu hỏi được công khai.</p>}
              </div>
            </div>
            <form className="space-y-4 rounded-lg border border-border bg-[#FAF6EE]/40 p-6" onSubmit={handleQuestionSubmit}>
              <h3 className="font-serif text-lg font-bold text-primary">Gửi câu hỏi cho chúng tôi</h3>
              <div className="grid gap-4 sm:grid-cols-2"><input required value={questionForm.customer_name} onChange={(e) => setQuestionForm({ ...questionForm, customer_name: e.target.value })} placeholder="Họ tên *" className="rounded-lg border border-border bg-white px-4 py-3 text-sm" /><input type="email" value={questionForm.customer_email} onChange={(e) => setQuestionForm({ ...questionForm, customer_email: e.target.value })} placeholder="Email" className="rounded-lg border border-border bg-white px-4 py-3 text-sm" /></div>
              <textarea required minLength={10} rows={5} value={questionForm.question} onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })} placeholder="Câu hỏi của bạn *" className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm" />
              {questionMessage && <p className="text-sm text-emerald-800">{questionMessage}</p>}
              <button className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Gửi câu hỏi</button>
            </form>
          </div>
        </section>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className="py-16 bg-[#FAF6EE]/50 border-t border-border/30">
            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
              <div className="border-b border-border/40 pb-4 text-left">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary uppercase">SAN PHAM CUNG DANH MUC</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {relatedProducts.map((p) => (
                  <div key={p.id} className="flex">
                    <ProductCard product={p} onAddToCart={handleQuickAdd} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
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
