import { z } from "zod";

export const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

export const schoolBaseSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  contact: z.string().regex(phoneRegex, "Enter a valid phone number"),
  emailId: z.string().email("Enter a valid email"),
});

export const schoolCreateSchema = schoolBaseSchema;
export const schoolUpdateSchema = schoolBaseSchema.partial();
