import { create } from 'zustand';

export type AppInfo = {
  version: string | null;
  runtimeVersion: string | null;
};

type AppInfoStoreState = AppInfo & {
  isLoaded: boolean;
  setAppInfo: (info: { version: string; runtimeVersion: string }) => void;
  setLoaded: () => void;
  clear: () => void;
};

export const useAppInfoStore = create<AppInfoStoreState>((set) => ({
  version: null,
  runtimeVersion: null,
  isLoaded: false,
  setAppInfo: (info) =>
    set({
      version: info.version,
      runtimeVersion: info.runtimeVersion,
      isLoaded: true,
    }),
  setLoaded: () => set({ isLoaded: true }),
  clear: () => set({ version: null, runtimeVersion: null, isLoaded: false }),
}));

export default useAppInfoStore;
