import { API_URL } from "@/shared/constants/api";
import { ApiResult, ApiError } from "@/shared/types/api.types";
import { RunCodeDto, RunResult } from "../types/judge.types";

export const judgeApi = {
  run: async (data: RunCodeDto): Promise<ApiResult<RunResult>> => {
    try {
      const res = await fetch(`${API_URL}/judge/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        const error: ApiError = {
          code: json.code || "RUN_CODE_ERROR",
          message: json.message || "Failed to run code",
          details: json.details,
          fieldErrors: json.fieldErrors,
        };
        return { success: false, error };
      }

      return { success: true, data: json };
    } catch (error) {
      const apiError: ApiError = {
        code: "NETWORK_ERROR",
        message:
          error instanceof Error ? error.message : "Network error occurred",
      };
      return { success: false, error: apiError };
    }
  },

  submit: async (data: RunCodeDto): Promise<ApiResult<RunResult>> => {
    try {
      const res = await fetch(`${API_URL}/judge/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        const error: ApiError = {
          code: json.code || "SUBMIT_CODE_ERROR",
          message: json.message || "Failed to submit code",
          details: json.details,
          fieldErrors: json.fieldErrors,
        };
        return { success: false, error };
      }

      return { success: true, data: json };
    } catch (error) {
      const apiError: ApiError = {
        code: "NETWORK_ERROR",
        message:
          error instanceof Error ? error.message : "Network error occurred",
      };
      return { success: false, error: apiError };
    }
  },
};
