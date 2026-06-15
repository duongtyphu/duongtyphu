/**
 * ════════════════════════════════════════════════════════════
 * VDAI ACADEMY — QUIZ.JS
 * ════════════════════════════════════════════════════════════
 * Logic cho modal "Nhận Bản đồ Affiliate AI miễn phí" — bài
 * đánh giá 6 câu hỏi giúp phân loại khách hàng vào VDAI SOLO
 * hoặc VDAI SCALE.
 *
 * Cấu trúc:
 * - QUIZ_QUESTIONS: định nghĩa câu hỏi & lựa chọn
 * - Logic chấm điểm đơn giản (cộng điểm theo track)
 * - Render từng bước, thanh tiến trình, nút quay lại/tiếp tục
 * - Validate trước khi qua bước tiếp theo
 * - Hiển thị kết quả + form thu thông tin liên hệ
 * - Gửi dữ liệu đến VDAI_CONFIG.form.leadEndpoint (nếu đã cấu hình)
 *
 * Phụ thuộc: assets/js/config.js, trackEvent() từ app.js
 * ════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  const modal = document.getElementById('quizModal');
  if (!modal) return; // Trang không có quiz modal (ví dụ trang static)

  /* ────────────────────────────────────────────────────────
     DỮ LIỆU CÂU HỎI
     Mỗi option có "score": { solo: n, scale: n } — điểm cộng
     vào track tương ứng. Track có điểm cao hơn ở cuối sẽ được
     đề xuất.
  ──────────────────────────────────────────────────────── */
  const QUIZ_QUESTIONS = [
    {
      id: 'level',
      question: 'Bạn đang ở cấp độ nào?',
      options: [
        { label: 'Chưa từng làm Affiliate, đang tìm hiểu', value: 'new', score: { solo: 2, scale: 0 } },
        { label: 'Đã làm nhưng chưa có hệ thống rõ ràng', value: 'doing_no_system', score: { solo: 2, scale: 0 } },
        { label: 'Đã có kết quả ổn định, làm một mình', value: 'stable_solo', score: { solo: 1, scale: 1 } },
        { label: 'Đã có đội nhóm / cộng tác viên', value: 'has_team', score: { solo: 0, scale: 3 } }
      ]
    },
    {
      id: 'product_type',
      question: 'Bạn đang tiếp thị loại sản phẩm nào?',
      options: [
        { label: 'Sản phẩm vật lý (TikTok Shop, Shopee, Lazada...)', value: 'physical', score: { solo: 1, scale: 1 } },
        { label: 'Sản phẩm số (khóa học, ebook, template)', value: 'digital', score: { solo: 1, scale: 1 } },
        { label: 'Phần mềm / SaaS / công cụ AI', value: 'software', score: { solo: 1, scale: 1 } },
        { label: 'Chưa chọn được sản phẩm cụ thể', value: 'undecided', score: { solo: 2, scale: 0 } }
      ]
    },
    {
      id: 'platform',
      question: 'Bạn đang hoạt động chủ yếu trên nền tảng nào?',
      options: [
        { label: 'TikTok', value: 'tiktok', score: { solo: 1, scale: 1 } },
        { label: 'Facebook', value: 'facebook', score: { solo: 1, scale: 1 } },
        { label: 'YouTube', value: 'youtube', score: { solo: 1, scale: 1 } },
        { label: 'Nhiều nền tảng nhưng chưa tập trung', value: 'multi_scattered', score: { solo: 1, scale: 1 } },
        { label: 'Chưa hoạt động trên nền tảng nào', value: 'none', score: { solo: 2, scale: 0 } }
      ]
    },
    {
      id: 'bottleneck',
      question: 'Điểm nghẽn lớn nhất hiện tại của bạn là gì?',
      options: [
        { label: 'Không biết bắt đầu từ đâu / chọn ngách gì', value: 'no_direction', score: { solo: 2, scale: 0 } },
        { label: 'Có nội dung nhưng không ra chuyển đổi', value: 'no_conversion', score: { solo: 2, scale: 1 } },
        { label: 'Làm một mình quá nhiều việc, không kịp', value: 'overloaded_solo', score: { solo: 2, scale: 1 } },
        { label: 'Có người nhưng không có quy trình để giao việc', value: 'no_process_for_team', score: { solo: 0, scale: 3 } },
        { label: 'Đội nhóm không đồng đều, phải hướng dẫn lặp lại', value: 'inconsistent_team', score: { solo: 0, scale: 3 } }
      ]
    },
    {
      id: 'work_mode',
      question: 'Bạn đang làm việc một mình hay có đội nhóm?',
      options: [
        { label: 'Hoàn toàn một mình', value: 'solo_only', score: { solo: 3, scale: 0 } },
        { label: 'Một mình, nhưng đang cân nhắc tuyển người', value: 'solo_planning_team', score: { solo: 2, scale: 1 } },
        { label: 'Đã có vài cộng tác viên', value: 'small_team', score: { solo: 0, scale: 2 } },
        { label: 'Đang quản lý một đội nhóm', value: 'managing_team', score: { solo: 0, scale: 3 } }
      ]
    },
    {
      id: 'goal_90days',
      question: 'Mục tiêu chính của bạn trong 90 ngày tới là gì?',
      options: [
        { label: 'Xây xong hệ thống cá nhân: ngách, nội dung, phễu', value: 'build_personal_system', score: { solo: 3, scale: 0 } },
        { label: 'Tối ưu chuyển đổi cho hệ thống hiện có', value: 'optimize_conversion', score: { solo: 2, scale: 1 } },
        { label: 'Chuẩn hóa quy trình để giao cho người khác', value: 'standardize_for_team', score: { solo: 1, scale: 2 } },
        { label: 'Tuyển và đào tạo đội nhóm bài bản', value: 'recruit_train_team', score: { solo: 0, scale: 3 } }
      ]
    }
  ];

  const TOTAL_STEPS = QUIZ_QUESTIONS.length + 1; // +1 cho bước form thông tin liên hệ

  /* ────────────────────────────────────────────────────────
     TRẠNG THÁI QUIZ
  ──────────────────────────────────────────────────────── */
  const state = {
    currentStep: 0, // 0..QUIZ_QUESTIONS.length-1 = câu hỏi, cuối cùng = form liên hệ + kết quả
    answers: {},    // { questionId: optionValue }
  };

  /* ────────────────────────────────────────────────────────
     DOM REFERENCES
  ──────────────────────────────────────────────────────── */
  const progressBar = modal.querySelector('.quiz-progress-bar');
  const progressLabel = modal.querySelector('.quiz-progress-label');
  const body = modal.querySelector('.quiz-body');
  const footer = modal.querySelector('.quiz-footer');
  const closeBtn = modal.querySelector('.quiz-close');

  let lastFocusedElement = null;

  /* ────────────────────────────────────────────────────────
     MỞ / ĐÓNG MODAL
  ──────────────────────────────────────────────────────── */
  function openQuiz() {
    lastFocusedElement = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    resetQuiz();
    trackEvent('quiz_start');

    // Focus trap: focus vào modal
    requestAnimationFrame(() => {
      const firstFocusable = modal.querySelector('button, input, a[href]');
      firstFocusable?.focus();
    });
  }

  function closeQuiz() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    lastFocusedElement?.focus();
  }

  function resetQuiz() {
    state.currentStep = 0;
    state.answers = {};
    renderStep();
  }

  // Mở quiz từ bất kỳ element có data-open-quiz
  document.querySelectorAll('[data-open-quiz]').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openQuiz();
    });
  });

  closeBtn?.addEventListener('click', closeQuiz);

  // Đóng khi click overlay (ngoài quiz-box)
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeQuiz();
  });

  // Đóng bằng Escape + Focus trap (Tab/Shift+Tab giữ trong modal)
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeQuiz();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = Array.from(modal.querySelectorAll('button, input, a[href], [tabindex]:not([tabindex="-1"])'))
        .filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ────────────────────────────────────────────────────────
     RENDER STEP HIỆN TẠI
  ──────────────────────────────────────────────────────── */
  function renderStep() {
    const step = state.currentStep;
    const progressPercent = ((step) / TOTAL_STEPS) * 100;
    progressBar.style.width = progressPercent + '%';

    if (step < QUIZ_QUESTIONS.length) {
      progressLabel.textContent = 'Câu ' + (step + 1) + ' / ' + QUIZ_QUESTIONS.length;
      renderQuestionStep(step);
    } else {
      progressBar.style.width = '100%';
      progressLabel.textContent = 'Kết quả của bạn';
      renderResultStep();
    }
  }

  function renderQuestionStep(stepIndex) {
    const q = QUIZ_QUESTIONS[stepIndex];
    const selectedValue = state.answers[q.id];

    body.innerHTML = `
      <div class="quiz-step active">
        <h3>${escapeHtml(q.question)}</h3>
        <div class="quiz-options" role="radiogroup" aria-label="${escapeHtml(q.question)}">
          ${q.options.map((opt) => `
            <label class="quiz-option ${selectedValue === opt.value ? 'selected' : ''}">
              <input type="radio" name="${q.id}" value="${opt.value}" ${selectedValue === opt.value ? 'checked' : ''}>
              <span>${escapeHtml(opt.label)}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;

    body.querySelectorAll('.quiz-option input').forEach(input => {
      input.addEventListener('change', function () {
        state.answers[q.id] = this.value;
        body.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        this.closest('.quiz-option').classList.add('selected');
        updateFooter();
      });
    });

    updateFooter();
  }

  /* ────────────────────────────────────────────────────────
     FOOTER: nút Quay lại / Tiếp tục
  ──────────────────────────────────────────────────────── */
  function updateFooter() {
    const step = state.currentStep;
    const isQuestionStep = step < QUIZ_QUESTIONS.length;
    const isFirstStep = step === 0;
    const isLastQuestionStep = step === QUIZ_QUESTIONS.length - 1;

    let canProceed = true;
    if (isQuestionStep) {
      const q = QUIZ_QUESTIONS[step];
      canProceed = !!state.answers[q.id];
    }

    if (isQuestionStep) {
      const nextLabel = isLastQuestionStep ? 'Xem kết quả →' : 'Tiếp tục →';
      footer.innerHTML = `
        <button type="button" class="btn btn-secondary" id="quizBackBtn" ${isFirstStep ? 'disabled' : ''}>
          ← Quay lại
        </button>
        <button type="button" class="btn btn-primary" id="quizNextBtn" ${canProceed ? '' : 'disabled'}>
          ${nextLabel}
        </button>
      `;
      document.getElementById('quizBackBtn')?.addEventListener('click', goBack);
      document.getElementById('quizNextBtn')?.addEventListener('click', goNext);
    } else {
      footer.innerHTML = '';
    }
  }

  function goBack() {
    if (state.currentStep > 0) {
      state.currentStep--;
      renderStep();
    }
  }

  function goNext() {
    const step = state.currentStep;
    if (step < QUIZ_QUESTIONS.length) {
      const q = QUIZ_QUESTIONS[step];
      if (!state.answers[q.id]) return;

      trackEvent('quiz_step', { step: step + 1, question: q.id, answer: state.answers[q.id] });

      state.currentStep++;
      if (state.currentStep === QUIZ_QUESTIONS.length) {
        trackEvent('quiz_complete', { answers: state.answers });
      }
      renderStep();
    }
  }

  /* ────────────────────────────────────────────────────────
     TÍNH KẾT QUẢ
  ──────────────────────────────────────────────────────── */
  function calculateResult() {
    let soloScore = 0;
    let scaleScore = 0;

    QUIZ_QUESTIONS.forEach(q => {
      const answerValue = state.answers[q.id];
      const opt = q.options.find(o => o.value === answerValue);
      if (opt) {
        soloScore += opt.score.solo;
        scaleScore += opt.score.scale;
      }
    });

    const track = scaleScore > soloScore ? 'scale' : 'solo';

    const levelMap = {
      new: 'Mới bắt đầu — chưa có hệ thống',
      doing_no_system: 'Đang làm nhưng chưa có hệ thống',
      stable_solo: 'Đã có kết quả ổn định, vận hành cá nhân',
      has_team: 'Đang quản lý đội nhóm'
    };
    const currentLevel = levelMap[state.answers.level] || 'Chưa xác định';

    const bottleneckMap = {
      no_direction: 'Chưa xác định được ngách và sản phẩm phù hợp',
      no_conversion: 'Nội dung chưa được tối ưu để tạo chuyển đổi',
      overloaded_solo: 'Quá tải vì đang tự làm tất cả công việc',
      no_process_for_team: 'Chưa có quy trình chuẩn để giao việc cho người khác',
      inconsistent_team: 'Đội nhóm chưa đồng đều, phải hướng dẫn lặp lại'
    };
    const bottleneck = bottleneckMap[state.answers.bottleneck] || 'Chưa xác định rõ điểm nghẽn';

    let priorities, roadmap, ctaTrack;
    if (track === 'solo') {
      priorities = [
        'Xác định ngách và sản phẩm Affiliate phù hợp với thế mạnh của bạn',
        'Xây bộ prompt và quy trình AI để sản xuất nội dung đều đặn',
        'Xây phễu khách hàng cơ bản: landing page, quy trình tư vấn, follow-up'
      ];
      roadmap = 'Lộ trình VDAI SOLO 8 tuần — đi từ chọn ngách, nghiên cứu khách hàng, xây thương hiệu cá nhân đến tối ưu chuyển đổi bằng AI.';
      ctaTrack = 'VDAI SOLO';
    } else {
      priorities = [
        'Chuẩn hóa mô hình đang chạy thành tài liệu/quy trình có thể nhân bản',
        'Xây quy trình tuyển và onboarding thành viên mới trong 7 ngày',
        'Thiết lập KPI và dashboard để theo dõi hiệu quả đội nhóm'
      ];
      roadmap = 'Lộ trình VDAI SCALE 6 giai đoạn — từ chuẩn hóa mô hình, tuyển/onboarding, xây học viện nội bộ đến phát triển leader kế thừa.';
      ctaTrack = 'VDAI SCALE';
    }

    return { track, ctaTrack, currentLevel, bottleneck, priorities, roadmap };
  }

  /* ────────────────────────────────────────────────────────
     RENDER BƯỚC KẾT QUẢ + FORM
  ──────────────────────────────────────────────────────── */
  function renderResultStep() {
    const result = calculateResult();
    const trackClass = result.track;
    const trackLabel = result.track === 'solo' ? 'VDAI SOLO' : 'VDAI SCALE';

    body.innerHTML = `
      <div class="quiz-step active">
        <span class="quiz-result-track ${trackClass}">
          ${result.track === 'solo' ? '👤' : '👥'} Lộ trình đề xuất: ${trackLabel}
        </span>

        <div class="quiz-result-block">
          <h4>Cấp độ hiện tại</h4>
          <p>${escapeHtml(result.currentLevel)}</p>
        </div>

        <div class="quiz-result-block">
          <h4>Điểm nghẽn chính</h4>
          <p>${escapeHtml(result.bottleneck)}</p>
        </div>

        <div class="quiz-result-block">
          <h4>Ba ưu tiên cần triển khai</h4>
          <ul>
            ${result.priorities.map(p => `
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>${escapeHtml(p)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="quiz-result-block">
          <h4>Lộ trình được đề xuất</h4>
          <p>${escapeHtml(result.roadmap)}</p>
        </div>

        <div class="quiz-result-block">
          <h4>Nhận bản đồ chi tiết qua Zalo/Email</h4>
          <form id="quizLeadForm" novalidate>
            <div class="form-group">
              <label class="form-label" for="quizName">Họ và tên *</label>
              <input class="form-input" type="text" id="quizName" name="name" required autocomplete="name">
              <div class="form-error-msg" id="quizNameError">Vui lòng nhập họ tên của bạn.</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="quizPhone">Số điện thoại / Zalo *</label>
              <input class="form-input" type="tel" id="quizPhone" name="phone" required autocomplete="tel" inputmode="tel">
              <div class="form-error-msg" id="quizPhoneError">Vui lòng nhập số điện thoại hợp lệ.</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="quizEmail">Email *</label>
              <input class="form-input" type="email" id="quizEmail" name="email" required autocomplete="email">
              <div class="form-error-msg" id="quizEmailError">Vui lòng nhập email hợp lệ.</div>
            </div>
            <div class="form-group">
              <label class="form-checkbox-row">
                <input type="checkbox" id="quizConsent" name="consent" required>
                <span>Tôi đồng ý với <a href="privacy.html" target="_blank">Chính sách bảo mật</a> của VDAI Academy *</span>
              </label>
              <div class="form-error-msg" id="quizConsentError">Vui lòng đồng ý với Chính sách bảo mật để tiếp tục.</div>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="quizSubmitBtn">
              Nhận bản đồ Affiliate AI →
            </button>

            <div class="form-status" id="quizFormStatus" role="status" aria-live="polite"></div>
            ${!VDAI_CONFIG.form.isConnected ? `
              <div class="form-not-connected-note">
                Lưu ý: Form chưa được kết nối với hệ thống nhận dữ liệu (config.js → form.leadEndpoint trống).
              </div>
            ` : ''}
          </form>
        </div>
      </div>
    `;

    footer.innerHTML = `<button type="button" class="btn btn-secondary" id="quizBackBtn">← Quay lại</button><span></span>`;
    document.getElementById('quizBackBtn')?.addEventListener('click', goBack);

    const leadForm = document.getElementById('quizLeadForm');
    leadForm?.addEventListener('submit', function (e) {
      e.preventDefault();
      handleLeadSubmit(leadForm, result);
    });
  }

  /* ────────────────────────────────────────────────────────
     XỬ LÝ GỬI FORM LEAD (quiz result)
  ──────────────────────────────────────────────────────── */
  function handleLeadSubmit(form, result) {
    const nameInput = form.querySelector('#quizName');
    const phoneInput = form.querySelector('#quizPhone');
    const emailInput = form.querySelector('#quizEmail');
    const consentInput = form.querySelector('#quizConsent');
    const statusEl = form.querySelector('#quizFormStatus');
    const submitBtn = form.querySelector('#quizSubmitBtn');

    // Reset trạng thái lỗi
    [nameInput, phoneInput, emailInput].forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.form-error-msg').forEach(el => el.classList.remove('show'));
    statusEl.className = 'form-status';
    statusEl.innerHTML = '';

    let hasError = false;

    // Validate họ tên
    if (!nameInput.value.trim()) {
      showFieldError(nameInput, 'quizNameError');
      hasError = true;
    }

    // Validate số điện thoại Việt Nam (10-11 số, có thể có +84)
    const phoneDigits = phoneInput.value.replace(/[\s.\-()]/g, '');
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    if (!phoneRegex.test(phoneDigits)) {
      showFieldError(phoneInput, 'quizPhoneError');
      hasError = true;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput, 'quizEmailError');
      hasError = true;
    }

    // Validate checkbox đồng ý chính sách
    if (!consentInput.checked) {
      document.getElementById('quizConsentError')?.classList.add('show');
      hasError = true;
    }

    if (hasError) return;

    // Nếu chưa cấu hình endpoint → redirect thẳng sang register
    if (!VDAI_CONFIG.form.isConnected || !VDAI_CONFIG.form.leadEndpoint) {
      statusEl.className = 'form-status success show';
      statusEl.innerHTML = successIcon() + '<span>Đang chuyển đến trang nhận tài liệu...</span>';
      submitBtn.textContent = 'Tiếp tục ✓';
      submitBtn.disabled = true;
      setTimeout(() => {
        const params = new URLSearchParams({
          email: emailInput.value.trim(),
          name:  nameInput.value.trim(),
          track: result.track
        });
        window.location.href = 'register.html?' + params.toString();
      }, 1000);
      return;
    }

    // Trạng thái loading
    submitBtn.disabled = true;
    statusEl.className = 'form-status loading show';
    statusEl.innerHTML = loadingIcon() + '<span>Đang gửi thông tin...</span>';

    const payload = {
      type: 'quiz_lead',
      name: nameInput.value.trim(),
      phone: phoneDigits,
      email: emailInput.value.trim(),
      quizAnswers: state.answers,
      result: {
        track: result.ctaTrack,
        bottleneck: result.bottleneck,
        priorities: result.priorities,
        roadmap: result.roadmap
      },
      submittedAt: new Date().toISOString()
    };

    trackEvent('lead_submit', { track: result.ctaTrack });

    fetch(VDAI_CONFIG.form.leadEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        statusEl.className = 'form-status success show';
        statusEl.innerHTML = successIcon() + '<span>Hoàn tất! Đang chuyển đến trang nhận tài liệu...</span>';
        trackEvent('lead_success', { track: result.ctaTrack });
        submitBtn.textContent = 'Đã gửi ✓';

        // Chuyển sang register.html, truyền email + tên để điền sẵn
        setTimeout(() => {
          const params = new URLSearchParams({
            email: emailInput.value.trim(),
            name:  nameInput.value.trim(),
            track: result.track
          });
          window.location.href = 'register.html?' + params.toString();
        }, 1200);
      })
      .catch((err) => {
        console.error('Lead submit error:', err);
        statusEl.className = 'form-status error show';
        statusEl.innerHTML = errorIcon() + '<span>Có lỗi xảy ra khi gửi. Vui lòng thử lại hoặc liên hệ trực tiếp qua Zalo.</span>';
        submitBtn.disabled = false;
        trackEvent('lead_error', { reason: 'fetch_failed', track: result.ctaTrack });
      });
  }

  function showFieldError(input, errorId) {
    input.classList.add('error');
    document.getElementById(errorId)?.classList.add('show');
  }

  /* ────────────────────────────────────────────────────────
     ICON HELPERS (inline SVG cho trạng thái form)
  ──────────────────────────────────────────────────────── */
  function loadingIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" stroke-dasharray="40" stroke-dashoffset="10" stroke-linecap="round"/></svg>';
  }
  function successIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function errorIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01" stroke-linecap="round"/></svg>';
  }

  /* ────────────────────────────────────────────────────────
     ESCAPE HTML — chống XSS khi render label từ dữ liệu
  ──────────────────────────────────────────────────────── */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

}); // end DOMContentLoaded
