import Link from "next/link";
import { SchoolForm } from "@/components/school-form";
import { ArrowLeft, Building2 } from "lucide-react";

export default function AddSchoolPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <main className="container mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/schools"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Schools
          </Link>

          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-inner">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-gray-900">
              Add New School
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Fill out the form below to add a new school — just like adding a
              product to an online store.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="rounded-xl bg-white shadow-lg border border-gray-200 p-8">
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              School Information
            </h2>
            <p className="text-gray-600 text-sm">
              Enter all required details about the institution.
            </p>
          </div>
          <SchoolForm mode="create" />
        </div>
      </main>
    </div>
  );
}
