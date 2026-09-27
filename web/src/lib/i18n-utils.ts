/**
 * Safely resolves localized fields with automatic fallback to Vietnamese
 *
 * @param item - The data object containing localized fields (e.g. Product, BlogPost)
 * @param field - Base field name without suffix (e.g. 'name', 'description', 'title')
 * @param locale - Current active locale ('vi' | 'en')
 * @returns Localized value if locale is 'en' and field_en exists and is non-empty, otherwise base field value
 */
export function getLocalized<T extends Record<string, any>>(
  item: T | null | undefined,
  field: string,
  locale: string
): any {
  if (!item) return "";
  if (locale === "en") {
    const enVal = item[`${field}_en`];
    if (enVal !== null && enVal !== undefined && enVal !== "") {
      return enVal;
    }
  }
  return item[field] ?? "";
}
