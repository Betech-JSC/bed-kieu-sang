"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ShoppingBag, Plus, Minus, Trash2, Award, ArrowRight } from "lucide-react";
import { Product } from "./product-card";
import { submitOrder } from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderDetails {
  id: string;
  name: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: "COD" | "BANK";
  items: CartItem[];
  total: number;
}

function generateRandomId() {
  return "KS-" + Math.floor(10000 + Math.random() * 90000);
}

const STATIC_PRODUCT_SLUGS: Record<string, string> = {
  p1: "bo-thao-moc-xong-nha",
  p2: "nu-tram-thao-moc",
  p3: "nuoc-xit-thao-moc-thanh-loc",
  p4: "hop-tra-thao-moc-an-yen",
  n1: "tinh-dau-vo-buoi-hong",
  n2: "nhang-khoanh-dan-huong",
  n3: "de-dot-tram-gom-men-ran",
  n4: "hop-tra-sen-tuyet-co-thu",
  n5: "bo-thao-moc-oai-huong-kho",
  s1: "combo-3-bo-xong-nha-cat-tuong",
  s2: "tinh-dau-cam-ngot-nguyen-chat",
  s3: "lu-xong-tram-dong-hun-co",
  s4: "hop-nu-tram-dac-biet-hop-go",
  s5: "tra-hoa-cuc-vang-tien-vua",
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string | number, delta: number) => void;
  onRemoveItem: (productId: string | number) => void;
  onCheckoutComplete: (orderDetails: OrderDetails) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutComplete,
}: CartDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "COD" as "COD" | "BANK",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }

    const phoneRegex = /^(03|05|07|08|09|01[2|6|8|9])\d{8}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Số điện thoại không đúng định dạng Việt Nam";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ giao hàng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    const apiItems = cartItems.map(item => {
      const parsedId = typeof item.product.id === "number" ? item.product.id : parseInt(item.product.id, 10);
      const productSlug = item.product.slug || STATIC_PRODUCT_SLUGS[String(item.product.id)];

      return {
        product_id: Number.isInteger(parsedId) ? parsedId : undefined,
        product_slug: productSlug,
        quantity: item.quantity
      };
    });

    try {
      const result = await submitOrder({
        customer_name: formData.name,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        notes: formData.note,
        payment_method: formData.paymentMethod === "BANK" ? "VietQR" : "COD",
        items: apiItems
      });

      onCheckoutComplete({
        id: result.order_code || generateRandomId(),
        ...formData,
        items: cartItems,
        total,
      });

      setFormData({
        name: "",
        phone: "",
        address: "",
        note: "",
        paymentMethod: "COD",
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Không thể gửi đơn hàng về CMS.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#112215]/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-lg transform bg-card shadow-2xl transition-all duration-300 flex flex-col h-full border-l border-border rounded-l-[32px] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 border-b border-border bg-[#FAF6EE] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/8 text-primary">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-foreground">Giỏ Hàng An Yên</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground hover:bg-neutral-100 hover:text-foreground transition-all active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="relative w-36 h-36 opacity-70">
                  <Image
                    src="/images/logo.png"
                    alt="Empty Cart Logo"
                    fill
                    className="object-contain grayscale contrast-75"
                  />
                </div>
                <p className="font-serif text-lg text-foreground font-semibold mt-4">
                  Chưa có sản phẩm thanh lọc nào
                </p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Hãy bắt đầu chăm sóc không gian sống bằng những bó thảo mộc thơm lành từ Xông Nhà Tẩy Uế.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-secondary transition-all"
                >
                  Khám Phá Sản Phẩm
                </button>
              </div>
            ) : (
              <>
                {/* List Items */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Sản phẩm chọn lựa ({cartItems.length})
                  </p>
                  <div className="divide-y divide-border/60">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex py-4 gap-4 items-center">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-muted p-1">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif text-sm font-bold text-foreground">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {typeof item.product.category === "object" && item.product.category !== null
                              ? (item.product.category as any).name
                              : item.product.category}
                          </p>
                          <span className="text-sm font-semibold text-primary mt-1 block">
                            {formatPrice(item.product.price)}
                          </span>
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-[#FAF6EE] rounded-full border border-border px-2 py-1">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 hover:bg-white rounded-full transition-all text-primary active:scale-75"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold font-sans w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 hover:bg-white rounded-full transition-all text-primary active:scale-75"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        {/* Remove */}
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-full transition-all active:scale-90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtotal */}
                <div className="bg-[#FAF6EE] rounded-[20px] p-5 border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Tổng cộng</span>
                    <span className="text-xl font-bold text-primary font-sans">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    * Giá đã bao gồm chi phí đóng gói cẩn thận bằng giấy kraft thân thiện với môi trường.
                  </p>
                </div>

                {/* Checkout Form */}
                <div className="space-y-4 pt-4 border-t border-border/80">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Thông tin giao hàng nhận thảo mộc
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Họ và Tên người nhận *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-primary ${
                          errors.name ? "border-red-500" : "border-border"
                        }`}
                        placeholder="Nguyễn Văn A"
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Số điện thoại người nhận *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-primary ${
                          errors.phone ? "border-red-500" : "border-border"
                        }`}
                        placeholder="0901234567"
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Địa chỉ nhận hàng *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-primary ${
                          errors.address ? "border-red-500" : "border-border"
                        }`}
                        placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện..."
                      />
                      {errors.address && (
                        <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                      )}
                    </div>

                    {/* Note */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Lời nhắn gửi (Ghi chú giao hàng)
                      </label>
                      <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary h-20 resize-none"
                        placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-foreground">
                        Phương thức thanh toán *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                            formData.paymentMethod === "COD"
                              ? "border-primary bg-primary/4 font-semibold text-primary"
                              : "border-border bg-white text-muted-foreground hover:border-neutral-300"
                          }`}
                        >
                          <span className="text-xs">Nhận hàng thanh toán (COD)</span>
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={formData.paymentMethod === "COD"}
                            onChange={() => setFormData({ ...formData, paymentMethod: "COD" })}
                            className="sr-only"
                          />
                        </label>

                        <label
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                            formData.paymentMethod === "BANK"
                              ? "border-primary bg-primary/4 font-semibold text-primary"
                              : "border-border bg-white text-muted-foreground hover:border-neutral-300"
                          }`}
                        >
                          <span className="text-xs">Chuyển khoản Ngân hàng</span>
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={formData.paymentMethod === "BANK"}
                            onChange={() => setFormData({ ...formData, paymentMethod: "BANK" })}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Bank Transfer Details block if BANK chosen */}
                    {formData.paymentMethod === "BANK" && (
                      <div className="rounded-[16px] border border-[#E5C44B]/40 bg-[#FFFBEA]/70 p-4 space-y-2 text-xs">
                        <p className="font-semibold text-primary flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-[#E5C44B]" />
                          Thông tin Chuyển Khoản:
                        </p>
                        <div className="space-y-1 text-muted-foreground font-sans">
                          <p>Ngân hàng: <strong>MBBank (Ngân hàng Quân Đội)</strong></p>
                          <p>Số tài khoản: <strong>0779440918</strong></p>
                          <p>Tên tài khoản: <strong>DO VAN VU</strong></p>
                          <p>
                            Nội dung CK: <strong>XONGNHATAYUE {formData.phone || "[SĐT của bạn]"}</strong>
                          </p>
                        </div>
                        <p className="text-[10px] text-primary italic mt-1">
                          * Bạn có thể quét mã VietQR nhận khi đặt hàng thành công để tự động điền thông tin.
                        </p>
                      </div>
                    )}

                    {/* Form submission */}
                    {submitError && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:bg-secondary disabled:bg-neutral-300 disabled:cursor-not-allowed hover:shadow-[0_4px_20px_rgba(31,77,43,0.2)] hover:scale-[1.01] active:scale-[0.99] mt-6"
                    >
                      {isSubmitting ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      ) : (
                        <>
                          <span>Xác Nhận Đặt Hàng</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
