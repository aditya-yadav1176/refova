import { useState } from "react";
import { Bookmark, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/saved";

export function CopyButton({
  code,
  service,
  size = "md",
  className,
}: {
  code: string;
  service: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard blocked — still show the prototype success state */
    }
    setCopied(true);
    toast.success(`${service} referral copied`, { description: "Paste it at signup to claim the benefit." });
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border-2 border-foreground font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        copied ? "bg-leaf-soft text-leaf" : "bg-foreground text-background hover:bg-foreground/90",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "w-full px-5 py-3.5 text-base",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="size-4 animate-pop" /> Copied!
        </>
      ) : (
        <>
          <Copy className="size-4" /> Copy referral
        </>
      )}
    </button>
  );
}

export function SaveButton({
  id,
  service,
  className,
  withLabel = false,
}: {
  id: string;
  service: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { isSaved, toggle } = useSaved();
  const active = isSaved(id);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from saved" : "Save referral"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const now = toggle(id);
        toast(now ? `Saved ${service}` : `Removed ${service}`, {
          description: now ? "Find it under Saved on your profile." : undefined,
        });
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-secondary active:translate-y-0 active:scale-[0.97]",
        active && "border-primary/40 bg-primary/5 text-primary",
        className,
      )}
    >
      <Bookmark className={cn("size-4", active && "fill-current animate-pop")} />
      {withLabel && <span className="font-medium">{active ? "Saved" : "Save"}</span>}
    </button>
  );
}
