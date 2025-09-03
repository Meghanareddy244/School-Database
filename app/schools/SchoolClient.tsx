"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SchoolCard } from "@/components/school-card";
import { Plus, Building2, Search, Filter } from "lucide-react";

type School = {
  id: number;
  name: string;
  address: string;
  city: string;
  image: string;
  state: string;
  contact: string;
  emailId: string;
  createdAt: string;
};

export default function SchoolsClient({ schools }: { schools: School[] }) {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const cities = Array.from(
    new Set(schools.map((s) => s.city.trim().toLowerCase()))
  ).sort();

  function formatCity(city: string) {
    return city.charAt(0).toUpperCase() + city.slice(1);
  }

  const filteredSchools = (schools || []).filter((school) => {
    const matchesSearch =
      `${school.name} ${school.city} ${school.state} ${school.address}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCity = selectedCity
      ? school.city.toLowerCase() === selectedCity.toLowerCase()
      : true;

    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Schools Directory
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Browse, manage, and explore schools like shopping for products in a
            store. Add new institutions or edit existing ones.
          </p>
        </div>

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-2 relative">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search schools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowFilter((prev) => !prev)}
              >
                <Filter className="h-4 w-4" />
                {selectedCity ? formatCity(selectedCity) : "Filters"}
              </Button>

              {/* Dropdown for cities */}
              {showFilter && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-md z-10">
                  <button
                    onClick={() => {
                      setSelectedCity(null);
                      setShowFilter(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-blue-50 ${
                      selectedCity === null
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    All Cities
                  </button>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowFilter(false);
                      }}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-blue-50 ${
                        selectedCity?.toLowerCase() === city
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {formatCity(city)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link href="/schools/add">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add School
            </Button>
          </Link>
        </div>

        {/* Results */}
        {filteredSchools.length === 0 ? (
          <div className="rounded-lg bg-white border border-gray-200 p-12 text-center shadow-sm">
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No schools match your search
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or add a new school.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                All Schools ({filteredSchools.length})
              </h3>
              <p className="text-sm text-gray-500">
                Showing {filteredSchools.length} result
                {filteredSchools.length !== 1 && "s"}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSchools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
