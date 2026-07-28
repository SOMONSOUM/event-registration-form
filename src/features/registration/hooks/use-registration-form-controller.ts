"use client";

import { FormEvent, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { apiErrorMessage } from "@/lib/api/api-client";
import { useRegisterAttendee } from "./use-register-attendee";
import {
  type RegistrationPayload,
  type RegistrationResult,
} from "../types/registration.type";

export type RegistrationFormState = RegistrationPayload;

const initialForm: RegistrationFormState = {
  fullNameKm: "",
  fullNameEn: "",
  gender: "MALE",
  title: "",
  position: "",
  organization: "",
  phoneNumber: "",
  email: "",
  deliveryMethod: "download",
  profileImageUrl: "",
};

export const useRegistrationFormController = () => {
  const t = useTranslations("registration");
  const registerMutation = useRegisterAttendee();
  const [form, setForm] = useState<RegistrationFormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RegistrationResult | null>(null);

  const schema = useMemo(
    () =>
      z
        .object({
          fullNameKm: z.string().trim().min(1, t("validation.fullNameKm")),
          fullNameEn: z.string().trim().min(1, t("validation.fullNameEn")),
          gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
          title: z.string().optional(),
          position: z.string().trim().min(1, t("validation.position")),
          organization: z.string().trim().min(1, t("validation.organization")),
          phoneNumber: z
            .string()
            .trim()
            .regex(/[0-9+()\-\s]{8,}/, t("validation.phoneNumber")),
          email: z
            .union([z.email(t("validation.email")), z.literal("")])
            .optional(),
          deliveryMethod: z.enum(["download", "telegram", "email"]),
          profileImageUrl: z
            .union([z.url(t("validation.profileImageUrl")), z.literal("")])
            .optional(),
        })
        .superRefine((value, context) => {
          if (value.deliveryMethod === "email" && !value.email?.trim()) {
            context.addIssue({
              code: "custom",
              path: ["email"],
              message: t("validation.emailRequired"),
            });
          }
        }),
    [t],
  );

  const update = <K extends keyof RegistrationFormState>(
    key: K,
    value: RegistrationFormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [
            String(issue.path[0] ?? "form"),
            issue.message,
          ]),
        ),
      );
      return;
    }

    setErrors({});

    try {
      setResult(await registerMutation.mutateAsync(parsed.data));
    } catch {
      // Error message is rendered from the mutation state.
    }
  };

  return {
    form,
    errors,
    result,
    submit,
    update,
    errorMessage: registerMutation.error
      ? apiErrorMessage(registerMutation.error, t("messages.failed"))
      : null,
    isSubmitting: registerMutation.isPending,
  };
};
