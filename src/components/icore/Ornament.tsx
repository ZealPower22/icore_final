export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--gold)]" />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[var(--gold)]">
        <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" fill="currentColor" />
      </svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--gold)]" />
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 text-[var(--gold)] uppercase tracking-[0.4em] text-xs font-medium">
      <span className="h-px w-8 bg-[var(--gold)]/50" />
      <span>{children}</span>
      <span className="h-px w-8 bg-[var(--gold)]/50" />
    </div>
  );
}