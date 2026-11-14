export default function PhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto select-none w-[280px] xs:w-[305px] sm:w-[315px] md:w-[320px] h-[580px] xs:h-[610px] sm:h-[630px] md:h-[640px] max-w-full max-h-[calc(100dvh-130px)] transition-all ${className}`}
    >
      {/* Phone chassis */}
      <div className="absolute inset-0 rounded-[38px] sm:rounded-[42px] p-2 sm:p-2.5 bg-surface-raised border border-border shadow-md transition-colors">
        {/* Inner Screen */}
        <div className="relative w-full h-full rounded-[30px] sm:rounded-[34px] overflow-hidden bg-canvas border border-border/40">
          {/* Subtle minimal pill / dynamic notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-3.5 sm:h-4 bg-text/15 rounded-full z-30 pointer-events-none transition-colors" />
          <div className="w-full h-full overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}
