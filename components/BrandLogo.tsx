import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  size = "md",
  showTagline = true,
  darkBg = false,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  darkBg?: boolean;
}) {
  const iconHeight = size === "sm" ? 34 : size === "lg" ? 58 : 44;
  const iconWidth = Math.round(iconHeight * 0.85); // trophy aspect ratio is ~130x155
  const titleSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";
  const taglineSize = size === "sm" ? "text-[8.5px]" : size === "lg" ? "text-[11px]" : "text-[9.5px]";

  return (
    <Link href="/" className="inline-flex items-center gap-3 group select-none">
      <div className="relative flex items-center justify-center shrink-0">
        <Image
          src="/trophy-icon.png"
          alt="MeroPrize Trophy"
          width={iconWidth}
          height={iconHeight}
          className="object-contain drop-shadow-sm transition-transform group-hover:scale-105"
          priority
        />
      </div>

      <div className="flex flex-col justify-center">
        <div className={`font-display font-extrabold tracking-tight leading-none flex items-center ${titleSize}`}>
          <span className={darkBg ? "text-white" : "text-[#16181F]"}>Mero</span>
          <span className="text-[#A8241E]">Prize</span>
        </div>
        {showTagline && (
          <span
            className={`font-mono tracking-wider uppercase font-bold mt-1 leading-none ${taglineSize} ${
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
