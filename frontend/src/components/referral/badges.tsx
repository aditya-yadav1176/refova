import { BadgeCheck, Clock3, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryBySlug, trustLabel, type CategorySlug, type Trust } from "@/lib/referrals";

export function BenefitBadge({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-primary font-display font-extrabold uppercase tracking-tight text-primary-foreground",
        size === "sm" && "px-2 py-0.5 text-[11px]",
        size === "md" && "px-2.5 py-1 text-sm",
        size === "lg" && "px-4 py-2 text-xl md:text-2xl",
        className,
      )}
      style={{ boxShadow: "3px 3px 0 var(--ink)" }}
    >
      {children}
    </span>
  );
}

const trustIcon = {
  verified: BadgeCheck,
  trusted: Users,
  new: Sparkles,
  expiring: Clock3,
};

export function TrustBadge({ trust, className }: { trust: Trust; className?: string }) {
  const Icon = trustIcon[trust];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        trust === "verified" && "bg-leaf-soft text-leaf",
        trust === "trusted" && "bg-grape-soft text-grape",
        trust === "new" && "bg-sky-soft text-sky",
        trust === "expiring" && "bg-amber-soft text-amber",
        className,
      )}
    >
      <Icon className="size-3" />
      {trustLabel[trust]}
    </span>
  );
}

export function CategoryChip({ slug, className }: { slug: CategorySlug; className?: string }) {
  const c = categoryBySlug[slug];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-semibold",
        c.accent,
        className,
      )}
    >
      <span className="text-xs leading-none">{c.emoji}</span>
      {c.name}
    </span>
  );
}

export function ServiceMark({
  initials,
  slug,
  size = "md",
}: {
  initials: string;
  slug: CategorySlug;
  size?: "sm" | "md" | "lg";
}) {
  const c = categoryBySlug[slug];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl border border-border font-display font-bold",
        c.soft,
        c.accent,
        size === "sm" && "size-9 text-xs",
        size === "md" && "size-11 text-sm",
        size === "lg" && "size-16 text-xl",
      )}
    >
      {initials}
    </span>
  );
}
