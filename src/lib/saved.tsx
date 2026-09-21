import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth";

type SavedCtx = {
  saved: string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => boolean;
  canSave: boolean;
};

const Ctx = createContext<SavedCtx | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState<string[]>([]);

  const storageKey = user ? `saved-referrals-${user.uid}` : null;

  useEffect(() => {
    if (!storageKey) {
      setSaved([]);
      return;
    }
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setSaved(JSON.parse(raw) as string[]);
      else setSaved([]);
    } catch {
      setSaved([]);
    }
  }, [storageKey]);

  const toggle = useCallback((id: string) => {
    if (!storageKey) {
      return false;
    }
    let next = false;
    setSaved((prev) => {
      const has = prev.includes(id);
      next = !has;
      const list = has ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(list));
      } catch {
        /* ignore */
      }
      return list;
    });
    return next;
  }, [storageKey]);

  const value = useMemo<SavedCtx>(
    () => ({
      saved,
      isSaved: (id) => (user ? saved.includes(id) : false),
      toggle,
      canSave: !!user,
    }),
    [saved, toggle, user],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSaved() {
  const ctx = useContext(Ctx);
  if (!ctx) return { saved: [], isSaved: () => false, toggle: () => false, canSave: false } as SavedCtx;
  return ctx;
}

