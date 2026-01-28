import { useQuery } from "@tanstack/react-query";
import { problemsApi } from "../api/problems.api";
import { Problem } from "../types/problem.types";
import { ApiResult } from "@/shared/types/api.types";

export const useProblems = () => {
  return useQuery<Problem[], Error>({
    queryKey: ["problems"],
    queryFn: async () => {
      const result = await problemsApi.getAll();
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  });
};
