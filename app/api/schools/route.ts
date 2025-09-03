import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { schoolCreateSchema } from "@/lib/validators";
import { mkdir, stat, writeFile } from "fs/promises";
import path from "path";

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

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

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
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
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
    const imagePath = `/schoolImages/${filename}`;

    const created = await prisma.school.create({
      data: { name, address, city, state, contact, image: imagePath, emailId },
    });
    console.log(created);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create school" },
      { status: 500 }
    );
  }
}
