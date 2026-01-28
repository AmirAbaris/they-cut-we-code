import { useQuery } from "@tanstack/react-query";
import { problemsApi } from "../api/problems.api";
import { ProblemDetail } from "../types/problem.types";
import { ApiResult } from "@/shared/types/api.types";

export const useProblem = (id: string) => {
  return useQuery<ProblemDetail, Error>({
    queryKey: ["problems", id],
    queryFn: async () => {
      const result = await problemsApi.getById(id);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    enabled: !!id,
  });
};
