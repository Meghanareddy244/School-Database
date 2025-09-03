import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { schoolUpdateSchema } from "@/lib/validators";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const schoolId = Number(id);
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: school });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch school" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const schoolId = Number(id);

    const formData = await req.formData();
    const payload = {
      name: formData.get("name") ? String(formData.get("name")) : undefined,
      address: formData.get("address")
        ? String(formData.get("address"))
        : undefined,
      city: formData.get("city") ? String(formData.get("city")) : undefined,
      state: formData.get("state") ? String(formData.get("state")) : undefined,
      contact: formData.get("contact")
        ? String(formData.get("contact"))
        : undefined,
      emailId: formData.get("emailId")
        ? String(formData.get("emailId"))
        : undefined,
    };

    const parsed = schoolUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;
    const image = formData.get("image") as File | null;

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

    const updated = await prisma.school.update({
      where: { id: schoolId },
      data: { ...parsed.data, ...(imageUrl ? { image: imageUrl } : {}) },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("Update school error:", err);
    return NextResponse.json(
      { error: "Failed to update school" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const schoolId = Number(id);
    await prisma.school.delete({ where: { id: schoolId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete school" },
      { status: 500 }
    );
  }
}
