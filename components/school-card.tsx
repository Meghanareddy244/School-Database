"use client";

import Image from "next/image";
import Link from "next/link";
import useSWRMutation from "swr/mutation";
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Edit, Trash2, Calendar } from "lucide-react";

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

async function deleteSchool(url: string) {
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
  return true;
}

export function SchoolCard({
  school,
  onDeleted,
}: {
  school: School;
  onDeleted?: (id: number) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { trigger } = useSWRMutation(`/api/schools/${school.id}`, deleteSchool);

  const handleDelete = useCallback(async () => {
    if (!confirm(`Are you sure you want to delete ${school.name}?`)) return;
    try {
      setLoading(true);
      await trigger();
      toast.success("School removed successfully.");
      onDeleted?.(school.id);
    } catch {
      toast.error("Failed to delete school.");
    } finally {
      setLoading(false);
    }
  }, [trigger, onDeleted, school.id, school.name]);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-gray-200 rounded-xl">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={
            school.image
              ? `${school.image}`
              : "/placeholder.svg?height=200&width=400&query=school%20cover%20image"
          }
          alt={`${school.name} image`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {school.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
          <div>
            <p className="font-medium">
              {school.city}, {school.state}
            </p>
            <p className="text-gray-500 line-clamp-2">{school.address}</p>
          </div>
        </div>

        <div className="space-y-1 text-sm text-gray-600">
          {school.contact && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{school.contact}</span>
            </div>
          )}
          {school.emailId && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="truncate">{school.emailId}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <Calendar className="h-3 w-3" />
          <span>Added {formatDate(school.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/schools/${school.id}/edit`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
