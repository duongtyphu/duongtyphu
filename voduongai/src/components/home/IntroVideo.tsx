"use client";

import { useState } from "react";
import { Maximize, MoreVertical, Play, Volume2 } from "lucide-react";

// Placeholder intro video — swap this ID via Admin once video management
// for the homepage ships. For now it's a hardcoded constant.
const INTRO_YOUTUBE_ID = "L4DZsW6OCpg";

export function IntroVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-9 text-white md:py-12">
      <div className="mx-auto max-w-4xl px-5">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
            🎬 Xem ngay
          </span>

          <h2 className="mt-5 text-2xl font-extrabold md:text-4xl">
            Hành trình xây <span className="text-brand-orange">VO DUONG AI</span>
          </h2>
        </div>

        <div className="group relative mx-auto mt-9 aspect-video w-full overflow-hidden rounded-[1.2rem] border border-white/12 bg-black/60 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.75)] backdrop-blur-xl md:mt-11">
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${INTRO_YOUTUBE_ID}?autoplay=1&rel=0`}
              title="Hành trình xây VO DUONG AI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4"
              aria-label="Phát video Hành trình xây VO DUONG AI"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-lg font-semibold text-white/10 md:text-2xl"
              >
                🎬 Video giới thiệu
              </span>

              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-amber-500 shadow-[0_0_50px_10px_rgba(255,122,0,0.4)] transition-transform duration-300 group-hover:scale-110">
                <Play className="h-8 w-8 translate-x-0.5 fill-white" strokeWidth={0} />
              </span>
              <span className="relative text-sm font-medium text-white/70">
                Nhấn để xem video
              </span>

              {/* Decorative fake video-control chrome — matches the design
                  reference, purely visual until the real player takes over. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-3">
                <div className="h-1 w-full rounded-full bg-white/15">
                  <div className="h-full w-0 rounded-full bg-white/40" />
                </div>
                <div className="mt-2 flex items-center justify-between text-white/40">
                  <div className="flex items-center gap-3">
                    <Play className="h-3.5 w-3.5" strokeWidth={2} />
                    <span className="text-[11px]">0:00</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-3.5 w-3.5" strokeWidth={2} />
                    <Maximize className="h-3.5 w-3.5" strokeWidth={2} />
                    <MoreVertical className="h-3.5 w-3.5" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </button>
          )}
        </div>

        <div className="mx-auto mt-6 max-w-2xl text-center">
          <p className="text-sm text-amber-200/80">
            💡 Video giới thiệu về hành trình xây dựng hệ sinh thái tri thức AI
          </p>
          <p className="mt-1.5 text-xs text-white/40">
            ⏱️ 2-3 phút · Xem để hiểu hành trình phía sau VO DUONG AI
          </p>
        </div>
      </div>
    </section>
  );
}
