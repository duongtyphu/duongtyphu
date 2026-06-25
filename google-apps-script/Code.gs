/**
 * VDAI Academy — Lead Webhook (Google Apps Script)
 * Nhận dữ liệu từ Quiz "Bản đồ Affiliate AI" trên website và ghi vào Google Sheet.
 *
 * CÁCH DÙNG:
 * 1. Tạo Google Sheet mới, vào Extensions > Apps Script.
 * 2. Xoá code mẫu, dán toàn bộ nội dung file này vào.
 * 3. Deploy > New deployment > chọn loại "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy URL Web App (dạng https://script.google.com/macros/s/XXXX/exec)
 * 5. Dán URL đó vào assets/js/config.js -> form.leadEndpoint
 *    và đổi form.isConnected = true
 */

const SHEET_NAME = 'Leads';
const HEADERS = [
  'Thời gian', 'Loại', 'Họ tên', 'SĐT', 'Email',
  'Lộ trình đề xuất', 'Điểm nghẽn', 'Ưu tiên', 'Roadmap gợi ý', 'Chi tiết quiz (JSON)'
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    const result = data.result || {};
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.type || '',
      data.name || '',
      data.phone || '',
      data.email || '',
      result.track || '',
      result.bottleneck || '',
      Array.isArray(result.priorities) ? result.priorities.join(', ') : (result.priorities || ''),
      result.roadmap || '',
      JSON.stringify(data.quizAnswers || {})
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Test thủ công trong Apps Script editor (chạy hàm này để kiểm tra) */
function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        type: 'quiz_lead',
        name: 'Nguyễn Văn A',
        phone: '0909123456',
        email: 'test@example.com',
        quizAnswers: { q1: 'a', q2: 'b' },
        result: { track: 'VDAI SOLO', bottleneck: 'Thiếu hệ thống', priorities: ['Nội dung', 'Chuyển đổi'], roadmap: 'Lộ trình 8 tuần...' },
        submittedAt: new Date().toISOString()
      })
    }
  };
  doPost(fakeEvent);
}
