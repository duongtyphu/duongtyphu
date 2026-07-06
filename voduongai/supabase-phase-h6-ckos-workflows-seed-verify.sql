-- ============================================================================
-- PHASE H.6 — Static Workflow Seed: Verify SQL (read-only)
-- ============================================================================

-- 1. Đối chiếu số lượng — kỳ vọng đúng 16 workflow (4 ai_workflows + 11
--    knowledge_seed_journeys + 1 roadmap_seed), xác nhận qua dry-run thật.
select source_system, count(*) as cnt
from ckos_workflows
where source_system in ('ai_workflows', 'knowledge_seed_journeys', 'roadmap_seed')
group by source_system
order by source_system;
-- Kỳ vọng: ai_workflows=4, knowledge_seed_journeys=11, roadmap_seed=1.

-- 2. Missing steps — workflow không có bước nào (vi phạm bản chất Workflow).
select w.id, w.title, w.source_system
from ckos_workflows w
left join ckos_workflow_steps st on st.workflow_id = w.id
where w.source_system in ('ai_workflows', 'knowledge_seed_journeys', 'roadmap_seed')
group by w.id, w.title, w.source_system
having count(st.id) = 0;
-- Kỳ vọng: 0 dòng.

-- 3. Duplicate workflow — trùng slug.
select slug, count(*) as cnt
from ckos_workflows
group by slug
having count(*) > 1;
-- Kỳ vọng: 0 dòng (đã xác nhận qua script dry-run: 0 cảnh báo trùng lặp).

-- 4. Đối chiếu số bước đúng như nguồn thật (giá trị kỳ vọng lấy từ dry-run
--    thật của scripts/phase-h6-seed-workflows.ts, KHÔNG suy đoán):
--    lam-video-ngan=7, viet-ebook=6, xay-landing-page=7, affiliate-content=6,
--    viet-email-chuyen-nghiep=8, lam-bao-cao-tuan-bang-ai=8,
--    thiet-ke-powerpoint-nhanh-gon=8, tom-tat-tai-lieu-pdf-dai=6,
--    quan-ly-thoi-gian-lam-viec=7, ghi-chu-va-tong-hop-cuoc-hop=7,
--    nghien-cuu-mot-chu-de-nhanh-chong=8, soan-bo-faq-cho-cong-viec=7,
--    viet-prompt-hieu-qua=5, phan-tich-excel-bang-ai=5,
--    tu-dong-hoa-cong-viec-van-phong-bang-ai=5, lo-trinh-thanh-cong=6.
select w.slug, w.title, count(st.id) as actual_step_count
from ckos_workflows w
join ckos_workflow_steps st on st.workflow_id = w.id
where w.source_system in ('ai_workflows', 'knowledge_seed_journeys', 'roadmap_seed')
group by w.slug, w.title
order by w.slug;

-- 5. Missing metadata.
select id, title, slug
from ckos_workflows
where (description is null or description = '')
  and source_system in ('ai_workflows', 'knowledge_seed_journeys', 'roadmap_seed');
