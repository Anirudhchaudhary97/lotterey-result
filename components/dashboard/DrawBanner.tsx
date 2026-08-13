export interface DrawBannerData {
  titleEn: string;
  eligibleFrom: string; // ISO date, already formatted for display by the caller
  eligibleTo: string;
  isPublished: boolean;
}

export function DrawBanner({ draw }: { draw: DrawBannerData | null }) {
  if (!draw) return null;

  return (
    <div className="flex items-center justify-between gap-4 bg-seal-blue-soft border border-[#C7D3E1] rounded-lg px-5 py-3.5 mb-7 flex-wrap">
      <div className="flex items-center gap-3">
        <span className="relative flex w-2 h-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-seal-blue opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-seal-blue" />
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-ink">Current draw · {draw.titleEn}</p>
          <p className="font-mono text-xs text-seal-blue opacity-90">
            Eligible {draw.eligibleFrom} – {draw.eligibleTo} ·{" "}
            {draw.isPublished ? "results published" : "results not yet published"}
          </p>
        </div>
      </div>
      <span className="font-mono text-[11.5px] px-3 py-1.5 rounded-full bg-seal-blue-soft text-seal-blue border border-seal-blue/20">
        {draw.isPublished ? "PUBLISHED" : "WAITING FOR RESULT"}
      </span>
    </div>
  );
}
