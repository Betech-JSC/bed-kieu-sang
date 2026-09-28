"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ShoppingBag, Plus, Minus, Trash2, Award, ArrowRight } from "lucide-react";
import { Product, ProductVariant } from "./product-card";
import { submitOrder } from "@/lib/api";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/i18n-utils";

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export const getCartItemKey = (item: CartItem) => `${item.product.id}:${item.variant?.id ?? "base"}`;
const getItemPrice = (item: CartItem) => item.variant?.price ?? item.product.price;

export interface OrderDetails {
  id: string;
  name: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: "COD" | "BANK";
  items: CartItem[];
  total: number;
  paymentStatus?: "pending" | "paid" | "failed";
  expireAt?: string;
}

function generateRandomId() {
  return "KS-" + Math.floor(10000 + Math.random() * 90000);
}

const STATIC_PRODUCT_SLUGS: Record<string, string> = {
  p1: "bo-thao-moc-xong-nha",
  p2: "nu-tram-huong-tu-nhien",
  p3: "tra-thao-moc-an-than",
  p4: "tinh-dau-que-nguyen-chat",
  p5: "tinh-dau-sa-chanh-nguyen-chat",
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemKey: string, delta: number) => void;
  onRemoveItem: (itemKey: string) => void;
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
  const locale = useLocale();
  const tCart = useTranslations("cart");
  const tCheckout = useTranslations("checkout");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "BANK" as "COD" | "BANK",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = tCheckout("errors.nameRequired");
    if (!formData.phone.trim()) {
      newErrors.phone = tCheckout("errors.phoneRequired");
    } else if (!/^(0|84|\+84)\d{8,10}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = tCheckout("errors.phoneRequired");
    }
    if (!formData.address.trim()) newErrors.address = tCheckout("errors.addressRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const apiItems = cartItems.map(item => {
      const parsedId = typeof item.product.id === "number" ? item.product.id : parseInt(String(item.product.id), 10);
      const productSlug = item.product.slug || STATIC_PRODUCT_SLUGS[String(item.product.id)];

      return {
        product_id: Number.isInteger(parsedId) ? parsedId : undefined,
        product_slug: productSlug,
        variant_id: item.variant?.id,
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

      const orderCode = result.order_code || generateRandomId();

      if (formData.paymentMethod === "BANK" && result.pay_url) {
        onCheckoutComplete({
          id: orderCode,
          ...formData,
          items: cartItems,
          total,
          paymentStatus: "pending",
          expireAt: result.expire_at,
        });

        setFormData({
          name: "",
          phone: "",
          address: "",
          note: "",
          paymentMethod: "BANK",
        });

        return;
      }

      onCheckoutComplete({
        id: orderCode,
        ...formData,
        items: cartItems,
        total,
      });

      setFormData({
        name: "",
        phone: "",
        address: "",
        note: "",
        paymentMethod: "BANK",
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Error submitting order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#112215]/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 ease-in-out">
          <div className="flex h-full flex-col bg-card border-l border-border shadow-2xl p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-lg font-bold text-foreground">{tCart("title")}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-muted-foreground hover:bg-neutral-100 hover:text-foreground transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 bg-[#FAF6EE] rounded-full flex items-center justify-center border border-border">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tCart("empty")}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-secondary transition-all cursor-pointer"
                >
                  {tCart("startShopping")}
                </button>
              </div>
            ) : (
              <>
                {/* List Items */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {tCart("title")} ({cartItems.length})
                  </p>
                  <div className="divide-y divide-border/60">
                    {cartItems.map((item) => {
                      const localizedProductName = getLocalized(item.product, "name", locale);
                      const localizedVariantLabel = getLocalized(item.variant, "label", locale);

                      return (
                        <div key={getCartItemKey(item)} className="flex py-4 gap-4 items-center">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-muted p-1">
                            {(() => {
                              const imageUrl = (item.variant?.image && item.variant.image !== "false")
                                ? item.variant.image
                                : (item.product.image && item.product.image !== "false")
                                ? item.product.image
                                : "/images/logo.png";
                              return (
                                <Image
                                  src={imageUrl}
                                  alt={localizedProductName}
                                  fill
                                  className="object-contain"
                                />
                              );
                            })()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-serif text-sm font-bold text-foreground">
                              {localizedProductName}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {typeof item.product.category === "object" && item.product.category !== null
                                ? getLocalized(item.product.category, "name", locale)
                                : item.product.category}
                            </p>
                            {item.variant && (
                              <p className="text-[11px] font-medium text-emerald-700 mt-0.5">
                                {localizedVariantLabel || item.variant.label} · {item.variant.sku}
                              </p>
                            )}
                            <span className="text-sm font-semibold text-primary mt-1 block">
                              {formatPrice(getItemPrice(item))}
                            </span>
                          </div>
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-[#FAF6EE] rounded-full border border-border px-2 py-1">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(getCartItemKey(item), -1)}
                              className="p-1 hover:bg-white rounded-full transition-all text-primary active:scale-75 cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold font-sans w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(getCartItemKey(item), 1)}
                              disabled={Boolean(item.variant && item.quantity >= item.variant.stock)}
                              className="p-1 hover:bg-white rounded-full transition-all text-primary active:scale-75 disabled:opacity-35 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => onRemoveItem(getCartItemKey(item))}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-full transition-all active:scale-90 cursor-pointer"
                            aria-label={tCart("remove")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subtotal */}
                <div className="bg-[#FAF6EE] rounded-[20px] p-5 border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">{tCart("total")}</span>
                    <span className="text-xl font-bold text-primary font-sans">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {tCheckout("packagingNote")}
                  </p>
                </div>

                {/* Checkout Form */}
                <div className="space-y-4 pt-4 border-t border-border/80">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {tCheckout("title")}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {tCheckout("fullName")} *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-primary ${
                          errors.name ? "border-red-500" : "border-border"
                        }`}
                        placeholder={tCheckout("fullNamePlaceholder")}
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {tCheckout("phone")} *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-primary ${
                          errors.phone ? "border-red-500" : "border-border"
                        }`}
                        placeholder={tCheckout("phonePlaceholder")}
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {tCheckout("address")} *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-primary ${
                          errors.address ? "border-red-500" : "border-border"
                        }`}
                        placeholder={tCheckout("addressPlaceholder")}
                      />
                      {errors.address && (
                        <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                      )}
                    </div>

                    {/* Note */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {tCheckout("notes")}
                      </label>
                      <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary h-20 resize-none"
                        placeholder={tCheckout("notesPlaceholder")}
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-foreground">
                        {tCheckout("paymentMethod")} *
                      </label>
                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-primary bg-primary/4 font-semibold text-primary">
                        <span className="text-xs">{tCheckout("bankTransfer")}</span>
                      </div>
                    </div>

                    {/* Bank Transfer Details block if BANK chosen */}
                    {formData.paymentMethod === "BANK" && (
                      <div className="rounded-[16px] border border-[#E5C44B]/40 bg-[#FFFBEA]/70 p-4 space-y-2 text-xs">
                        <p className="font-semibold text-primary flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-[#E5C44B]" />
                          {tCheckout("bankTransferTitle")}
                        </p>
                        <div className="space-y-1 text-muted-foreground font-sans">
                          <p>{tCheckout("bank")} <strong>{tCheckout("bankName")}</strong></p>
                          <p>{tCheckout("accountNumber")} <strong>{tCheckout("accountNumberValue")}</strong></p>
                          <p>{tCheckout("accountName")} <strong>{tCheckout("accountNameValue")}</strong></p>
                          <p>
                            {tCheckout("transferNote")} <strong>{tCheckout("transferNoteValue")}</strong>
                          </p>
                        </div>
                        <p className="text-[10px] text-primary italic mt-1">
                          {tCheckout("bankQrTip")}
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
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:bg-secondary disabled:bg-neutral-300 disabled:cursor-not-allowed hover:shadow-[0_4px_20px_rgba(31,77,43,0.2)] hover:scale-[1.01] active:scale-[0.99] mt-6 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      ) : (
                        <>
                          <span>{tCheckout("placeOrder")}</span>
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
