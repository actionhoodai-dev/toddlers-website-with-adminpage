import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const category = formData.get("category") as string || "general";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: `toddlers/${category}`, // Organize in folders
                    resource_type: "auto", // Auto-detect image/video
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({
            success: true,
            src: result.secure_url, // This is the full Cloudinary URL
            id: result.public_id,   // Store public_id in case we want to delete it later
        });

    } catch (error: any) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { public_id } = await request.json();

        if (!public_id) {
            return NextResponse.json({ error: "No public_id provided" }, { status: 400 });
        }

        const result = await cloudinary.uploader.destroy(public_id);

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error("Cloudinary delete error:", error);
        return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
    }
}
