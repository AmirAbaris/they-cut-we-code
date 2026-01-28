import { ApiResult, ApiError } from "../types/api.types";

export function getErrorMessage(result: ApiResult<unknown>): string {
  return result.success ? "" : result.error.message;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  );
}

export function formatApiError(error: ApiError): string {
  let message = error.message;

  if (error.fieldErrors) {
    const fieldMessages = Object.entries(error.fieldErrors)
      .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
      .join("; ");
    if (fieldMessages) {
      message += ` (${fieldMessages})`;
    }
  }

  return message;
}
