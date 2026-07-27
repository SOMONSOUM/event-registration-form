"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  Mail,
  MessageCircle,
  QrCode,
  Send,
} from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type DeliveryMethod,
  type Gender,
  type RegistrationPayload,
  type RegistrationResult,
  getConfiguredQrCode,
  registerAttendee,
} from "@/lib/registration-api";

type FormState = RegistrationPayload & {
  qrCode: string;
};

const initialForm: FormState = {
  qrCode: getConfiguredQrCode(),
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

const registrationSchema = z
  .object({
    qrCode: z
      .string()
      .trim()
      .min(
        1,
        "Missing QR code. Open this form with ?code=YOUR_QR_CODE or set NEXT_PUBLIC_API_BASE_URL to the full register URL.",
      ),
    fullNameKm: z.string().trim().min(1, "Khmer full name is required."),
    fullNameEn: z.string().trim().min(1, "English full name is required."),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    title: z.string().optional(),
    position: z.string().trim().min(1, "Position is required."),
    organization: z.string().trim().min(1, "Organization is required."),
    phoneNumber: z
      .string()
      .trim()
      .regex(/[0-9+()\-\s]{8,}/, "Phone number must be at least 8 digits."),
    email: z.union([z.email("Enter a valid email."), z.literal("")]).optional(),
    deliveryMethod: z.enum(["download", "telegram", "email"]),
    profileImageUrl: z
      .union([z.url("Use a valid profile image URL."), z.literal("")])
      .optional(),
  })
  .superRefine((value, context) => {
    if (value.deliveryMethod === "email" && !value.email?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["email"],
        message: "Email is required when delivery method is email.",
      });
    }
  });

