import { z } from "zod";

/** DummyJSON POST /auth/login response DTO. Extra fields are stripped. */
export const authLoginDtoSchema = z.object({
  id: z.number(),
  username: z.string().min(1),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  image: z.string().optional(),
  accessToken: z.string().min(1),
});

export type AuthLoginDto = z.infer<typeof authLoginDtoSchema>;

export const loginFormSchema = z.object({
  username: z.string().trim().min(1, "required"),
  password: z.string().min(1, "required"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    firstName: z.string().trim().min(1, "required"),
    lastName: z.string().trim().min(1, "required"),
    email: z.string().trim().min(1, "required").email("email"),
    username: z.string().trim().min(1, "required"),
    password: z.string().min(1, "required"),
    confirmPassword: z.string().min(1, "required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
