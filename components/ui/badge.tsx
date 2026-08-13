import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#16181F] text-[#FAF9F5]",
        winner:
          "border-[#B08A28]/30 bg-[#F3E9D2] text-[#B08A28]",
        pending:
          "border-[#1E3A5F]/20 bg-[#E4EAF1] text-[#1E3A5F]",
        not_selected:
          "border-[#E2DED2] bg-[#FAF9F5] text-[#8A8E99]",
        outline: "text-[#16181F] border-[#C9C4B3]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
