import { API_URL } from "@/shared/constants/api";
import { ApiResult, ApiError } from "@/shared/types/api.types";
import { Paginated, Problem, ProblemDetail } from "../types/problem.types";

export const problemsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    q?: string;
  }): Promise<ApiResult<Paginated<Problem>>> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.q) searchParams.set("q", params.q);

      const qs = searchParams.toString();
      const res = await fetch(`${API_URL}/problems${qs ? `?${qs}` : ""}`, {
        cache: "no-store",
      });
      const json = await res.json();

      if (!res.ok) {
        const error: ApiError = {
          code: json.code || "FETCH_PROBLEMS_ERROR",
          message: json.message || "Failed to fetch problems",
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

  getById: async (id: string): Promise<ApiResult<ProblemDetail>> => {
    try {
      const res = await fetch(`${API_URL}/problems/${id}`, {
        cache: "no-store",
      });
      const json = await res.json();

      if (!res.ok) {
        const error: ApiError = {
          code: json.code || "FETCH_PROBLEM_ERROR",
          message: json.message || "Failed to fetch problem",
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
