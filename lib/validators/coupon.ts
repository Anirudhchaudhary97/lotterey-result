import { z } from "zod";

export const couponFormSchema = z.object({
  couponNumber: z
    .string()
    .trim()
    .min(6, "Coupon number looks too short")
    .max(20, "Coupon number looks too long")
    .regex(/^[0-9A-Za-z\s]+$/, "Coupon number can only contain letters and numbers"),
  billNumber: z
    .string()
    .trim()
    .optional()
    .transform((val) => val || ""),
  purchaseDate: z.coerce.date({ message: "Enter a valid purchase date" }),
});

export type CouponFormValues = z.infer<typeof couponFormSchema>;
