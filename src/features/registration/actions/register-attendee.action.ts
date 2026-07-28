"use server";

import { runAction } from "@/lib/action/action-error";
import * as registrationService from "../services/registration.service";
import type { RegistrationPayload } from "../types/registration.type";

export const registerAttendeeAction = async (data: RegistrationPayload) =>
  runAction(() => registrationService.registerAttendee(data));
