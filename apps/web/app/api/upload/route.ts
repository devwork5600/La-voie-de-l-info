// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";

import { getUser } from "@/lib/auth/auth-session";
import cloudinary from "@/lib/cloudinary";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

function cleanUrl(url: string) {
  return url.split("?")[0]; // 🔥 IMPORTANT FIX
}

export async function POST(req: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return NextResponse.json(
      {
        error:
          "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM, MOV.",
      },
      { status: 400 }
    );
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { error: "Image too large. Max 5MB." },
      { status: 400 }
    );
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return NextResponse.json(
      { error: "Video too large. Max 100MB." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const uploadOptions: Record<string, unknown> = {
      folder: "lvdl",
      resource_type: "auto",
    };

    // ✅ Image optimization only
    if (isImage) {
      uploadOptions.transformation = [
        {
          fetch_format: "auto",
          quality: "auto",
        },
      ];
    }

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
      resource_type: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) return reject(error);

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
          });
        }
      );

      stream.end(buffer);
    });

    const type = uploadResult.resource_type === "video" ? "VIDEO" : "IMAGE";

    let thumbnailUrl = uploadResult.secure_url;

    // ✅ Generate stable video thumbnail
    if (type === "VIDEO") {
      thumbnailUrl = cloudinary.url(uploadResult.public_id, {
        resource_type: "video",
        format: "jpg",
        transformation: [{ start_offset: "0" }, { width: 800, crop: "fill" }],
        secure: true,
      });
    }

    // 🔥 CRITICAL FIX: remove Cloudinary query params
    thumbnailUrl = cleanUrl(thumbnailUrl);

    return NextResponse.json({
      url: uploadResult.secure_url,
      thumbnailUrl,
      type,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
