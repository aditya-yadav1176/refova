import { cn } from "@/lib/utils";

export const BRAND = "Refova";

/**
 * The full brand name is the logo. The small link-loop glyph is a
 * complementary accent only — never a standalone letter mark.
 */
export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 font-display leading-none", className)}>
      <span
        className={cn(
          "font-extrabold tracking-tight",
          size === "sm" && "text-base",
          size === "md" && "text-xl",
          size === "lg" && "text-3xl",
        )}
      >
        Ref
        <span className="text-primary">ova</span>

      </span>
      <span
        aria-hidden
        className={cn(
          "inline-block rounded-full bg-primary",
          size === "lg" ? "size-2" : "size-1.5",
        )}
      />
    </span>
  );
}
