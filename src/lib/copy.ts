export type SiteCopy = {
  roleLabel: string;
  heroPaintCaption: string;
  heroReadCaption: string;
  heroWriteCaption: string;
  heroPhotoCaption: string;
  heroLine1: string;
  heroAside: string;
  heroLine2: string;
  heroMark: string;
  heroLine3: string;
  heroStep1: string;
  heroStep2: string;
  heroStep3: string;
  heroStep4: string;
  heroStepJoin: string;
  heroVoice: string;
  heroImageAlt: string;
  featuredEyebrow: string;
  featuredHeading: string;
  featuredEmpty: string;
  mustReadsHeading: string;
  readMore: string;
  categoriesEyebrow: string;
  categoriesHeading: string;
  categoriesIntro: string;
  navHome: string;
  navCategories: string;
  navAbout: string;
  navContact: string;
  navMenu: string;
  navClose: string;
  navBack: string;
  navBackHome: string;
  navBackCategories: string;
  aboutHeading: string;
  aboutHint: string;
  aboutRecap: string;
  aboutEyebrow: string;
  aboutPageHeading: string;
  aboutPageText: string;
  websiteRowLabel: string;
  footerBackToTop: string;
  footerMenu: string;
  footerContact: string;
  footerFriends: string;
  categoryEyebrow: string;
  categoryEmpty: string;
  workCountSingular: string;
  workCountPlural: string;
  workReturn: string;
  workCategoriesMenu: string;
  articleEmpty: string;
  contactEyebrow: string;
  contactHeading: string;
  contactIntro: string;
  contactNameLabel: string;
  contactEmailLabel: string;
  contactMessageLabel: string;
  contactSubmit: string;
  contactSubmitting: string;
  contactSuccess: string;
  notFoundEyebrow: string;
  notFoundHeading: string;
  notFoundBody: string;
  notFoundCta: string;
};

export const defaultCopy: SiteCopy = {
  roleLabel: "Content writer",
  heroPaintCaption: "Paint",
  heroReadCaption: "Read",
  heroWriteCaption: "Write",
  heroPhotoCaption: "Lens",
  heroLine1: "For me,",
  heroAside: "[ My thinking and philosophy ]",
  heroLine2: "Everything begins",
  heroMark: "[ ? ]",
  heroLine3: "With questions",
  heroStep1: "Questions",
  heroStep2: "Observations",
  heroStep3: "Ideas",
  heroStep4: "Decisions",
  heroStepJoin: "become",
  heroVoice: "",
  heroImageAlt: "Animated editorial portrait with a book and a constellation of ideas",
  featuredEyebrow: "Selected folios",
  featuredHeading: "Featured works",
  featuredEmpty: "The desk is cleared. New works will appear here once published.",
  mustReadsHeading: "Must reads",
  readMore: "Read more",
  categoriesEyebrow: "Shelves",
  categoriesHeading: "Categories",
  categoriesIntro:
    "Fifteen doors, and room to add more. Each shelf keeps its own accent — violet with crimson, or teal with gold.",
  navHome: "Home",
  navCategories: "Categories",
  navAbout: "About",
  navContact: "Contact",
  navMenu: "Menu",
  navClose: "Close",
  navBack: "Back",
  navBackHome: "Back to home",
  navBackCategories: "Back to categories",
  aboutHeading: "About me",
  aboutHint: "Hover a word. Click to hold it.",
  aboutRecap: "To Recap",
  aboutEyebrow: "The writer",
  aboutPageHeading: "About me",
  aboutPageText:
    "I write for houses, ateliers, and people who still believe a sentence can change the temperature of a room. My work lives between research and ornament: first the facts, then the filigree.\n\nI have written origin stories for founders, websites that greet like a host, and essays that take a position without raising their voice. If you need a ghost, I can disappear into yours. If you need a byline, I will sign it in ink.",
  websiteRowLabel: "My website — Ink & Voltage",
  footerBackToTop: "[ Back to top ]",
  footerMenu: "Menu",
  footerContact: "Contact",
  footerFriends: "Let's be friends?",
  categoryEyebrow: "A single shelf",
  categoryEmpty: "This shelf is waiting for its first folio.",
  workCountSingular: "work",
  workCountPlural: "works",
  workReturn: "Return to previous section",
  workCategoriesMenu: "Categories menu",
  articleEmpty: "The page is still waiting for ink.",
  contactEyebrow: "The correspondence desk",
  contactHeading: "Write to me",
  contactIntro:
    "Briefs, ghosts, and long arguments are welcome. Name the shelf, the deadline, and the voice you want the room to keep.",
  contactNameLabel: "Name",
  contactEmailLabel: "Email",
  contactMessageLabel: "Message",
  contactSubmit: "Send the letter",
  contactSubmitting: "Sealing…",
  contactSuccess: "The letter is received. I shall write back when the ink has settled.",
  notFoundEyebrow: "Mislaid folio",
  notFoundHeading: "This page has left the house",
  notFoundBody: "The corridor ends here. Return to the archive, or knock at the desk.",
  notFoundCta: "Home",
};

export function mergeCopy(value: unknown): SiteCopy {
  const incoming =
    value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const next = { ...defaultCopy };
  for (const key of Object.keys(defaultCopy) as (keyof SiteCopy)[]) {
    const item = incoming[key];
    if (typeof item === "string") {
      if (
        key === "heroVoice" ||
        key === "heroStepJoin" ||
        key === "heroStep1" ||
        key === "heroStep2" ||
        key === "heroStep3" ||
        key === "heroStep4"
      ) {
        next[key] = item;
        continue;
      }
      if (item.trim()) next[key] = item;
    }
  }
  return next;
}

export const visibleCopyKeys = [
  "navHome",
  "navCategories",
  "navAbout",
  "navContact",
  "navMenu",
  "navClose",
  "navBack",
  "navBackHome",
  "navBackCategories",
  "heroLine1",
  "heroLine2",
  "heroLine3",
  "heroStep1",
  "heroStepJoin",
  "heroStep2",
  "heroStep3",
  "heroStep4",
  "heroVoice",
  "heroImageAlt",
  "mustReadsHeading",
  "readMore",
  "categoriesHeading",
  "aboutHeading",
  "aboutPageHeading",
  "aboutPageText",
  "footerBackToTop",
  "footerMenu",
  "footerContact",
  "footerFriends",
  "workReturn",
  "workCategoriesMenu",
  "contactEyebrow",
  "contactHeading",
  "contactIntro",
  "contactNameLabel",
  "contactEmailLabel",
  "contactMessageLabel",
  "contactSubmit",
  "contactSuccess",
] as const satisfies readonly (keyof SiteCopy)[];

export function unusedCopyKeys() {
  const shown = new Set<string>(visibleCopyKeys);
  return (Object.keys(defaultCopy) as (keyof SiteCopy)[]).filter((key) => !shown.has(key));
}
