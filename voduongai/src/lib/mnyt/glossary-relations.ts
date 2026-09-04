import type { MnytGlossaryTerm } from "@/lib/portal/live-mnyt";

/**
 * Dữ liệu "Cấp độ" + "Thuật ngữ liên quan" của 100 thuật ngữ Từ điển —
 * nội dung THẬT do đội thiết kế biên soạn thủ công trong mockup gốc
 * (`GLOSSARY_ADVANCED`/`GLOSSARY_REL`, có ghi chú "quan hệ khái niệm thật,
 * được kiểm định thủ công" — KHÔNG phải placeholder), nhưng schema
 * `mnyt_glossary` (Giai đoạn 1) không có cột lưu 2 field này.
 *
 * Thay vì bịa lại (bỏ tính năng) hoặc mở migration mới (2 field tĩnh, hiếm
 * khi đổi, không cần CRUD riêng) — port NGUYÊN VĂN thành hằng số, khoá
 * bằng `term_en` (đã xác nhận qua Supabase MCP: khớp CHÍNH XÁC 100/100 giá
 * trị `term_en` thật trong DB, cùng nguồn nội dung từ Giai đoạn 1). An
 * toàn tuyệt đối nếu 1 khoá không khớp (lọc `undefined`, không throw).
 */

/** 52 thuật ngữ "Nâng cao" — còn lại mặc định "Cơ bản". */
const GLOSSARY_ADVANCED_EN = new Set([
  "Embedding",
  "Context window",
  "Temperature",
  "Top-p / Top-k sampling",
  "Prompt chaining",
  "In-context learning",
  "Structured output",
  "Prompt injection",
  "Vector database",
  "Chunking",
  "Reranking",
  "Metadata filtering",
  "Similarity score",
  "Data pipeline",
  "Pretraining",
  "Transformer",
  "Weights",
  "Overfitting",
  "LoRA",
  "Quantization",
  "Distillation",
  "Transfer learning",
  "Epoch",
  "Benchmark",
  "Parameters",
  "Foundation model",
  "Inference",
  "Function calling / Tool calling",
  "Orchestration",
  "Multi-agent system",
  "Autonomous agent",
  "MCP (Model Context Protocol)",
  "Task decomposition",
  "Agent memory",
  "Webhook / API integration",
  "Alignment",
  "Guardrail",
  "Jailbreak",
  "Red teaming",
  "Explainability",
  "Diffusion model",
  "GAN",
  "Inpainting",
  "Outpainting",
  "Latency",
  "GPU / TPU",
  "Rate limit",
  "Edge AI",
  "Inference cost",
  "Batch processing",
  "Model serving",
  "Uptime / SLA",
  "Intelligent process automation (IPA)",
  "AI ROI",
]);

const GLOSSARY_STOP = new Set([
  "của", "các", "một", "và", "là", "có", "cho", "để", "khi", "này", "thì", "với", "trong", "những", "được", "như",
  "thay", "vì", "hoặc", "ra", "vào", "từ", "trên", "mà", "nó", "bạn", "ai", "the", "and", "for", "that", "with",
  "this", "are", "you", "its", "not", "can", "from", "into", "than", "they", "their", "when", "while", "just",
  "also", "more", "most", "only", "have", "has", "how", "who", "what", "a", "an", "to", "of", "in", "on", "it",
  "is", "be", "or", "at", "by", "as", "so", "do", "does",
]);

