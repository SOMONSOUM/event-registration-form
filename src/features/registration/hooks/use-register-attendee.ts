import { useMutation } from "@tanstack/react-query";
import { registerAttendeeAction } from "../actions";

export const useRegisterAttendee = () => {
  return useMutation({
    mutationFn: registerAttendeeAction,
  });
};
