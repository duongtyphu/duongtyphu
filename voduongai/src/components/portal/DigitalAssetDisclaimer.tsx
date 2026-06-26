export function DigitalAssetDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs leading-relaxed text-white/50">
        Nội dung chỉ nhằm mục đích chia sẻ thông tin và trải nghiệm cá nhân, không phải lời khuyên đầu tư.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange">Lưu ý quan trọng</p>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        Nội dung trong mục ĐẦU TƯ CÙNG TÔI chỉ nhằm mục đích chia sẻ thông tin, góc nhìn và trải nghiệm cá nhân. Đây không
        phải là lời khuyên đầu tư, không cam kết lợi nhuận và không thay thế cho việc tự nghiên cứu của bạn. Mọi
        quyết định tài chính hoặc đầu tư cần được cân nhắc kỹ lưỡng và bạn tự chịu trách nhiệm với quyết định của
        mình.
      </p>
    </div>
  );
}
