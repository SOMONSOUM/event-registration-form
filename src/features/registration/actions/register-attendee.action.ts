"use server";

import { apiErrorMessage } from "@/lib/api/api-client";
import * as registrationService from "../services/registration.service";
import type {
  RegistrationPayload,
  RegistrationResult,
} from "../types/registration.type";

type RegisterAttendeeActionResult = {
  data: RegistrationResult | null;
  error: string | null;
};

export const registerAttendeeAction = async (
  data: RegistrationPayload,
): Promise<RegisterAttendeeActionResult> => {
  try {
    return {
      data: await registrationService.registerAttendee(data),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: apiErrorMessage(error, "Unable to register attendee."),
    };
  }
};
