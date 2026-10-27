/** Wordmark modeled on the bar's sign: bold PATCHED over a spaced-out CUSTOM BAR. */
export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span dir="ltr" className={`inline-flex flex-col items-center leading-none ${light ? "text-paper" : "text-ink"} ${className}`}>
      <span className="font-brand text-[1.32rem] font-[900] tracking-[-0.01em]">PATCHED</span>
      <span className="mt-[3px] font-brand text-[0.5rem] font-semibold tracking-[0.62em] pl-[0.62em] opacity-80">CUSTOM BAR</span>
    </span>
  );
}
