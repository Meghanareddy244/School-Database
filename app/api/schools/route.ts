import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { schoolCreateSchema } from "@/lib/validators";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        contact: true,
        image: true,
        emailId: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ data: schools });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = String(formData.get("name") ?? "");
    const address = String(formData.get("address") ?? "");
    const city = String(formData.get("city") ?? "");
    const state = String(formData.get("state") ?? "");
    const contact = String(formData.get("contact") ?? "");
    const emailId = String(formData.get("emailId") ?? "");
    const image = formData.get("image") as File | null;

    const parsed = schoolCreateSchema.safeParse({
      name,
      address,
      city,
      state,
      contact,
      emailId,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (image && image.size > 0) {
      if (!image.type.startsWith("image/")) {
        return NextResponse.json({ error: "Invalid image" }, { status: 400 });
      }

      const bytes = Buffer.from(await image.arrayBuffer());

      imageUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "schools" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result?.secure_url || "");
          }
        );
        uploadStream.end(bytes);
      });
    }

    const created = await prisma.school.create({
      data: { name, address, city, state, contact, emailId, image: imageUrl },
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    console.error("Create school error:", err);
    return NextResponse.json(
      { error: "Failed to create school" },
      { status: 500 }
    );
  }
}
