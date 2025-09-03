"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { schoolBaseSchema } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = schoolBaseSchema.extend({
  image: z.any().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function SchoolForm({
  mode,
  defaultValues,
  schoolId,
  onSuccess,
}: {
  mode: "create" | "edit";
  defaultValues?: Partial<FormValues>;
  schoolId?: number;
  onSuccess?: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    defaultValues?.image ? String(defaultValues.image) : null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      address: defaultValues?.address || "",
      city: defaultValues?.city || "",
      state: defaultValues?.state || "",
      contact: defaultValues?.contact || "",
      emailId: defaultValues?.emailId || "",
      image: defaultValues?.image || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("contact", data.contact);
      formData.append("emailId", data.emailId);
      const fileList: FileList | undefined = data.image as FileList | undefined;
      if (fileList && fileList.length > 0) {
        formData.append("image", fileList[0]);
      }

      const res = await fetch(
        mode === "create" ? "/api/schools" : `/api/schools/${schoolId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          body: formData,
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json?.error ?? "Failed"));

      toast.success(
        `School ${mode === "create" ? "created" : "updated"} successfully.`
      );

      if (mode === "create") {
        setValue("name", "");
        setValue("address", "");
        setValue("city", "");
        setValue("state", "");
        setValue("contact", "");
        setValue("emailId", "");
        setValue("image", "");
        setPreview(null);
      }
      onSuccess?.();
    } catch {
      toast.error("Operation failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">New School</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Left side form fields */}
        <div className="md:col-span-2 space-y-5">
          {/* Name */}
          <div>
            <Label className="text-gray-700">Name</Label>
            <Input placeholder="Enter school name" {...register("name")} />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <Label className="text-gray-700">Contact Number</Label>
            <Input placeholder="+1 555 123 4567" {...register("contact")} />
            {errors.contact && (
              <p className="mt-1 text-sm text-red-600">
                {errors.contact.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label className="text-gray-700">Email</Label>
            <Input
              type="email"
              placeholder="school@example.com"
              {...register("emailId")}
            />
            {errors.emailId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.emailId.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <Label className="text-gray-700">Address</Label>
            <Textarea
              rows={3}
              placeholder="Enter address"
              {...register("address")}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700">City</Label>
              <Input placeholder="City" {...register("city")} />
            </div>
            <div>
              <Label className="text-gray-700">State</Label>
              <Input placeholder="State" {...register("state")} />
            </div>
          </div>
        </div>

        {/* Right side image upload */}
        <div className="flex flex-col items-center">
          <div className="relative h-40 w-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm">Add Image</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              {...register("image")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="md:col-span-3 flex justify-end">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-black hover:bg-gray-800 text-white px-8 py-2 rounded-lg"
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
