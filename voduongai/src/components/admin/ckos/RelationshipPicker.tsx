"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { moduleByKey } from "@/lib/admin/ckos/metadata";
import { useAllKnowledgeCollections } from "@/lib/admin/ckos/useAllKnowledgeCollections";

type RelatedRef = { moduleKey: string; id: string; title: string };

function parseRelatedId(ref: string): { moduleKey: string; id: string } {
  const [moduleKey, ...rest] = ref.split(":");
  return { moduleKey, id: rest.join(":") };
}

/**
 * Task 6 — Relationship Model. Lets an admin link a knowledge item to any
 * item across all 9 modules (Goal → Tool → Prompt → Workflow → Evaluation →
 * Resource → Case Study → Best Practice → FAQ, in either direction — the
 * chain in the brief is illustrative, not a directional constraint). Stored
 * as `relatedIds: string[]` in the format `${moduleKey}:${id}` on the
 * KnowledgeItem itself — no schema change, no join table.
 */
export function RelationshipPicker({
  relatedIds,
  onChange,
}: {
  relatedIds: string[];
  onChange: (next: string[]) => void;
}) {
  const { byModule, caseStudies, ready } = useAllKnowledgeCollections();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const allItems: RelatedRef[] = useMemo(() => {
    const items: RelatedRef[] = [];
    for (const [moduleKey, collection] of Object.entries(byModule)) {
      for (const it of collection.items) {
        items.push({ moduleKey, id: it.id, title: it.title || "(chưa đặt tiêu đề)" });
      }
    }
    for (const cs of caseStudies) {
      items.push({ moduleKey: "case-studies", id: String(cs.id), title: cs.title });
    }
    return items;
  }, [byModule, caseStudies]);

  const selected = relatedIds
    .map((ref) => {
      const { moduleKey, id } = parseRelatedId(ref);
      const found = allItems.find((it) => it.moduleKey === moduleKey && it.id === id);
      return found ?? { moduleKey, id, title: "(không tìm thấy — có thể đã bị xóa)" };
    });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selectedRefs = new Set(relatedIds);
    return allItems
      .filter((it) => !selectedRefs.has(`${it.moduleKey}:${it.id}`))
      .filter((it) => !q || it.title.toLowerCase().includes(q))
      .slice(0, 30);
  }, [allItems, query, relatedIds]);

  function addRelation(item: RelatedRef) {
    onChange([...relatedIds, `${item.moduleKey}:${item.id}`]);
    setQuery("");
    setOpen(false);
  }

  function removeRelation(ref: string) {
    onChange(relatedIds.filter((r) => r !== ref));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {selected.map((item) => (
          <span
            key={`${item.moduleKey}:${item.id}`}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-1 pl-2.5 pr-1.5 text-xs font-semibold text-white/80"
          >
            <span className="text-white/40">{moduleByKey(item.moduleKey)?.label ?? item.moduleKey}</span>
            {item.title}
            <button
              type="button"
              aria-label="Xóa liên kết"
              onClick={() => removeRelation(`${item.moduleKey}:${item.id}`)}
              className="rounded-full p-0.5 hover:bg-white/10"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="relative mt-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={ready ? "Tìm tri thức liên quan (mọi loại)..." : "Đang tải..."}
          disabled={!ready}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none disabled:opacity-50"
        />
        {open && query.trim() && (
          <div className="absolute left-0 top-full z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-white/10 bg-brand-navy-soft p-1.5 shadow-2xl">
            {results.length === 0 ? (
              <p className="p-3 text-center text-xs text-white/40">Không tìm thấy.</p>
            ) : (
              results.map((item) => (
                <button
                  key={`${item.moduleKey}:${item.id}`}
                  type="button"
                  onClick={() => addRelation(item)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-white hover:bg-white/10"
                >
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/50">
                    {moduleByKey(item.moduleKey)?.label ?? item.moduleKey}
                  </span>
                  <span className="truncate">{item.title}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
