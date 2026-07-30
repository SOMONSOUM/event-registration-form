"use client";

import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";

import { Button } from "@/components/ui/button";

export const LanguageSwitcher = () => {
  const t = useTranslations("registration");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "km";
  const nextLocale = locale === "km" ? "en" : "km";
  const countryCode = locale === "km" ? "KH" : "US";

  function switchLocale() {
    const nextPath = pathname.replace(/^\/(en|km)(?=\/|$)/, `/${nextLocale}`);
    router.replace(nextPath);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={t("actions.switchLanguage")}
      onClick={switchLocale}
    >
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        aria-hidden="true"
        style={{ height: "1rem", width: "1.25rem" }}
      />
    </Button>
  );
};
