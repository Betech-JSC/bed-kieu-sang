---
name: Sophpower Vietnam Redesign
description: Professional and minimalist B2B web catalog for industrial chemical and food/cosmetic raw materials.
colors:
  primary: "#106d38"
  primary-hover: "#0a4f27"
  secondary: "#002962"
  neutral-bg: "#ffffff"
  neutral-text: "#262626"
  border-color: "#ebebeb"
typography:
  display:
    fontFamily: "Roboto, var(--font-sans), sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.8rem)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Roboto, var(--font-sans), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  xl: "12px"
  md: "8px"
  sm: "4px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
---

# Design System: Sophpower Vietnam Redesign

## 1. Overview

**Creative North Star: "The Industrial Lab Journal"**

This visual system is designed to convey professional reliability, technical clarity, and solid industrial confidence for Sophpower Vietnam's B2B partners. The design is clean, flat, and structured, stripping away unnecessary visual fluff to focus entirely on product parameters, applications, and business contact.

**Key Characteristics:**
- **Flat Layouts & Solid Boundaries**: Strong geometric containers using rigid, distinct borders rather than soft, wide shadows.
- **Brand Green Dominance**: Primary accents, CTAs, and active navigation states use the official brand green (`#106d38`) to establish strong identity recognition.
- **High-Density Data**: Tabular layouts and structured specifications optimized for reading and comparing chemical/technical data.

## 2. Colors

The color palette is built around Sophpower's official corporate green to create an authoritative, environment-friendly, and highly professional B2B impression.

### Primary
- **Brand Green** (#106d38): The primary brand identifier. Used for major CTAs, highlights, active category indicators, and main headers.
- **Brand Green Hover** (#0a4f27): A darker shade of the brand green for hover states.

### Secondary
- **Brand Blue** (#002962): Relegated to secondary layouts, supporting tags, or footer sections.

### Neutral
- **Clear White Background** (#ffffff): Used for the canvas to maintain a clean, high-contrast, editorial feel.
- **Ink Dark Text** (#262626): The main body text color, ensuring high legibility and contrast ratio compliance.
- **Soft Border** (#ebebeb): Used for clean structural lines and tables.

### Named Rules
**The Green Rarity Rule.** Brand Green (`#106d38`) is used strictly for focus points and interactive elements. It should cover no more than 10% of any content area to preserve its highlighting purpose.

## 3. Typography

**Display Font:** Roboto (Google Font with Vietnamese subset)
**Body Font:** Roboto (Google Font with Vietnamese subset)

The typography focuses on high legibility of numbers, chemical formulas, and multilingual text.

### Hierarchy
- **Display** (Bold 700, size `clamp(2.2rem, 5vw, 3.8rem)`, line-height 1.2): Hero section headlines.
- **Headline** (Bold 700, size `1.75rem`, line-height 1.3): Major page sections.
- **Title** (SemiBold 600, size `1.25rem`, line-height 1.4): Product card headers, modal titles.
- **Body** (Regular 400, size `1rem`, line-height 1.6): Standard prose and specifications (capped at `70ch` line length).
- **Label** (Medium 500, size `0.875rem`, letter-spacing `0.05em`, uppercase): Specifications table headers, form labels.

## 4. Elevation

The system is flat-by-default to ensure a clean, high-density, technical presentation. We do not use soft, wide, high-radius shadows.

### Shadow Vocabulary
- **Interactive Hover** (`box-shadow: 0 4px 12px rgba(16, 109, 56, 0.08)`): Subtle shadow applied exclusively on card hovers to indicate interactivity.

### Named Rules
**The Flat-By-Default Rule.** All cards, inputs, and layout blocks are flat at rest. Subtle borders are used to separate components instead of drop shadows.

## 5. Components

### Buttons
- **Shape:** Soft-cornered rectangles (`8px` / `rounded-md`).
- **Primary:** Background Brand Green (`#106d38`), white text (`#ffffff`), `10px 20px` padding.
- **Hover / Focus:** Transition to `#0a4f27` background with transition duration of `150ms`.

### Cards / Containers
- **Corner Style:** Medium-large rounded corners (`12px` / `rounded-xl`).
- **Background:** Pure White (`#ffffff`).
- **Border:** `1px` solid border (`#ebebeb`) at rest.

### Inputs / Fields
- **Style:** Background `#ffffff` with a `1px` solid border (`#cccccc`).
- **Focus:** Outline indicator with Brand Green (`#106d38`) ring and border color change.

### Navigation
- **Style:** Flat top header with clear text links. Active tab is indicated by an underline or solid brand green highlight.

## 6. Do's and Don'ts

### Do:
- **Do** use `rounded-xl` (`12px`) for main card boundaries and layout boxes.
- **Do** write tables for all chemical and technical product specifications.
- **Do** test color contrast ratio to ensure body copy is at least 4.5:1 against the white canvas.

### Don't:
- **Don't** use any purple, violet, or lavender colors anywhere in the application.
- **Don't** apply borders thicker than `1px` as side-stripes to accentuate cards.
- **Don't** use text gradients or overlay text on busy image backgrounds.
- **Don't** pair borders with large, soft shadows (blur >= `16px`).
