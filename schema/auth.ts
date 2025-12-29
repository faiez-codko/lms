import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export const registerSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  image: z.string().optional(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).optional().or(z.literal('')),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
