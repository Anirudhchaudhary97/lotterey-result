import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  size = "md",
  showTagline = fontTaglineDefault(size),
  darkBg = false,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  darkBg?: boolean;
}) {
  const iconSize = size === "sm" ? 28 : size === "lg" ? 48 : 36;
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group">
      <div className="relative flex items-center justify-center shrink-0 bg-white/90 p-1 rounded-lg shadow-sm">
        <Image
          src="/logo.png"
          alt="MeroPrize"
          width={iconSize}
          height={iconSize}
          className="object-contain"
          priority
        />
      </div>

      <div className="flex flex-col justify-center">
        <div className={`font-display font-extrabold tracking-tight flex items-center ${textSize}`}>
          <span className={darkBg ? "text-white" : "text-[#16181F]"}>Mero</span>
          <span className="text-[#A8241E]">Prize</span>
        </div>
        {showTagline && (
          <span
            className={`text-[9px] font-mono tracking-widest uppercase font-bold -mt-1 ${
              darkBg ? "text-[#A8ABB5]" : "text-[#565B66]"
            }`}
          >
            PAY BILL • WIN EVERYDAY
          </span>
        )}
      </div>
    </Link>
  );
}

function fontTaglineDefault(size: string): boolean {
  return size !== "sm";
}
