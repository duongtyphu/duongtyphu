-- Mở rộng riêng, theo yêu cầu Founder "Thêm được các dự án con" — trước
-- đây `eco.subProjects` là mảng TĨNH trong ecosystems.ts, Admin không có
-- cách nào thêm dự án con mới. Chuyển hẳn sang bảng Supabase generic,
-- dùng chung cho MỌI hệ sinh thái hiện có/tương lai (không hardcode).
--
-- Schema generic id/data jsonb/status/order (giống mọi bảng khác) —
-- KHÔNG cần lưu `colorIndex` (mỗi dòng suy ra màu theo VỊ TRÍ hiển thị
-- trong danh sách đã sắp `displayOrder`, qua getSubProjectSurface(index)
-- — cùng cách palette cũ đã cycle theo index).
create table if not exists ecosystem_subprojects (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table ecosystem_subprojects enable row level security;
create policy "public read published" on ecosystem_subprojects
  for select using (status = 'Published');

-- Seed: 5 dự án con thật đang có (3 DigiU + 2 SolarGroup), giữ nguyên id/
-- slug/name/shortDescription/link đăng ký thật từ ecosystems.ts (không
-- bịa nội dung mới).
insert into ecosystem_subprojects (id, data, status, "order") values
  ('sub_digiu_alphamind', jsonb_build_object(
    'ecosystemId', 'eco_digiu',
    'slug', 'alphamind',
    'name', 'Khoá học Alphamind',
    'shortDescription', 'Một sản phẩm học trong hệ sinh thái DigiU — đăng ký qua cùng cổng tài khoản DigiU.',
    'displayOrder', 1,
    'links', jsonb_build_array(jsonb_build_object('id','link_alphamind','label','Đăng ký Khoá học Alphamind','url','https://lk.digiu.ai/auth/registration/6845205668','order',1,'visible',true))
  ), 'Published', 1),
  ('sub_digiu_webwisepay', jsonb_build_object(
    'ecosystemId', 'eco_digiu',
    'slug', 'webwisepay',
    'name', 'Mở thẻ WebWisePay',
    'shortDescription', 'Sản phẩm thẻ trong hệ sinh thái DigiU — đăng ký qua Telegram bot riêng.',
    'displayOrder', 2,
    'links', jsonb_build_array(jsonb_build_object('id','link_webwisepay','label','Mở thẻ WebWisePay (Telegram)','url','https://t.me/WebWisePay_bot?start=ref_49419218-1eac-4683-ab3e-74a7ca266da0','order',1,'visible',true))
  ), 'Published', 2),
  ('sub_digiu_deposits', jsonb_build_object(
    'ecosystemId', 'eco_digiu',
    'slug', 'deposits',
    'name', 'Mở khoản tiền gửi (Deposits)',
    'shortDescription', 'Sản phẩm tiền gửi trong hệ sinh thái DigiU — đăng ký qua cùng cổng tài khoản DigiU.',
    'displayOrder', 3,
    'links', jsonb_build_array(jsonb_build_object('id','link_deposits','label','Mở khoản tiền gửi (Deposits)','url','https://lk.digiu.ai/auth/registration/6845205668','order',1,'visible',true))
  ), 'Published', 3),
  ('sub_solargroup_sovelmash', jsonb_build_object(
    'ecosystemId', 'eco_solargroup',
    'slug', 'sovelmash',
    'name', 'Nhà máy Sovelmash',
    'shortDescription', 'Một dự án con trong hệ sinh thái SolarGroup — đăng ký qua link riêng của dự án.',
    'displayOrder', 1,
    'links', jsonb_build_array(jsonb_build_object('id','link_sovelmash','label','Xem dự án Nhà máy Sovelmash','url','https://reg.solargroup.pro/frp116/solargroup','order',1,'visible',true))
  ), 'Published', 4),
  ('sub_solargroup_aeronova', jsonb_build_object(
    'ecosystemId', 'eco_solargroup',
    'slug', 'aeronova',
    'name', 'Dự án Khí cầu thế hệ mới AERONOVA',
    'shortDescription', 'Một dự án con trong hệ sinh thái SolarGroup — đăng ký qua link riêng của dự án.',
    'displayOrder', 2,
    'links', jsonb_build_array(jsonb_build_object('id','link_aeronova','label','Xem dự án Khí cầu AERONOVA','url','https://reg.solargroup.pro/frp116/airships','order',1,'visible',true))
  ), 'Published', 5)
on conflict (id) do nothing;
