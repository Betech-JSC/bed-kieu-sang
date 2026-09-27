"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Header from "@/components/kieu-sang/header";
import Footer from "@/components/kieu-sang/footer";
import { getFaqs } from "@/lib/api";
import { useSeo } from "@/hooks/useSeo";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/i18n-utils";

type Faq = {
  id: number;
  question: string;
  question_en?: string;
  answer: string;
  answer_en?: string;
};

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const locale = useLocale();
  const tFaq = useTranslations("faq");

  useSeo(
    tFaq("title"),
    tFaq("subtitle")
  );

  useEffect(() => {
    getFaqs()
      .then((data) => setFaqs(data as Faq[]))
      .catch(() =>
        setError(
          locale === "en"
            ? "Unable to load FAQ content from CMS."
            : "Không thể tải nội dung FAQ từ CMS."
        )
      );
  }, [locale]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <header className="mb-10 border-b border-border pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
            {locale === "en" ? "Customer Support" : "Hỗ trợ khách hàng"}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-primary md:text-4xl uppercase">
            {tFaq("title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{tFaq("subtitle")}</p>
        </header>

        {error && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </p>
        )}

        <div className="divide-y divide-border border-y border-border">
          {faqs.map((faq) => {
            const question = getLocalized(faq, "question", locale);
            const answer = getLocalized(faq, "answer", locale);

            return (
              <article key={faq.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif font-bold text-primary cursor-pointer"
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                >
                  <span>{question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${
                      openId === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openId === faq.id && (
                  <p className="whitespace-pre-line pb-6 text-sm leading-7 text-muted-foreground">
                    {answer}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {!error && !faqs.length && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {tFaq("noFaqFound")}
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
