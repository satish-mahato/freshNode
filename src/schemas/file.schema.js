import { z } from "zod";


export const fileUploadSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  })
  .min(1, { message: "Title cannot be empty" })
  .trim(),
  
  category: z.string({
    required_error: "Category is required",
    invalid_type_error: "Category must be a string",
  })
  .min(1, { message: "Category cannot be empty" })
  .trim(),
  
  uploadTime: z
    .string({ invalid_type_error: "Upload time must be a string" })
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)), 
      { message: "Invalid date format. Please use ISO format (YYYY-MM-DD)" }
    ),
});

export const fileEditSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  })
  .min(1, { message: "Title cannot be empty" })
  .trim(),
});