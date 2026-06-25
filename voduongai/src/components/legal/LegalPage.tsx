type Section = {
  heading: string;
  body: string[];
};

export function LegalPage({
  title,
  subtitle,
  updatedAt,
  sections,
}: {
  title: string;
  subtitle: string;
  updatedAt: string;
  sections: Section[];
}) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <h1 className="text-3xl font-extrabold text-white">{title}</h1>
      <p className="mt-3 leading-relaxed text-white/70">{subtitle}</p>
      <p className="mt-1 text-xs text-white/40">Cập nhật lần cuối: {updatedAt}</p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <div
            key={s.heading}
            className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-6"
          >
            <h2 className="text-base font-bold text-white">{s.heading}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/70">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
