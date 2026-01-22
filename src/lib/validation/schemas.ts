import { z } from "zod";

// User validation schemas
export const RegisterSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// BucketList validation schemas
export const CreateBucketListSchema = z.object({
  name: z.string().trim().min(1, "List name is required").max(100, "List name too long"),
});

export const UpdateBucketListSchema = z.object({
  name: z.string().trim().min(1, "List name is required").max(100, "List name too long"),
});

// BucketListItem validation schemas
export const CreateItemSchema = z.object({
  text: z.string().trim().min(1, "Item text is required").max(500, "Item text too long"),
  sourceLibraryIdeaId: z.string().optional(),
});

export const UpdateItemSchema = z.object({
  text: z.string().trim().min(1, "Item text is required").max(500, "Item text too long").optional(),
  isCompleted: z.boolean().optional(),
});

// User settings validation schemas
export const UpdateUserSettingsSchema = z.object({
  activityRemindersEnabled: z.boolean(),
});

// Library search validation schema
export const LibrarySearchSchema = z.object({
  q: z.string().min(1, "Search query is required").max(100),
  limit: z.number().int().min(1).max(100).default(20),
});

// Pagination validation schema
export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// Export types
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateBucketListInput = z.infer<typeof CreateBucketListSchema>;
export type UpdateBucketListInput = z.infer<typeof UpdateBucketListSchema>;
export type CreateItemInput = z.infer<typeof CreateItemSchema>;
export type UpdateItemInput = z.infer<typeof UpdateItemSchema>;
export type UpdateUserSettingsInput = z.infer<typeof UpdateUserSettingsSchema>;
export type LibrarySearchInput = z.infer<typeof LibrarySearchSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
