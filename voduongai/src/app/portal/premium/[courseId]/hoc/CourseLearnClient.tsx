"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, PlayCircle, Clock } from "lucide-react";
import type { LiveCourseSection, LiveCourseLesson } from "@/lib/portal/live-course-content";

/** Chuyển URL YouTube (watch?v=/youtu.be) sang dạng nhúng được — mọi URL
 * khác (Vimeo, Loom, mp4 trực tiếp...) không đoán được cấu trúc nhúng
 * chung, fallback sang link mở tab mới (cùng cách `/portal/account` đã
 * xử lý `video_url` bất kỳ từ trước). */
function toYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");
    if (host === "youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

function findFirstViewable(sections: LiveCourseSection[], owned: boolean): LiveCourseLesson | null {
  for (const section of sections) {
    for (const lesson of section.lessons) {
      if (owned || lesson.is_free_preview) return lesson;
    }
  }
  return null;
}

/**
 * Trang xem CHỈ ĐỌC (không kéo-thả, không CRUD — đây là trang học viên,
 * khác hẳn `/admin/premium/courses/[courseId]/builder`). Mặc định chọn
 * sẵn bài học xem được đầu tiên (đã mua → bài đầu tiên; chưa mua → bài
 * xem thử đầu tiên nếu có) để trang không trống khi vừa vào.
 */
export function CourseLearnClient({ sections, owned }: { sections: LiveCourseSection[]; owned: boolean }) {
  const firstViewable = findFirstViewable(sections, owned);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(firstViewable?.id ?? null);

  const selectedLesson = sections.flatMap((s) => s.lessons).find((l) => l.id === selectedLessonId) ?? null;
  const canViewSelected = selectedLesson ? owned || selectedLesson.is_free_preview : false;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-4 py-3">
              <h2 className="text-sm font-bold text-gray-900">{section.title}</h2>
            </div>
            <div className="space-y-1 p-3">
              {section.lessons.length === 0 ? (
                <p className="px-2 py-2 text-center text-xs text-gray-400">Chưa có bài học nào.</p>
              ) : (
                section.lessons.map((lesson) => {
                  const viewable = owned || lesson.is_free_preview;
                  const isSelected = selectedLessonId === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isSelected ? "border-brand-blue bg-brand-blue/5" : "border-transparent hover:bg-gray-50"
                      }`}
                    >
                      {viewable ? (
                        <PlayCircle className="h-4 w-4 shrink-0 text-brand-blue" />
                      ) : (
                        <Lock className="h-4 w-4 shrink-0 text-gray-300" />
                      )}
                      <span className={`min-w-0 flex-1 truncate ${viewable ? "text-gray-800" : "text-gray-400"}`}>
                        {lesson.title}
                      </span>
                      {lesson.duration_minutes > 0 && (
                        <span className="flex shrink-0 items-center gap-1 text-[10px] text-gray-400">
                          <Clock className="h-3 w-3" /> {lesson.duration_minutes}p
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {!selectedLesson ? (
          <p className="py-16 text-center text-sm text-gray-400">
            {owned
              ? "Chọn 1 bài học ở cột trái để bắt đầu."
              : "Chưa có bài học xem thử nào cho khoá này — mua khoá học để xem toàn bộ."}
          </p>
        ) : !canViewSelected ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Lock className="h-10 w-10 text-gray-300" />
            <div>
              <h3 className="text-sm font-bold text-gray-900">{selectedLesson.title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                Bài học này chưa được mở khoá — mua khoá học để xem toàn bộ nội dung.
              </p>
            </div>
            <Link
              href="/portal/premium"
              className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              Mua khoá học này →
            </Link>
          </div>
        ) : (
          (() => {
            const videoUrl = selectedLesson.video_url;
            const embedUrl = videoUrl ? toYouTubeEmbedUrl(videoUrl) : null;
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-extrabold text-gray-900">{selectedLesson.title}</h2>
                  {selectedLesson.duration_minutes > 0 && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                      <Clock className="h-3.5 w-3.5" /> {selectedLesson.duration_minutes} phút
                    </span>
                  )}
                </div>

                {videoUrl &&
                  (embedUrl ? (
                    <div className="aspect-video overflow-hidden rounded-xl border border-gray-200">
                      <iframe
                        src={embedUrl}
                        title={selectedLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-blue hover:border-brand-blue"
                    >
                      <PlayCircle className="h-4 w-4" /> Xem video
                    </a>
                  ))}

                {selectedLesson.content && (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{selectedLesson.content}</div>
                )}
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
