// Türkçe karakter güvenli slug üretimi (CLAUDE.md §10).
// ı → i, ş → s, ğ → g, ç → c, ö → o, ü → u, İ → i.
// Çıktı yalnızca [a-z0-9-]; ASCII bozulması build-time validator ile denetlenir.

const TR_MAP: Record<string, string> = {
  ı: "i",
  İ: "i",
  ş: "s",
  Ş: "s",
  ğ: "g",
  Ğ: "g",
  ç: "c",
  Ç: "c",
  ö: "o",
  Ö: "o",
  ü: "u",
  Ü: "u",
};

export function slugify(input: string): string {
  return input
    .trim()
    .replace(/[ıİşŞğĞçÇöÖüÜ]/g, (ch) => TR_MAP[ch] ?? ch)
    .toLocaleLowerCase("en-US")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // kalan aksanları at
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

// Slug'ın yalnızca güvenli ASCII karakterler içerdiğini doğrular.
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
