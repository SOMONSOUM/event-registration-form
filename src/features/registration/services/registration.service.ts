import { apiRequest } from "@/lib/api/api-client";
import {
  type RegistrationPayload,
  type RegistrationResult,
} from "../types/registration.type";

const EVENT_QR_CODE = "ZFtHdvJdrE47DT8k55F8vOaX";
export const registrationEndpointPath = () => {
  return `/attendance/qr/${EVENT_QR_CODE}/register`;
};

export const registerAttendee = async (payload: RegistrationPayload) => {
  return apiRequest<RegistrationResult>({
    method: "POST",
    url: registrationEndpointPath(),
    data: cleanPayload(payload),
  });
};

const cleanPayload = (payload: RegistrationPayload) => {
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
    latitude: payload.latitude,
    longitude: payload.longitude,
  };
};
