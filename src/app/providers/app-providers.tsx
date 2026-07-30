"use client";

import { NextIntlClientProvider } from "next-intl";
import { type Locale } from "@/i18n/routing";
import { QueryProvider } from "./query-provider";

export const AppProviders = ({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: Locale;
  messages: Record<string, unknown>;
}) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>{children}</QueryProvider>
    </NextIntlClientProvider>
  );
};
