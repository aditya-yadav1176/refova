import { useCallback, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Check, Copy, ScanEye, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Tags = {
  title: string;
  description: string;
  image: string;
  canonical: string;
  twitterCard: string;
  ogUrl: string;
  ogType: string;
};

function read(): Tags {
  const meta = (sel: string) =>
    document.querySelector<HTMLMetaElement>(sel)?.content?.trim() ?? "";
  const abs = (href: string) => {
    if (!href) return "";
    try {
      return new URL(href, window.location.origin).href;
    } catch {
      return href;
    }
  };

  return {
    title: meta('meta[property="og:title"]') || document.title,
    description:
      meta('meta[property="og:description"]') || meta('meta[name="description"]'),
    image: abs(meta('meta[property="og:image"]') || meta('meta[name="twitter:image"]')),
    canonical: abs(
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? "",
    ),
    ogUrl: abs(meta('meta[property="og:url"]')),
    ogType: meta('meta[property="og:type"]'),
    twitterCard: meta('meta[name="twitter:card"]'),
  };
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const missing = !value;

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        {!missing && (
          <button
            type="button"
            aria-label={`Copy ${label}`}
            onClick={() => {
              navigator.clipboard?.writeText(value);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1200);
            }}
            className="press grid size-6 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          </button>
        )}
      </div>
      <p
        className={`mt-1.5 break-words text-sm ${missing ? "italic text-destructive" : "text-foreground"} ${
          mono && !missing ? "font-mono text-xs" : ""
        }`}
      >
        {missing ? "not set" : value}
      </p>
    </div>
  );
}

export function LinkPreviewDebug() {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Tags | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const refresh = useCallback(() => setTags(read()), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Head tags are written after render; read on the next frame.
    const id = window.setTimeout(refresh, 30);
    return () => window.clearTimeout(id);
  }, [open, pathname, refresh]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Link preview debug (⌘/Ctrl + Shift + L)"
        aria-label="Open link preview debug"
        className="press fixed bottom-4 left-4 z-40 hidden items-center gap-2 rounded-full border-2 border-foreground bg-card px-3 py-2 text-xs font-semibold shadow-sm md:inline-flex"
      >
        <ScanEye className="size-4" />
        Link preview
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Link preview</DialogTitle>
            <DialogDescription>
              Tags currently in the document head for{" "}
              <span className="font-mono text-foreground">{pathname}</span>.
            </DialogDescription>
          </DialogHeader>

          {tags && (
            <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
              <div className="overflow-hidden rounded-xl border-2 border-foreground bg-card">
                {tags.image ? (
                  <img
                    src={tags.image}
                    alt="Social preview"
                    className="aspect-[1200/630] w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[1200/630] w-full place-items-center bg-secondary text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <X className="size-3.5" /> no og:image
                    </span>
                  </div>
                )}
                <div className="border-t-2 border-foreground p-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {tags.canonical ? new URL(tags.canonical).hostname : "—"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold">{tags.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {tags.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Row label="og:title" value={tags.title} />
                <Row label="og:description" value={tags.description} />
                <Row label="og:image" value={tags.image} mono />
                <Row label="canonical" value={tags.canonical} mono />
                <Row label="og:url" value={tags.ogUrl} mono />
                <div className="grid grid-cols-2 gap-2">
                  <Row label="og:type" value={tags.ogType} />
                  <Row label="twitter:card" value={tags.twitterCard} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