/** Quan hệ khái niệm đã kiểm định thủ công — khoá theo `termEn`. */
const GLOSSARY_REL: Record<string, string[]> = {
  Prompt: ["System prompt", "Chain-of-thought", "Token", "Context window"],
  "System prompt": ["Prompt", "Persona prompting", "Guardrail"],
  "Chain-of-thought": ["Reasoning", "Task decomposition", "Prompt chaining"],
  "Few-shot / Zero-shot": ["In-context learning", "Prompt", "Fine-tuning"],
  "In-context learning": ["Few-shot / Zero-shot", "Context window", "Fine-tuning"],
  "Prompt chaining": ["Task decomposition", "Orchestration", "Chain-of-thought"],
  "Persona prompting": ["System prompt", "Prompt", "Chatbot"],
  "Negative prompt": ["Text-to-image", "Diffusion model", "Prompt"],
  "Structured output": ["Function calling / Tool calling", "API", "Prompt"],
  "Prompt injection": ["Jailbreak", "Guardrail", "Red teaming"],
  Token: ["Context window", "Inference cost", "Rate limit"],
  "Context window": ["Token", "Chunking", "Agent memory"],
  Temperature: ["Top-p / Top-k sampling", "Inference", "Hallucination"],
  "Top-p / Top-k sampling": ["Temperature", "Inference"],
  Model: ["Large Language Model (LLM)", "Foundation model", "Parameters"],
  "Large Language Model (LLM)": ["Transformer", "Token", "Foundation model"],
  "Foundation model": ["Pretraining", "Fine-tuning", "Open-source model"],
  "Open-source model": ["Foundation model", "On-device AI", "Quantization"],
  Inference: ["Latency", "Inference cost", "Model serving"],
  API: ["API key", "Rate limit", "Webhook / API integration"],
  Parameters: ["Weights", "Quantization", "Large Language Model (LLM)"],
  Reasoning: ["Chain-of-thought", "Task decomposition", "Benchmark"],
  Multimodal: ["Text-to-image", "Speech-to-text", "Foundation model"],
  Embedding: ["Vector database", "Semantic search", "Similarity score"],
  "Vector database": ["Embedding", "Semantic search", "Chunking"],
  "Semantic search": ["Embedding", "Reranking", "Vector database"],
  Chunking: ["RAG", "Embedding", "Context window"],
  Reranking: ["Semantic search", "Similarity score", "RAG"],
  "Metadata filtering": ["Vector database", "Semantic search", "Knowledge base"],
  "Similarity score": ["Embedding", "Reranking", "Semantic search"],
  "Knowledge base": ["RAG", "Metadata filtering", "Data pipeline"],
  "Data pipeline": ["Chunking", "Knowledge base", "Batch processing"],
  "Citation / source grounding": ["RAG", "Hallucination", "Explainability"],
  RAG: ["Embedding", "Vector database", "Chunking", "Citation / source grounding"],
  Hallucination: ["RAG", "Citation / source grounding", "Temperature"],
  "Fine-tuning": ["LoRA", "Transfer learning", "Overfitting"],
  Pretraining: ["Foundation model", "Weights", "Epoch"],
  Transformer: ["Large Language Model (LLM)", "Weights", "Pretraining"],
  Weights: ["Parameters", "Quantization", "Pretraining"],
  Overfitting: ["Fine-tuning", "Epoch", "Benchmark"],
  LoRA: ["Fine-tuning", "Transfer learning", "Quantization"],
  Quantization: ["On-device AI", "Weights", "Inference cost"],
  Distillation: ["Quantization", "Latency", "Fine-tuning"],
  "Transfer learning": ["Fine-tuning", "LoRA", "Foundation model"],
  Epoch: ["Overfitting", "Pretraining", "Fine-tuning"],
  Benchmark: ["Reasoning", "Model", "Overfitting"],
  "Function calling / Tool calling": ["Agent", "Structured output", "MCP (Model Context Protocol)"],
  Orchestration: ["Multi-agent system", "Prompt chaining", "Automation workflow"],
  "Multi-agent system": ["Orchestration", "Agent", "Task decomposition"],
  "Autonomous agent": ["Agent", "Human-in-the-loop", "Guardrail"],
  "MCP (Model Context Protocol)": ["Function calling / Tool calling", "Agent", "API"],
  Trigger: ["Automation workflow", "Webhook / API integration", "Orchestration"],
  "Human-in-the-loop": ["Autonomous agent", "Guardrail", "Responsible AI"],
  "Task decomposition": ["Chain-of-thought", "Multi-agent system", "Prompt chaining"],
  "Agent memory": ["Context window", "Agent", "Vector database"],
  "Webhook / API integration": ["Trigger", "API", "Automation workflow"],
  Agent: ["Autonomous agent", "Function calling / Tool calling", "Agent memory", "Orchestration"],
  "Automation workflow": ["Trigger", "Orchestration", "Intelligent process automation (IPA)"],
  Bias: ["Alignment", "Responsible AI", "Red teaming"],
  Alignment: ["Guardrail", "Responsible AI", "Bias"],
  Guardrail: ["Prompt injection", "Human-in-the-loop", "Alignment"],
  Jailbreak: ["Prompt injection", "Red teaming", "Guardrail"],
  Deepfake: ["Voice cloning", "AI content copyright", "Responsible AI"],
  "Data privacy": ["On-device AI", "Responsible AI", "API key"],
  "AI content copyright": ["Deepfake", "AI-generated content", "Responsible AI"],
  "Red teaming": ["Jailbreak", "Prompt injection", "Guardrail"],
  "Responsible AI": ["Alignment", "Explainability", "Human-in-the-loop"],
  Explainability: ["Citation / source grounding", "Responsible AI", "Bias"],
  "Text-to-image": ["Diffusion model", "Negative prompt", "Inpainting"],
  "Diffusion model": ["Text-to-image", "GAN", "Upscaling"],
  GAN: ["Diffusion model", "Deepfake", "Style transfer"],
  "Text-to-speech (TTS)": ["Voice cloning", "Speech-to-text", "Multimodal"],
  "Voice cloning": ["Text-to-speech (TTS)", "Deepfake", "AI content copyright"],
  Upscaling: ["Inpainting", "Diffusion model", "Style transfer"],
  Inpainting: ["Outpainting", "Text-to-image", "Upscaling"],
  Outpainting: ["Inpainting", "Text-to-image", "Diffusion model"],
  "Style transfer": ["Text-to-image", "AI content copyright", "GAN"],
  "Text-to-video": ["Diffusion model", "Text-to-image", "Multimodal"],
  "Speech-to-text": ["Text-to-speech (TTS)", "Multimodal", "Latency"],
  "Code generation": ["Copilot", "Structured output", "Function calling / Tool calling"],
  Latency: ["Inference", "Model serving", "Edge AI"],
  "GPU / TPU": ["Inference cost", "Model serving", "Pretraining"],
  "Rate limit": ["API", "API key", "Batch processing"],
  "On-device AI": ["Edge AI", "Quantization", "Data privacy"],
  "Edge AI": ["On-device AI", "Latency", "Quantization"],
  "Inference cost": ["Token", "GPU / TPU", "Batch processing"],
  "Batch processing": ["Inference cost", "Rate limit", "Data pipeline"],
  "API key": ["API", "Data privacy", "Rate limit"],
  "Model serving": ["Inference", "Uptime / SLA", "Latency"],
  "Uptime / SLA": ["Model serving", "Latency", "AI adoption"],
  Copilot: ["Code generation", "Chatbot", "AI personalization"],
  Chatbot: ["Copilot", "Persona prompting", "AI-driven CX"],
  "No-code AI": ["Automation workflow", "Trigger", "AI adoption"],
  "AI-generated content": ["AI content copyright", "Text-to-image", "Code generation"],
  "AI personalization": ["AI-driven CX", "Embedding", "AI ROI"],
  "Intelligent process automation (IPA)": ["Automation workflow", "Orchestration", "AI ROI"],
  "AI-driven CX": ["Chatbot", "AI personalization", "AI ROI"],
  "AI ROI": ["AI adoption", "Inference cost", "Intelligent process automation (IPA)"],
  "AI adoption": ["AI ROI", "No-code AI", "Responsible AI"],
  "Model marketplace": ["Open-source model", "Model", "Model serving"],
};

