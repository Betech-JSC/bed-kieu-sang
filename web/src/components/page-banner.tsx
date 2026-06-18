"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBanners } from "@/lib/api";

type Banner = { id: number; title?: string; subtitle?: string; image: string; link_url?: string };

export default function PageBanner({ pageKey, position = "top" }: { pageKey: string; position?: string }) {
  const [banner, setBanner] = useState<Banner | null>(null);
  useEffect(() => { getBanners(pageKey, position).then((items) => setBanner(items[0] || null)); }, [pageKey, position]);
  if (!banner) return null;
  const content = <div className="relative mx-auto mt-24 aspect-[4/1] min-h-44 max-w-7xl overflow-hidden md:rounded-lg">
    <img src={banner.image} alt={banner.title || "Banner Xông Nhà Tẩy Uế"} className="h-full w-full object-cover" />
    {(banner.title || banner.subtitle) && <div className="absolute inset-0 flex items-end bg-black/35 p-6 text-white md:p-10"><div><h2 className="font-serif text-2xl font-bold">{banner.title}</h2>{banner.subtitle && <p className="mt-2 text-sm">{banner.subtitle}</p>}</div></div>}
  </div>;
  return banner.link_url ? <Link href={banner.link_url}>{content}</Link> : content;
}
