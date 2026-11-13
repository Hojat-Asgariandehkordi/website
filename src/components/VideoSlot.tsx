import type { Video } from "@/lib/content";

/** Shows a real player only when a video URL exists. Otherwise an honest placeholder. */
export function VideoSlot({ video, title }: { video: Video; title: string }) {
  if (video.url) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-black">
        <video controls preload="metadata" className="h-full w-full" src={video.url} aria-label={`Video: ${title}`} />
      </div>
    );
  }
  return (
    <div data-video-placeholder className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-dashed border-cedar-300 bg-[repeating-linear-gradient(135deg,#EEF3EF_0_12px,#F6F1E7_12px_24px)] text-center">
      <p className="font-serif text-2xl text-cedar-900">Video coming soon</p>
      <p className="mt-1 text-sm text-ink-soft">The written lesson below covers everything in the planned video.</p>
    </div>
  );
}
