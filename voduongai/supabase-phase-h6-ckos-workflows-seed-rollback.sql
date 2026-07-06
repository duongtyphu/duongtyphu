-- ============================================================================
-- PHASE H.6 — Static Workflow Seed: Rollback SQL
-- ============================================================================

delete from ckos_workflow_steps where workflow_id in (
  select id from ckos_workflows
  where source_system in ('ai_workflows', 'knowledge_seed_journeys', 'roadmap_seed')
);
delete from ckos_workflows
where source_system in ('ai_workflows', 'knowledge_seed_journeys', 'roadmap_seed');

-- Không đụng workflow từ source_system = 'sop_table' (Phase H.5) hay bất kỳ
-- bảng nguồn nào (AI_WORKFLOWS/knowledgeSeedJourneys/roadmapSeed đều là file
-- code, không phải bảng DB — không có gì để "hoàn nguyên" ở phía nguồn).

-- Xác nhận sau rollback:
--   select count(*) from ckos_workflows where source_system in ('ai_workflows','knowledge_seed_journeys','roadmap_seed');
--   -- kỳ vọng 0
