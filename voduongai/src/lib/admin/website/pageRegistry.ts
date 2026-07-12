/**
 * Website Page Registry — shared data model (WEB-SPR-002).
 *
 * Task 2 ("Shared Page Structure — Không tạo Page Schema riêng cho từng
 * loại"): Homepage, Landing Pages, and Static Pages all share this ONE
 * `WebsitePage` shape, discriminated by `pageType` — not three separate
 * schemas. Persisted via the existing `useCollection()` two-tier mechanism
 * (per-browser localStorage tier, since "website-pages" is not yet in
 * SUPABASE_COLLECTIONS — wiring to a real table is a later sprint's job,
 * same bridge pattern already used for CKOS's Goals/Workflows/etc.).
 *
 * This registry tracks page *metadata* only (title/slug/status/visibility/
 * SEO/publish info) — it does not store or edit page *content* (body,
 * sections, layout). No Visual/Block/Section Editor exists here, per
 * Task 6.
 */

export const PAGE_LIFECYCLE_STATUSES = ["Draft", "Review", "Approved", "Published", "Archived"] as const;
export type PageLifecycleStatus = (typeof PAGE_LIFECYCLE_STATUSES)[number];

export const PAGE_TYPES = ["Homepage", "Landing Page", "Static Page"] as const;
export type PageType = (typeof PAGE_TYPES)[number];

export type RevisionNote = { date: string; note: string };

export type WebsitePage = {
  id: string;
  title: string;
  slug: string;
  pageType: PageType;
  status: PageLifecycleStatus;
  visible: boolean;
  seoTitle: string;
  seoDescription: string;
  publishedDate: string;
  updatedDate: string;
  revisions: RevisionNote[];
};

export function emptyWebsitePage(pageType: PageType): Omit<WebsitePage, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: "",
    slug: "",
    pageType,
    status: "Draft",
    visible: false,
    seoTitle: "",
    seoDescription: "",
    publishedDate: "",
    updatedDate: today,
    revisions: [],
  };
}

export const WEBSITE_PAGES_COLLECTION_KEY = "website-pages";
