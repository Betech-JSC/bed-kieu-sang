# Sophpower Vietnam Website Redesign & Localization

This repository contains the source code for the clone, redesign, and localization of the **Sophchem** website (https://www.sophchem.com/) customized for **Sophpower Vietnam Co., Ltd.** (Pioneer Herb Industrial Co., Ltd.), developed by **Betech JSC**.

The project transforms the original multi-language, complex portal into a highly optimized, minimalist, and clean B2B landing and catalog site tailored to the Vietnamese market.

---

## 🎯 Project Goals

*   **Full Localization (Vietnamese):** All product specifications, news articles, certificates, and company information are fully localized into professional Vietnamese.
*   **Minimalist B2B Redesign:** Flat UI structure, sharp container geometries (`rounded-xl` corners), clean list views, and clutter-free details pages focusing purely on industrial technical details.
*   **Brand Uniformity:** Replaced Navy Blue with Sophpower's official **Brand Green** (`#106d38`) across the navigation menu, call-to-actions, contact cards, and indicators.
*   **Technical Optimization:** Built on Next.js 16 (App Router) & Tailwind CSS v4 to guarantee SEO compliance, responsive performance, and perfect font rendering.

---

## 💻 Tech Stack

*   **Framework:** Next.js 16.1.3 (React 19, App Router)
*   **Styling:** Tailwind CSS v4 (using `@theme` configuration directives)
*   **Typography:** **Roboto** Google Font (with `latin` and `vietnamese` subsets to prevent layout breakages, with standard system fallbacks for multi-language flexibility).
*   **Icons:** Lucide React
*   **Deployment:** Vercel (configured to deploy the `web/` subdirectory)

---

## 🗺️ Sitemap & Implemented Routes

The web application is modular and structured as follows:

1.  **Home Page (`/`):** Simplified slider banner showing raw ingredients without dark overlays, active category lists, and value-added core competencies cards.
2.  **About Us (`/about`):** Company history, mission, and global standard certifications (ISO, HACCP, HALAL, Kosher, FDA).
3.  **Ingredients Listing Pages (`/list_2` - Food & `/list_3` - Cosmetic):** Grid index of key industrial raw materials (Beta-carotene, Carmine, Niacinamide, Panthenol, Ectoin, etc.) with fully clickable card elements.
4.  **Product Details Template (`/list_2/[id]` & `/list_3/[id]`):** Details pages displaying raw ingredient properties, industrial applications, and packaging standards.
5.  **News Center (`/news` & `/news/[id]`):** Simple background banner + B2B Grid view showcasing clean article content, integrated search, category filter tags, and full card clickability.
6.  **Contact (`/page_5`):** Feedback and sample/quote request forms, interactive coordinates, and high-contrast contact details.
7.  **Recruitment (`/recruitment` & `/recruitment/[id]`):** Full careers board detailing available job positions.
8.  **Search (`/search`):** Search result listing for queries.
9.  **Admin Dashboard (`/admin`):** Mock dashboard to manage forms, news posts, jobs, and catalogs.

---

## 📁 Repository Structure

```
├── .agents/                 # AI development workflow configurations
├── web/                     # Next.js 16 project folder (actual web application)
│   ├── public/              # Static images, icons, and assets
│   └── src/
│       ├── app/             # App router pages and layouts
│       └── components/      # UI components (Header, Footer, Dialogs)
├── BRAND_COLORS.md          # Brand Color Palette guidelines
└── PROJECT_OVERVIEW.md      # Detailed Vietnamese project specifications
```

---

## 🚀 Running Locally

1.  Clone this repository.
2.  Navigate to the `web` directory:
    ```bash
    cd web
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying on Vercel

Since the Next.js source code is located in the `web/` subdirectory, you **MUST** configure the **Root Directory** setting on Vercel:

1.  Create a new project on **Vercel** and link it to this Git repository.
2.  In Vercel's project creation screen (or inside **Project Settings > General**):
    *   Set **Root Directory** to `web`.
3.  Click **Save** and trigger a deployment. Vercel will automatically configure the build commands and output folders.

---

## 📄 License

Released under the [MIT License](LICENSE). Developed for Sophpower Vietnam.
