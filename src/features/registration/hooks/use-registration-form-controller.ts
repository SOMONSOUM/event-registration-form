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
  const [pendingLocationRetry, setPendingLocationRetry] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);

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
    setPendingLocationRetry(false);

    try {
      setResult(await registerMutation.mutateAsync(parsed.data));
    } catch (error) {
      const message = apiErrorMessage(error, t("messages.failed"));
      if (!isLocationRequiredError(message)) {
        setSubmitError(message);
        return;
      }

      setPendingLocationRetry(true);
      registerMutation.reset();
      try {
        const coordinates = await getCurrentCoordinates();
        setResult(
          await registerMutation.mutateAsync({
            ...parsed.data,
            ...coordinates,
          }),
        );
      } catch (retryError) {
        setSubmitError(apiErrorMessage(retryError, t("messages.failed")));
      } finally {
        setPendingLocationRetry(false);
      }
    }
  };

  return {
    form,
    errors,
    result,
    submit,
    update,
    errorMessage: result
      ? null
      : submitError ||
        (registerMutation.error && !pendingLocationRetry
          ? apiErrorMessage(registerMutation.error, t("messages.failed"))
          : null),
    isSubmitting: registerMutation.isPending || pendingLocationRetry,
  };
};

function isLocationRequiredError(message: string) {
  return /location/i.test(message);
}

function getCurrentCoordinates() {
  return new Promise<{ latitude: number; longitude: number }>(
    (resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Location is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        () => reject(new Error("Unable to read current location.")),
        { enableHighAccuracy: true, maximumAge: 30_000, timeout: 10_000 },
      );
    },
  );
}
