"use client";

import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppearance } from "@/app/providers/appearance-provider";
import { LanguageSwitcher } from "./language-switcher";

export const RegistrationHeader = () => {
  const t = useTranslations("registration");
  const { resolvedTheme, setTheme } = useAppearance();

  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("actions.toggleTheme")}
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
        <LanguageSwitcher />
      </div>
    </header>
  );
};