export function isGlossaryTermAdvanced(termEn: string): boolean {
  return GLOSSARY_ADVANCED_EN.has(termEn);
}

/**
 * Tính "thuật ngữ liên quan" cho MỖI dòng — ưu tiên `GLOSSARY_REL` (quan hệ
 * đã kiểm định), rơi về thuật toán trùng từ khoá trong định nghĩa (cùng
 * danh mục + ≥2 từ chung, tối đa 3 gợi ý) khi thuật ngữ chưa có trong bảng
 * quan hệ thủ công — 1:1 với `glossaryRelated()` của mockup gốc, chỉ khác
 * input là dữ liệu THẬT từ DB thay vì mảng in-memory.
 */
export function computeGlossaryRelatedIds(terms: readonly MnytGlossaryTerm[]): Map<number, number[]> {
  const idxByEn = new Map<string, number>();
  terms.forEach((t, i) => idxByEn.set(t.termEn, i));

  const words = terms.map((t) => {
    const text = `${t.definition} ${t.definitionEn}`
      .toLowerCase()
      .replace(/[^\p{L}\s]/gu, " ");
    return new Set(text.split(/\s+/).filter((w) => w.length > 3 && !GLOSSARY_STOP.has(w)));
  });

  const out = new Map<number, number[]>();
  terms.forEach((t, i) => {
    const curated = (GLOSSARY_REL[t.termEn] ?? [])
      .map((en) => idxByEn.get(en))
      .filter((j): j is number => j !== undefined && j !== i);
    if (curated.length) {
      out.set(
        t.id,
        curated.slice(0, 4).map((j) => terms[j].id),
      );
      return;
    }
    const scored: { j: number; score: number }[] = [];
    for (let j = 0; j < terms.length; j++) {
      if (j === i) continue;
      if (terms[j].category !== t.category) continue;
      let overlap = 0;
      words[i].forEach((w) => {
        if (words[j].has(w)) overlap++;
      });
      if (overlap < 2) continue;
      scored.push({ j, score: overlap });
    }
    scored.sort((a, b) => b.score - a.score);
    out.set(
      t.id,
      scored.slice(0, 3).map((s) => terms[s.j].id),
    );
  });
  return out;
}
