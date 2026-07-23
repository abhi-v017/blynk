import { create } from "zustand";
import { UserProfile, LinkItem, ThemeConfig } from "./types";

interface EditorState {
  profile: UserProfile | null;
  links: LinkItem[];
  theme: ThemeConfig | null;
  hydrate: (profile: UserProfile, links: LinkItem[], theme: ThemeConfig) => void;
  setProfile: (patch: Partial<UserProfile>) => void;
  setTheme: (patch: Partial<ThemeConfig>) => void;
  setThemeDeep: <K extends keyof ThemeConfig>(key: K, patch: Partial<ThemeConfig[K]>) => void;
  setLinks: (links: LinkItem[]) => void;
  upsertLink: (link: LinkItem) => void;
  removeLink: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  profile: null,
  links: [],
  theme: null,

  hydrate: (profile, links, theme) => set({ profile, links, theme }),

  setProfile: (patch) =>
    set((s) => ({ profile: s.profile ? { ...s.profile, ...patch } : s.profile })),

  setTheme: (patch) =>
    set((s) => ({ theme: s.theme ? { ...s.theme, ...patch } : s.theme })),

  setThemeDeep: (key, patch) =>
    set((s) => {
      if (!s.theme) return {};
      return {
        theme: {
          ...s.theme,
          [key]: { ...(s.theme[key] as object), ...patch },
        },
      };
    }),

  setLinks: (links) => set({ links }),

  upsertLink: (link) =>
    set((s) => {
      const exists = s.links.some((l) => l.id === link.id);
      return {
        links: exists
          ? s.links.map((l) => (l.id === link.id ? link : l))
          : [...s.links, link],
      };
    }),

  removeLink: (id) => set((s) => ({ links: s.links.filter((l) => l.id !== id) })),
}));
