import { describe, expect, it } from "vitest";

import { getMediaThumbnail } from "./media";

describe("getMediaThumbnail", () => {
  it("returns the placeholder when no url is given", () => {
    expect(getMediaThumbnail(undefined)).toBe("/placeholder.png");
    expect(getMediaThumbnail(null)).toBe("/placeholder.png");
    expect(getMediaThumbnail("")).toBe("/placeholder.png");
  });

  it("returns image urls unchanged", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/v1/lvdl/photo.jpg";
    expect(getMediaThumbnail(url)).toBe(url);
  });

  it("rewrites a Cloudinary video url to a thumbnail frame", () => {
    const url = "https://res.cloudinary.com/demo/video/upload/v1/lvdl/clip.mp4";
    const result = getMediaThumbnail(url);

    expect(result).toBe(
      "https://res.cloudinary.com/demo/video/upload/so_0/v1/lvdl/clip.jpg"
    );
  });

  it("strips webm and mov extensions the same way", () => {
    expect(
      getMediaThumbnail("https://res.cloudinary.com/d/video/upload/v1/x.webm")
    ).toBe("https://res.cloudinary.com/d/video/upload/so_0/v1/x.jpg");
    expect(
      getMediaThumbnail("https://res.cloudinary.com/d/video/upload/v1/x.mov")
    ).toBe("https://res.cloudinary.com/d/video/upload/so_0/v1/x.jpg");
  });
});
