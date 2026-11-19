import { describe, expect, it } from "vitest";
import { embedUrl } from "@/lib/video";

describe("video embeds", () => {
  it("turns YouTube and Vimeo links into embed addresses", () => {
    expect(embedUrl("https://www.youtube.com/watch?v=abc123")).toBe("https://www.youtube-nocookie.com/embed/abc123");
    expect(embedUrl("https://youtu.be/abc123")).toBe("https://www.youtube-nocookie.com/embed/abc123");
    expect(embedUrl("https://vimeo.com/123456")).toBe("https://player.vimeo.com/video/123456");
  });
  it("leaves MP4 files and unknown hosts to the native player", () => {
    expect(embedUrl("/videos/what-is-eta.mp4")).toBeNull();
    expect(embedUrl("https://example.com/v.mp4")).toBeNull();
  });
});
