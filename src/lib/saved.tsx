import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const KEY = "saved-referrals";

type SavedCtx = {
  saved: string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => boolean;
};

const Ctx = createContext<SavedCtx | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSaved(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback((id: string) => {
    let next = false;
    setSaved((prev) => {
      const has = prev.includes(id);
      next = !has;
      const list = has ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        window.localStorage.setItem(KEY, JSON.stringify(list));
      } catch {
        /* ignore */
      }
      return list;
    });
    return next;
  }, []);

  const value = useMemo<SavedCtx>(
    () => ({ saved, isSaved: (id) => saved.includes(id), toggle }),
    [saved, toggle],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSaved() {
  const ctx = useContext(Ctx);
  if (!ctx) return { saved: [], isSaved: () => false, toggle: () => false } as SavedCtx;
  return ctx;
}
