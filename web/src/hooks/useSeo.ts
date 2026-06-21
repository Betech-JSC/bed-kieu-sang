import { useEffect } from "react";

export function useSeo(title?: string, description?: string, keywords?: string) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Xông Nhà Tẩy Uế`;
    }
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      } else {
        const newMeta = document.createElement("meta");
        newMeta.name = "description";
        newMeta.content = description;
        document.head.appendChild(newMeta);
      }
    }
    if (keywords) {
      const meta = document.querySelector('meta[name="keywords"]');
      if (meta) {
        meta.setAttribute("content", keywords);
      } else {
        const newMeta = document.createElement("meta");
        newMeta.name = "keywords";
        newMeta.content = keywords;
        document.head.appendChild(newMeta);
      }
    }
  }, [title, description, keywords]);
}
