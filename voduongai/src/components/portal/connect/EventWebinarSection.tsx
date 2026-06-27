import { ConnectModuleGrid } from "@/components/portal/connect/ConnectModuleGrid";
import type { ConnectModule } from "@/data/portal/connect-os";

/**
 * Answers: "Tôi nên tham gia sự kiện nào để học và kết nối trực tiếp?"
 */
export function EventWebinarSection({ modules }: { modules: ConnectModule[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">Event &amp; Webinar</h2>
      <p className="mt-1 text-sm text-white/55">Webinar, workshop, livestream và offline đang chờ bạn.</p>
      <div className="mt-4">
        <ConnectModuleGrid modules={modules} />
      </div>
    </section>
  );
}
