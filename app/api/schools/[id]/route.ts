import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { schoolUpdateSchema } from "@/lib/validators";
import { mkdir, stat, writeFile } from "fs/promises";
import path from "path";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}
async function ensureDir(dirPath: string) {
  try {
    const s = await stat(dirPath);
    if (!s.isDirectory()) throw new Error("Path exists and is not a dir");
  } catch {
    await mkdir(dirPath, { recursive: true });
  }
}

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
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

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

    const imageUpdate: { image?: string } = {};
    const image = formData.get("image") as File | null;
    if (image && image.size > 0) {
      if (!image.type.startsWith("image/")) {
        return NextResponse.json({ error: "Invalid image" }, { status: 400 });
      }
      const bytes = Buffer.from(await image.arrayBuffer());
      if (bytes.length > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image too large (max 5MB)" },
          { status: 400 }
        );
      }
      const uploadDir = path.join(process.cwd(), "public", "schoolImages");
      await ensureDir(uploadDir);
      const ext = path.extname(image.name) || ".png";
      const base = path.basename(image.name, ext);
      const filename = `${Date.now()}-${sanitizeFilename(base)}${ext}`;
      await writeFile(path.join(uploadDir, filename), bytes);
      imageUpdate.image = `/schoolImages/${filename}`;
    }

    const updated = await prisma.school.update({
      where: { id: schoolId },
      data: { ...parsed.data, ...imageUpdate },
    });
    return NextResponse.json({ data: updated });
  } catch {
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
