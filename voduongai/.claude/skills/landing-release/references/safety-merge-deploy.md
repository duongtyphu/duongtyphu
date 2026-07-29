# Safety-check → Merge → Deploy → Verify — chi tiết

## 1. Safety-check trước khi merge

- `git status` — cây làm việc phải sạch. Nếu có file lạ/chưa commit
  không phải do chính đợt việc này tạo ra, dừng lại hỏi trước khi động
  vào (có thể là việc dở của người khác).
- Đọc PR qua `mcp__github__pull_request_read` (`method: "get"`) — kiểm
  tra `mergeable_state`. `"clean"` mới được merge; `"dirty"`/`"conflicting"`
  phải giải quyết conflict trước (fetch base branch mới nhất, merge/rebase,
  resolve, push).
- Đọc check runs (`method: "get_check_runs"`) — phân biệt check **thật
  sự chặn merge** với check cosmetic (vd. bot comment của Vercel không
  phải gate mergeability). Nếu không có CI pipeline chạy test/build thật,
  coi kết quả `tsc`/`eslint`/`vitest`/`build` đã chạy local (Bước 5 của
  SKILL.md) là lớp an toàn chính — đừng cho rằng "không có CI đỏ" nghĩa
  là đã an toàn nếu chưa tự chạy các lệnh đó.
- Đọc lại tiêu đề + mô tả PR hiện tại — nếu nó mang nội dung/ý định cũ
  không còn đúng thực tế (vd. PR ban đầu là "preview only, không merge"
  nhưng nhánh giờ đã là bản chính thức cần merge), cập nhật lại qua
  `mcp__github__update_pull_request` (tiêu đề + mô tả đầy đủ, gồm summary
  scope thật + test plan đã chạy) **trước khi merge** — để lại lịch sử
  GitHub chính xác, không gây hiểu nhầm cho người đọc sau này.

**Ngưỡng quyết định:** tất cả các mục trên đạt → được phép tự động merge
(theo xác nhận mặc định của người dùng cho skill này). Bất kỳ mục nào
không đạt → dừng, báo cụ thể, hỏi trước khi tiếp tục.

## 2. Merge

```
mcp__github__merge_pull_request(owner, repo, pullNumber, merge_method: "merge")
```

Dùng `"merge"` (merge commit) trừ khi người dùng yêu cầu squash/rebase
rõ ràng — giữ nguyên lịch sử từng commit trong đợt audit/fix để dễ truy
vết sau này.

## 3. Xác nhận Vercel tự động deploy Production

Với project đã git-link (trường hợp mặc định của `voduongai` trên
Vercel): **push/merge vào `main` tự động trigger 1 deployment
`target: "production"`** — không cần và không nên tự gọi công cụ deploy
kiểu "deploy file" (`mcp__Vercel__deploy_to_vercel`), công cụ đó dành cho
project KHÔNG có git repo liên kết, gọi nhầm có thể tạo deployment lệch
nguồn.

Quy trình xác nhận:

1. `mcp__Vercel__list_deployments` (lọc theo project, `target: "production"`,
   sắp theo thời gian) — tìm deployment mới nhất ứng với merge commit vừa
   tạo.
2. `mcp__Vercel__get_deployment` — poll tới khi `readyState: "READY"`.
   Nếu `readyState: "ERROR"`, đọc `get_deployment_build_logs` để tìm
   nguyên nhân — đừng báo "đã deploy xong" khi trạng thái là lỗi.
3. Xác nhận `aliasError: null` — nếu có lỗi alias, domain có thể không
   trỏ đúng bản build mới dù deployment tự nó thành công.

## 4. Verify nội dung thật trên production (bắt buộc, không được bỏ qua)

Trạng thái `READY` chỉ chứng minh build thành công, **không chứng minh
đúng nội dung mong muốn đã lên production**. Luôn curl trực tiếp:

```bash
curl -s https://<project>.vercel.app/ --max-time 15 | grep -o "<chuỗi text vừa sửa>"
curl -s https://<project>.vercel.app/ --max-time 15 | grep -Eo '<link rel="canonical"[^>]*>'
curl -s https://<project>.vercel.app/sitemap.xml --max-time 15 | grep -c <slug đáng lẽ đã bị loại/thêm>
```

Chọn bằng chứng cụ thể ứng với đúng những gì vừa sửa ở đợt này (text mới
trong Hero, tag `apple-touch-icon`, số dòng chứa 1 slug trong sitemap...)
— không chỉ curl trang chủ và coi "200 OK" là đủ.

**Luôn dùng domain `*.vercel.app`** để verify — đây là domain Vercel-native,
reachable ổn định từ sandbox.

## 5. Giới hạn mạng sandbox — domain riêng có thể không gọi được

Domain tuỳ chỉnh (vd. `voduongai.com`, khác `*.vercel.app`) có thể bị
timeout/connection-reset khi curl từ sandbox — đây là giới hạn
network/proxy của môi trường thực thi (đã gặp lặp lại với nhiều domain
ngoài khác nhau trong quá trình làm việc), **không phải dấu hiệu lỗi
deploy thật**. Cách xử lý đúng:

- Không khẳng định domain riêng hoạt động nếu chưa tự verify được.
- Dùng deployment status (`READY`, `aliasError: null`) + verify qua
  `*.vercel.app` làm bằng chứng deployment lành mạnh.
- Nói rõ với người dùng: domain riêng chưa tự kiểm tra được từ sandbox,
  đề nghị họ tự mở domain đó kiểm tra nhanh.

## 6. Sau khi merge — dọn dẹp nếu cần

Nếu skill này được gọi lại cho 1 đợt fix tiếp theo và PR trước đó đã
merge xong, coi PR đó là việc đã kết thúc — không push tiếp commit mới
lên nhánh đã merge. Tạo nhánh mới từ `main` mới nhất cho đợt việc tiếp
theo.
