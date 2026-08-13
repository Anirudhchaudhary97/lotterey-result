"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

import crypto from "crypto";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export interface AuthFormState {
  error?: string;
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/** Handles new user registration. */
export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0]) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const { name, email, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return {
        error: "An account with this email address already exists. Please log in.",
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
      },
    });

    await createSession(user.id, user.email);
  } catch (err) {
    console.error("registerAction error:", err);
    return { error: "Failed to create account. Please try again." };
  }

  redirect("/dashboard");
}

/** Handles existing user login. */
export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0]) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      return { error: "Invalid email or password. Please check your credentials." };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { error: "Invalid email or password. Please check your credentials." };
    }

    await createSession(user.id, user.email);
  } catch (err) {
    console.error("loginAction error:", err);
    return { error: "Failed to log in. Please try again." };
  }

  redirect("/dashboard");
}

/** Handles password reset link request. */
export async function requestPasswordResetAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0]) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
    }
    return { error: "Please enter a valid email address.", fieldErrors };
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success to avoid leaking registered emails, but no token generated
      return {
        success: true,
        message: "If an account exists with this email address, password reset instructions have been sent.",
      };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Clean up old reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    // Send real transactional email
    await sendPasswordResetEmail(email, resetLink);

    return {
      success: true,
      message: "If an account exists with this email address, password reset instructions have been sent to your email inbox.",
    };
  } catch (err) {
    console.error("requestPasswordResetAction error:", err);
    return { error: "Failed to process request. Please try again later." };
  }
}

/** Handles actual password reset using a reset token. */
export async function resetPasswordAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0]) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const { token, password } = parsed.data;

  try {
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return {
        error: "This password reset token is invalid or has expired. Please request a new link.",
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash },
    });

    // Delete token after successful reset
    await prisma.passwordResetToken.deleteMany({
      where: { email: resetRecord.email },
    });

    return {
      success: true,
      message: "Your password has been successfully updated! You can now log in with your new password.",
    };
  } catch (err) {
    console.error("resetPasswordAction error:", err);
    return { error: "Failed to reset password. Please try again." };
  }
}

/** Handles user logout. */
export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

