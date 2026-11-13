export function ProgressBar({ done, total, label }: { done: number; total: number; label: string }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm text-ink-soft">
        <span>{label}</span>
        <span>{done} of {total}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-paper-deep" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-label={label}>
        <div className="h-2 rounded-full bg-cedar-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
