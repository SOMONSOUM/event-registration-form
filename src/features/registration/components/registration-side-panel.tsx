"use client";

import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Download,
  Mail,
  MessageCircle,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type DeliveryMethod,
  type RegistrationResult,
} from "../types/registration.type";

export const RegistrationSidePanel = ({
  method,
  result,
}: {
  method: DeliveryMethod;
  result: RegistrationResult | null;
}) => {
  return (
    <aside className="grid content-start gap-4">
      <DeliveryGuide method={method} />
      <ResultCard result={result} requestedMethod={method} />
    </aside>
  );
};

function DeliveryGuide({ method }: { method: DeliveryMethod }) {
  const t = useTranslations("registration.deliveryGuide");
  const details = {
    download: {
      icon: Download,
      title: t("download.title"),
      text: t("download.text"),
    },
    telegram: {
      icon: MessageCircle,
      title: t("telegram.title"),
      text: t("telegram.text"),
    },
    email: {
      icon: Mail,
      title: t("email.title"),
      text: t("email.text"),
    },
  }[method];
  const Icon = details.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="size-4" />
          {details.title}
        </CardTitle>
        <CardDescription>{details.text}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function ResultCard({
  result,
  requestedMethod,
}: {
  result: RegistrationResult | null;
  requestedMethod: DeliveryMethod;
}) {
  const t = useTranslations("registration.result");

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <QrCode className="size-4" />
            {t("emptyTitle")}
          </CardTitle>
          <CardDescription>{t("emptyDescription")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const method = (result.delivery?.method ??
    result.qrDeliveryMethod ??
    requestedMethod) as DeliveryMethod;
  const qrImage = result.qrImage;
  const telegramUrl = result.delivery?.telegramUrl;
  const emailSent = result.delivery?.emailSent;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          {t("completeTitle")}
        </CardTitle>
        <CardDescription>{result.fullNameEn}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {qrImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrImage}
            alt={t("qrAlt", { name: result.fullNameEn })}
            className="mx-auto size-64 rounded-md border bg-white p-3"
          />
        ) : null}

        <div className="grid gap-2 rounded-md bg-muted p-3 text-sm">
          <p>
            <span className="font-medium">{t("registrationId")}:</span>{" "}
            {result.id}
          </p>
          <p>
            <span className="font-medium">{t("checkInCode")}:</span>{" "}
            {result.checkInCode ?? "-"}
          </p>
          <p>
            <span className="font-medium">{t("delivery")}:</span> {method}
          </p>
          <p>
            <span className="font-medium">{t("status")}:</span>{" "}
            {result.qrDeliveryStatus ?? "-"}
          </p>
        </div>

        {method === "download" && qrImage ? (
          <Button asChild>
            <a
              href={qrImage}
              download={`${result.fullNameEn || "attendee"}-qr.png`}
              target="_blank"
              rel="noreferrer"
            >
              <Download className="size-4" />
              {t("download")}
            </a>
          </Button>
        ) : null}

        {method === "telegram" ? (
          telegramUrl ? (
            <Button asChild>
              <a href={telegramUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                {t("telegram")}
              </a>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("telegramPending")}
            </p>
          )
        ) : null}

        {method === "email" ? (
          <p className="rounded-md border bg-muted p-3 text-sm">
            {emailSent ? t("emailSent") : t("emailPending")}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
