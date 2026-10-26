export type SocialLink = {
  label: string;
  url: string;
};

export function parseSocials(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (
        item &&
        typeof item === "object" &&
        "label" in item &&
        "url" in item &&
        typeof item.label === "string" &&
        typeof item.url === "string"
      ) {
        return { label: item.label, url: item.url };
      }
      return null;
    })
    .filter((item): item is SocialLink => item !== null)
    .filter((item) => item.label.trim().toLowerCase() !== "substack");
}
