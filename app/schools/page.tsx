import { prisma } from "@/lib/prisma";
import SchoolsClient from "./SchoolClient";

export const dynamic = "force-dynamic";

export default async function SchoolsPage() {
  let schools: any[] = [];

  try {
    const rows = await prisma.school.findMany({
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

    schools = rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  } catch (err) {
    console.error("Failed to fetch schools:", err);
  }

  return <SchoolsClient schools={schools} />;
}
