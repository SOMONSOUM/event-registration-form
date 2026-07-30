"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { useSyncExternalStore, type ReactNode } from "react";

export type AppearanceMode = "light" | "dark" | "system";

export const AppearanceProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableColorScheme
      enableSystem
      storageKey="event-registration-appearance"
    >
      {children}
    </ThemeProvider>
  );
};

export const useAppearance = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  return {
    theme: mounted && isAppearanceMode(theme) ? theme : "system",
    resolvedTheme:
      mounted && isResolvedTheme(resolvedTheme) ? resolvedTheme : "light",
    setTheme: (nextTheme: AppearanceMode) => setTheme(nextTheme),
  };
};

const isAppearanceMode = (
  value: string | undefined,
): value is AppearanceMode => {
  return value === "light" || value === "dark" || value === "system";
};

const isResolvedTheme = (
  value: string | undefined,
): value is "light" | "dark" => {
  return value === "light" || value === "dark";
};

const subscribe = () => () => {};
const getMountedSnapshot = () => true;
const getServerSnapshot = () => false;

const useMounted = () => {
  return useSyncExternalStore(
    subscribe,
    getMountedSnapshot,
    getServerSnapshot,
  );
};
