"use client";

import useSWR from "swr";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SchoolForm } from "@/components/school-form";

type School = {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  emailId: string;
  image: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function EditSchoolPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, mutate } = useSWR<{ data: School }>(
    params?.id ? `/api/schools/${params.id}` : null,
    fetcher
  );

  if (isLoading) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-8">Loading...</main>
    );
  }
  if (!data?.data) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-8">Not found</main>
    );
  }

  const school = data.data;

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 font-sans">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">Edit School</h1>
        <Link href="/schools">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>
      <SchoolForm
        mode="edit"
        schoolId={school.id}
        defaultValues={{
          name: school.name,
          emailId: school.emailId,
          contact: school.contact,
          image: school.image,
          city: school.city,
          state: school.state,
          address: school.address,
        }}
        onSuccess={() => mutate()} // refresh after update
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Uploading a new image will replace the current one.
      </p>
    </main>
  );
}
