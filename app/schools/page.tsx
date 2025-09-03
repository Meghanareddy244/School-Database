import { prisma } from "@/lib/prisma";
import SchoolsClient from "./SchoolClient";

export const dynamic = "force-dynamic";

type School = {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  image: string;
  emailId: string;
  createdAt: string;
};

export default async function SchoolsPage() {
  let schools: School[] = [];

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
