import { z } from "zod";

export const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email"),
        password: z.string().min(5, "Password must be at least 5 characters"),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"]
    });

export const loginSchema = z
    .object({
        email: z.email("Invalid email"),
        password: z.string().min(5, "Password must be at least 5 characters"),
    });


export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;


