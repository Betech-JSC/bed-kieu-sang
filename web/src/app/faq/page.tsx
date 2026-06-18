"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Header from "@/components/kieu-sang/header";
import Footer from "@/components/kieu-sang/footer";
import { getFaqs } from "@/lib/api";
import { useSeo } from "@/hooks/useSeo";

type Faq = { id: number; question: string; answer: string };

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [error, setError] = useState("");
  useSeo("Câu hỏi thường gặp", "Giải đáp các câu hỏi về sản phẩm, cách sử dụng, giao hàng và thanh toán.");

  useEffect(() => { getFaqs().then(setFaqs).catch(() => setError("Không thể tải nội dung FAQ từ CMS.")); }, []);

  return <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <header className="mb-10 border-b border-border pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary">Hỗ trợ khách hàng</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-primary md:text-4xl">CÂU HỎI THƯỜNG GẶP</h1>
      </header>
      {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
      <div className="divide-y divide-border border-y border-border">
        {faqs.map((faq) => <article key={faq.id}>
          <button className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif font-bold text-primary" onClick={() => setOpenId(openId === faq.id ? null : faq.id)}>
            <span>{faq.question}</span><ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${openId === faq.id ? "rotate-180" : ""}`} />
          </button>
          {openId === faq.id && <p className="whitespace-pre-line pb-6 text-sm leading-7 text-muted-foreground">{faq.answer}</p>}
        </article>)}
      </div>
      {!error && !faqs.length && <p className="py-12 text-center text-sm text-muted-foreground">Chưa có câu hỏi thường gặp.</p>}
    </main>
    <Footer />
  </div>;
}
