import { useQuery } from "@tanstack/react-query";
import { problemsApi } from "../api/problems.api";
import { Paginated, Problem } from "../types/problem.types";

export const useProblems = (params?: {
  page?: number;
  limit?: number;
  q?: string;
}) => {
  return useQuery<Paginated<Problem>, Error>({
    queryKey: [
      "problems",
      params?.page ?? 1,
      params?.limit ?? 20,
      params?.q ?? "",
    ],
    queryFn: async () => {
      const result = await problemsApi.getAll(params);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  });
};
