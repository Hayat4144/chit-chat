import { z } from 'zod';

export const authSchma = z.object({
  email: z.string().email({ message: 'Please enter valid email address' }),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
    }),
});

export const SignupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'firstname should be minimum 2 character long.' })
      .max(20),
    lastName: z
      .string()
      .min(2, { message: 'lastname should be minimum 2 character long.' })
      .max(20),
    email: z.string().email({ message: 'Please enter valid email address' }),
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters long',
      })
      .max(100)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
        message:
          'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match.",
    path: ['confirmPassword'],
  });
