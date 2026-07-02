import { Clock, Target, Users } from "lucide-react";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";

export function WorkspaceHeader({ seed }: { seed: KnowledgeSeed }) {
  return (
    <div className="space-y-3">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Knowledge Workspace</span>
      <h1 className="text-2xl font-extrabold text-gray-900">{seed.title}</h1>
      <p className="max-w-2xl text-gray-500">{seed.summary}</p>
      <div className="flex flex-wrap gap-4 pt-1 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-blue-500" />
          {seed.goal.join(", ")}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-orange-500" />
          {seed.estimatedTime}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-violet-500" />
          {seed.persona.join(", ")}
        </span>
      </div>
    </div>
  );
}
