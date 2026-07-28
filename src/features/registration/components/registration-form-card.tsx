"use client";

import { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "./field";
import {
  type DeliveryMethod,
  type Gender,
} from "../types/registration.type";
import { type RegistrationFormState } from "../hooks/use-registration-form-controller";

type RegistrationFormCardProps = {
  form: RegistrationFormState;
  errors: Record<string, string>;
  errorMessage: string | null;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: <K extends keyof RegistrationFormState>(
    key: K,
    value: RegistrationFormState[K],
  ) => void;
};

export const RegistrationFormCard = ({
  form,
  errors,
  errorMessage,
  isSubmitting,
  onSubmit,
  onChange,
}: RegistrationFormCardProps) => {
  const t = useTranslations("registration");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.title")}</CardTitle>
        <CardDescription>{t("form.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              htmlFor="fullNameKm"
              label={t("fields.fullNameKm")}
              error={errors.fullNameKm}
            >
              <Input
                id="fullNameKm"
                value={form.fullNameKm}
                onChange={(event) =>
                  onChange("fullNameKm", event.target.value)
                }
                placeholder={t("placeholders.fullNameKm")}
              />
            </Field>
            <Field
              htmlFor="fullNameEn"
              label={t("fields.fullNameEn")}
              error={errors.fullNameEn}
            >
              <Input
                id="fullNameEn"
                value={form.fullNameEn}
                onChange={(event) =>
                  onChange("fullNameEn", event.target.value)
                }
                placeholder={t("placeholders.fullNameEn")}
              />
            </Field>

            <Field htmlFor="gender" label={t("fields.gender")}>
              <Select
                value={form.gender}
                onValueChange={(value) => onChange("gender", value as Gender)}
              >
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">
                    {t("options.gender.male")}
                  </SelectItem>
                  <SelectItem value="FEMALE">
                    {t("options.gender.female")}
                  </SelectItem>
                  <SelectItem value="OTHER">
                    {t("options.gender.other")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field htmlFor="title" label={t("fields.title")}>
              <Input
                id="title"
                value={form.title}
                onChange={(event) => onChange("title", event.target.value)}
                placeholder={t("placeholders.title")}
              />
            </Field>

            <Field
              htmlFor="position"
              label={t("fields.position")}
              error={errors.position}
            >
              <Input
                id="position"
                value={form.position}
                onChange={(event) => onChange("position", event.target.value)}
                placeholder={t("placeholders.position")}
              />
            </Field>
            <Field
              htmlFor="organization"
              label={t("fields.organization")}
              error={errors.organization}
            >
              <Input
                id="organization"
                value={form.organization}
                onChange={(event) =>
                  onChange("organization", event.target.value)
                }
                placeholder={t("placeholders.organization")}
              />
            </Field>

            <Field
              htmlFor="phoneNumber"
              label={t("fields.phoneNumber")}
              error={errors.phoneNumber}
            >
              <Input
                id="phoneNumber"
                value={form.phoneNumber}
                onChange={(event) =>
                  onChange("phoneNumber", event.target.value)
                }
                placeholder={t("placeholders.phoneNumber")}
              />
            </Field>
            <Field htmlFor="email" label={t("fields.email")} error={errors.email}>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder={t("placeholders.email")}
              />
            </Field>

            <Field htmlFor="deliveryMethod" label={t("fields.deliveryMethod")}>
              <Select
                value={form.deliveryMethod}
                onValueChange={(value) =>
                  onChange("deliveryMethod", value as DeliveryMethod)
                }
              >
                <SelectTrigger id="deliveryMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="download">
                    {t("options.delivery.download")}
                  </SelectItem>
                  <SelectItem value="telegram">
                    {t("options.delivery.telegram")}
                  </SelectItem>
                  <SelectItem value="email">
                    {t("options.delivery.email")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field
              htmlFor="profileImageUrl"
              label={t("fields.profileImageUrl")}
              error={errors.profileImageUrl}
            >
              <Input
                id="profileImageUrl"
                value={form.profileImageUrl}
                onChange={(event) =>
                  onChange("profileImageUrl", event.target.value)
                }
                placeholder={t("placeholders.profileImageUrl")}
              />
            </Field>
          </div>

          {errorMessage ? (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          ) : null}

          <Button type="submit" className="w-fit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {isSubmitting ? t("actions.submitting") : t("actions.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
