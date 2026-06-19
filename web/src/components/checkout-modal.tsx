"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Copy, Check, X, CreditCard, ShieldCheck, ShoppingBag } from "lucide-react";
import { OrderDetails } from "./cart-drawer";

interface CheckoutModalProps {
  order: OrderDetails | null;
  onClose: () => void;
}

export default function CheckoutModal({ order, onClose }: CheckoutModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Dynamic VietQR code URL
  const qrUrl = `https://img.vietqr.io/image/mbbank-0779440918-compact.jpg?amount=${order.total}&addInfo=${encodeURIComponent(order.id)}&accountName=DO%20VAN%20VU`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#112215]/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-[32px] border border-border bg-card p-6 md:p-8 shadow-2xl transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rounded-full p-2 text-muted-foreground hover:bg-neutral-100 hover:text-foreground transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Icon */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-primary">
            Đặt Thảo Mộc Thành Công!
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Cảm ơn bạn đã lựa chọn <strong>Xông Nhà Tẩy Uế</strong> để thanh lọc không gian sống và nuôi dưỡng tâm hồn.
          </p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF6EE] rounded-[24px] p-6 border border-border">
          {/* Order Summary & Customer Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <span className="text-xs font-semibold text-primary uppercase">Mã đơn hàng</span>
              <span className="text-sm font-bold text-foreground font-mono bg-white px-2.5 py-1 rounded-md border border-border">
                {order.id}
              </span>
            </div>

            {/* Customer Details */}
            <div className="space-y-2 text-xs">
              <p className="text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
                Thông tin người nhận
              </p>
              <p className="text-foreground">
                Khách hàng: <strong className="font-semibold">{order.name}</strong>
              </p>
              <p className="text-foreground">
                Số điện thoại: <strong className="font-semibold">{order.phone}</strong>
              </p>
              <p className="text-foreground">
                Địa chỉ nhận: <strong className="font-semibold">{order.address}</strong>
              </p>
              {order.note && (
                <p className="text-muted-foreground italic">Ghi chú: &quot;{order.note}&quot;</p>
              )}
            </div>

            {/* Selected Items */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Sản phẩm đặt hàng
              </p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div key={`${item.product.id}:${item.variant?.id ?? "base"}`} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground max-w-[150px] truncate">
                      {item.product.name}{item.variant ? ` · ${item.variant.label}` : ""} <strong className="text-foreground">x{item.quantity}</strong>
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatPrice((item.variant?.price ?? item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total invoice price */}
            <div className="flex justify-between items-center pt-3 border-t border-border/60">
              <span className="text-sm font-semibold text-foreground">Tổng thanh toán</span>
              <span className="text-lg font-bold text-primary font-sans">
                {formatPrice(order.total)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 rounded-lg p-2 border border-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              <span>Đơn hàng đang được chuẩn bị để giao đi trong 24 giờ tới.</span>
            </div>
          </div>

          {/* Bank Transfer QR Code block if BANK selected */}
          {order.paymentMethod === "BANK" ? (
            <div className="flex flex-col items-center justify-center space-y-4 bg-white rounded-2xl p-4 border border-border">
              <p className="text-xs font-semibold text-primary uppercase text-center flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-accent" />
                Mã QR Thanh Toán An Toàn
              </p>

              {/* QR Image */}
              <div className="relative h-40 w-40 overflow-hidden border border-border rounded-xl shadow-xs bg-white flex items-center justify-center">
                <img
                  src={qrUrl}
                  alt="Bank Transfer QR Code"
                  className="object-contain p-2 w-full h-full"
                />
              </div>

              {/* Instructions */}
              <div className="text-[10px] text-center text-muted-foreground leading-normal max-w-[200px]">
                <p>Quét mã VietQR trên ứng dụng ngân hàng để chuyển khoản.</p>
                <div className="mt-2 space-y-0.5 bg-[#FAF6EE] p-1.5 rounded-lg border border-border font-mono text-[9px] text-left">
                  <p>TK: <strong>0779440918</strong></p>
                  <p>Bank: <strong>MBBank</strong></p>
                  <p>Chủ TK: <strong>DO VAN VU</strong></p>
                  <p className="flex items-center justify-between mt-1">
                    <span>Nội dung: <strong>{order.id}</strong></span>
                    <button
                      onClick={() => handleCopyText(order.id)}
                      className="p-1 hover:bg-neutral-200 rounded-sm text-primary transition-all ml-1"
                    >
                      {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-border space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/4 flex items-center justify-center text-primary">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="text-sm font-semibold text-primary">Thanh Toán Nhận Hàng (COD)</p>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                Bạn sẽ chuẩn bị tiền mặt <strong>{formatPrice(order.total)}</strong> để thanh toán cho nhân viên giao hàng khi nhận thảo mộc.
              </p>
            </div>
          )}
        </div>

        {/* Complete button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-secondary transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            Hoàn tất đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
