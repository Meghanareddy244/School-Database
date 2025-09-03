import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center px-6 max-w-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <Building2 className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Schools Directory
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A modern platform to manage and explore schools.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/schools">
            <Button size="lg">Browse Schools</Button>
          </Link>
          <Link href="/schools/add">
            <Button variant="outline" size="lg">
              Add a School
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
