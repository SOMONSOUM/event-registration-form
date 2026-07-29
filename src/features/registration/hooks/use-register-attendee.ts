import { useMutation } from "@tanstack/react-query";
import { registerAttendeeAction } from "../actions";

export const useRegisterAttendee = () => {
  return useMutation({
    mutationFn: async (...args: Parameters<typeof registerAttendeeAction>) => {
      const result = await registerAttendeeAction(...args);
      if (result.error || !result.data) {
        throw new Error(result.error ?? "Unable to register attendee.");
      }
      return result.data;
    },
  });
};
