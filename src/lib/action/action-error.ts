import { apiErrorMessage } from "@/lib/api/api-client";

const DEFAULT_ACTION_ERROR = "Something went wrong. Please try again.";

export const runAction = async <T>(
  action: () => Promise<T>,
  fallback = DEFAULT_ACTION_ERROR,
): Promise<T> => {
  try {
    return await action();
  } catch (error) {
    throw new Error(apiErrorMessage(error, fallback));
  }
};