export function RegistrationForm({
  initialQrCode,
}: {
  initialQrCode?: string;
}) {
  const [form, setForm] = useState<FormState>({
    ...initialForm,
    qrCode: initialQrCode || initialForm.qrCode,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const endpointPreview = useMemo(() => {
    const code = form.qrCode.trim() || "{qrCode}";
    return `/attendance/qr/${code}/register`;
  }, [form.qrCode]);
  const hasQrCode = Boolean(form.qrCode.trim());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    const parsed = registrationSchema.safeParse(form);
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
    setIsSubmitting(true);
    try {
      const { qrCode, ...payload } = parsed.data;
      const data = await registerAttendee(qrCode, payload);
      setResult(data);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-6">
        <section className="grid content-start gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Event API Integration
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Complete attendee registration
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                The QR code is supplied by this page URL or environment config,
                then submitted to the public API. The delivery method controls
                whether the response gives a download card, Telegram bot link,
                or email delivery status.
              </p>
            </div>
            <div className="rounded-md border bg-muted px-3 py-2 text-xs">
              <span className="font-semibold">POST</span>{" "}
              <code>{endpointPreview}</code>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registration form</CardTitle>
              <CardDescription>
                Required fields match the public registration contract used by
                the event QR scan page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-5" onSubmit={submit}>
                {!hasQrCode || errors.qrCode ? (
                  <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <p>
                      {errors.qrCode ||
                        "This form is waiting for a QR code from the page URL or full API URL env."}
                    </p>
                  </div>
                ) : null}
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    htmlFor="fullNameKm"
                    label="Full name (Khmer)"
                    error={errors.fullNameKm}
                  >
                    <Input
                      id="fullNameKm"
                      value={form.fullNameKm}
                      onChange={(event) =>
                        update("fullNameKm", event.target.value)
                      }
                      placeholder="ឈ្មោះពេញ"
                    />
                  </Field>
                  <Field
                    htmlFor="fullNameEn"
                    label="Full name (English)"
                    error={errors.fullNameEn}
                  >
                    <Input
                      id="fullNameEn"
                      value={form.fullNameEn}
                      onChange={(event) =>
                        update("fullNameEn", event.target.value)
                      }
                      placeholder="Last name, First name"
                    />
                  </Field>

                  <Field htmlFor="gender" label="Gender" error={errors.gender}>
                    <Select
                      value={form.gender}
                      onValueChange={(value) =>
                        update("gender", value as Gender)
                      }
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field htmlFor="title" label="Title" error={errors.title}>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(event) => update("title", event.target.value)}
                      placeholder="Mr., Ms., Dr."
                    />
                  </Field>

                  <Field
                    htmlFor="position"
                    label="Position"
                    error={errors.position}
                  >
                    <Input
                      id="position"
                      value={form.position}
                      onChange={(event) =>
                        update("position", event.target.value)
                      }
                      placeholder="e.g. Director"
                    />
                  </Field>
                  <Field
                    htmlFor="organization"
                    label="Organization / Institution"
                    error={errors.organization}
                  >
                    <Input
                      id="organization"
                      value={form.organization}
                      onChange={(event) =>
                        update("organization", event.target.value)
                      }
                      placeholder="Full name of organization"
                    />
                  </Field>

                  <Field
                    htmlFor="phoneNumber"
                    label="Phone number"
                    error={errors.phoneNumber}
                  >
                    <Input
                      id="phoneNumber"
                      value={form.phoneNumber}
                      onChange={(event) =>
                        update("phoneNumber", event.target.value)
                      }
                      placeholder="+855 -- --- ---"
                    />
                  </Field>
                  <Field htmlFor="email" label="Email" error={errors.email}>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      placeholder="attendee@example.com"
                    />
                  </Field>

                  <Field
                    htmlFor="deliveryMethod"
                    label="Delivery method"
                    error={errors.deliveryMethod}
                  >
                    <Select
                      value={form.deliveryMethod}
                      onValueChange={(value) =>
                        update("deliveryMethod", value as DeliveryMethod)
                      }
                    >
                      <SelectTrigger id="deliveryMethod">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="download">
                          Download QR card
                        </SelectItem>
                        <SelectItem value="telegram">
                          Telegram bot link
                        </SelectItem>
                        <SelectItem value="email">Send to email</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field
                    htmlFor="profileImageUrl"
                    label="Profile image URL"
                    error={errors.profileImageUrl}
                  >
                    <Input
                      id="profileImageUrl"
                      value={form.profileImageUrl}
                      onChange={(event) =>
                        update("profileImageUrl", event.target.value)
                      }
                      placeholder="https://example.com/profile.jpg"
                    />
                  </Field>
                </div>

                {error ? (
                  <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                ) : null}

                <Button type="submit" className="w-fit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  {isSubmitting ? "Registering..." : "Register attendee"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <aside className="grid content-start gap-4">
          <DeliveryGuide method={form.deliveryMethod ?? "download"} />
          <ResultCard result={result} requestedMethod={form.deliveryMethod} />
        </aside>
      </div>
    </main>
  );
}

function Field({
  htmlFor,
  label,
  error,
  className,
  children,
}: {
  htmlFor: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function DeliveryGuide({ method }: { method: DeliveryMethod }) {
  const details = {
    download: {
      icon: Download,
      title: "Download",
      text: "The API returns QR/card assets. Show a card preview and provide a download link.",
    },
    telegram: {
      icon: MessageCircle,
      title: "Telegram",
      text: "The API can return a Telegram bot URL. Open it so the attendee can link their QR delivery.",
    },
    email: {
      icon: Mail,
      title: "Email",
      text: "The API sends the QR/card to the attendee email and returns email delivery status.",
    },
  }[method];
  const Icon = details.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="size-4" />
          Delivery behavior
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
  requestedMethod?: DeliveryMethod;
}) {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <QrCode className="size-4" />
            API response
          </CardTitle>
          <CardDescription>
            After registration, QR delivery details will appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const method = (result.delivery?.method ??
    result.qrDeliveryMethod ??
    requestedMethod ??
    "download") as DeliveryMethod;
  const downloadUrl =
    result.delivery?.downloadUrl ?? result.cardImageUrl ?? result.cardImage;
  const telegramUrl = result.delivery?.telegramUrl;
  const emailSent = result.delivery?.emailSent;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-emerald-700">
          <CheckCircle2 className="size-4" />
          Registration complete
        </CardTitle>
        <CardDescription>{result.fullNameEn}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {result.qrImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.qrImage}
            alt={`${result.fullNameEn} QR code`}
            className="mx-auto size-48 rounded-md border bg-white p-2"
          />
        ) : null}

        <div className="grid gap-2 rounded-md bg-muted p-3 text-sm">
          <p>
            <span className="font-medium">Registration ID:</span> {result.id}
          </p>
          <p>
            <span className="font-medium">Check-in code:</span>{" "}
            {result.checkInCode ?? "-"}
          </p>
          <p>
            <span className="font-medium">Delivery:</span> {method}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            {result.qrDeliveryStatus ?? "-"}
          </p>
        </div>

        {method === "download" && downloadUrl ? (
          <Button asChild>
            <a href={downloadUrl} download target="_blank" rel="noreferrer">
              <Download className="size-4" />
              Download QR card
            </a>
          </Button>
        ) : null}

        {method === "telegram" ? (
          telegramUrl ? (
            <Button asChild>
              <a href={telegramUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                Open Telegram bot
              </a>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Telegram delivery was requested. The API did not return a bot link
              in this response.
            </p>
          )
        ) : null}

        {method === "email" ? (
          <p className="rounded-md border bg-muted p-3 text-sm">
            {emailSent
              ? "The QR card was sent to the attendee email."
              : "Email delivery was requested. Check the API delivery status above."}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
