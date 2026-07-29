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
  latitude?: number;
  longitude?: number;
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
  checkInCode?: string | null;
  qrDeliveryMethod?: DeliveryMethod | string | null;
  qrDeliveryStatus?: string | null;
  qrImage?: string | null;
  delivery?: {
    method?: DeliveryMethod | string;
    telegramUrl?: string | null;
    emailSent?: boolean;
  } | null;
};
