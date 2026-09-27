"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { getBanners } from "@/lib/api";
import { useLocale } from "next-intl";
import { getLocalized } from "@/lib/i18n-utils";

type Banner = {
  id: number;
  title?: string;
  title_en?: string;
  subtitle?: string;
  subtitle_en?: string;
  image: string;
  link_url?: string;
};

export default function PageBanner({ pageKey, position = "top" }: { pageKey: string; position?: string }) {
  const [banner, setBanner] = useState<Banner | null>(null);
  const locale = useLocale();

  useEffect(() => {
    getBanners(pageKey, position).then((items) => setBanner(items[0] || null));
  }, [pageKey, position]);

  if (!banner) return null;

  const localizedTitle = getLocalized(banner, "title", locale);
  const localizedSubtitle = getLocalized(banner, "subtitle", locale);

  const content = (
    <div className="relative mx-auto mt-24 aspect-[4/1] min-h-44 max-w-7xl overflow-hidden md:rounded-lg">
      <img
        src={banner.image}
        alt={localizedTitle || "Banner"}
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover object-center"
      />
      {(localizedTitle || localizedSubtitle) && (
        <div className="absolute inset-0 flex items-end bg-black/35 p-6 text-white md:p-10">
          <div>
            {localizedTitle && <h2 className="font-serif text-2xl font-bold">{localizedTitle}</h2>}
            {localizedSubtitle && <p className="mt-2 text-sm">{localizedSubtitle}</p>}
          </div>
        </div>
      )}
    </div>
  );

  return banner.link_url ? <Link href={banner.link_url}>{content}</Link> : content;
}
