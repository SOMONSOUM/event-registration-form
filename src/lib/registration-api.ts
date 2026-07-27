export type DeliveryMethod = "download" | "telegram" | "email";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export type RegistrationPayload = {
  fullNameKm: string;
  fullNameEn: string;
  gender?: Gender;
  title?: string;
  position: string;
  organization: string;
  phoneNumber: string;
  email?: string;
  deliveryMethod?: DeliveryMethod;
  profileImageUrl?: string;
};

export type RegistrationResult = {
  id: string;
  eventId?: string;
  placeId?: string | null;
  fullNameEn: string;
  fullNameKm?: string | null;
  gender?: Gender | null;
  title?: string | null;
  position?: string | null;
  organization?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  profileImageUrl?: string | null;
  participantSource?: string | null;
  checkInCode?: string | null;
  qrDeliveryMethod?: DeliveryMethod | string | null;
  qrDeliveryStatus?: string | null;
  qrImage?: string | null;
  cardImage?: string | null;
  cardImageUrl?: string | null;
  delivery?: {
    method?: DeliveryMethod | string;
    downloadUrl?: string | null;
    telegramUrl?: string | null;
    emailSent?: boolean;
  } | null;
  createdAt?: string;
  updatedAt?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string | string[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://uat-api-mems.moc.gov.kh/api/v1";
const REGISTER_ENDPOINT_PATTERN = /\/attendance\/qr\/([^/]+)\/register\/?$/;

export function getConfiguredQrCode() {
  const endpointMatch = API_BASE_URL.match(REGISTER_ENDPOINT_PATTERN);
  return endpointMatch?.[1]
    ? decodeURIComponent(endpointMatch[1])
    : (process.env.NEXT_PUBLIC_DEFAULT_QR_CODE ?? "");
}

export function getRegistrationEndpoint(qrCode: string) {
  const trimmedApiUrl = API_BASE_URL.replace(/\/$/, "");

  if (REGISTER_ENDPOINT_PATTERN.test(trimmedApiUrl)) {
    return trimmedApiUrl;
  }

  return `${trimmedApiUrl}/attendance/qr/${encodeURIComponent(
    qrCode,
  )}/register`;
}

export async function registerAttendee(
  qrCode: string,
  payload: RegistrationPayload,
) {
  const response = await fetch(getRegistrationEndpoint(qrCode), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanPayload(payload)),
  });

  const text = await response.text();
  const body = text
    ? (JSON.parse(text) as ApiEnvelope<RegistrationResult>)
    : null;

  if (!response.ok) {
    const message = body?.message;
    throw new Error(
      Array.isArray(message)
        ? message.join(", ")
        : message || `Registration failed with HTTP ${response.status}`,
    );
  }

  if (!body?.data) {
    throw new Error("The API response did not include registration data.");
  }

  return body.data;
}

function cleanPayload(payload: RegistrationPayload) {
  return {
    fullNameKm: payload.fullNameKm.trim(),
    fullNameEn: payload.fullNameEn.trim(),
    gender: payload.gender || undefined,
    title: payload.title?.trim() || undefined,
    position: payload.position.trim(),
    organization: payload.organization.trim(),
    phoneNumber: payload.phoneNumber.trim(),
    email: payload.email?.trim() || undefined,
    deliveryMethod: payload.deliveryMethod || "download",
    profileImageUrl: payload.profileImageUrl?.trim() || undefined,
  };
}
