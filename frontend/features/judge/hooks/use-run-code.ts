import { useMutation } from "@tanstack/react-query";
import { judgeApi } from "../api/judge.api";
import { RunCodeDto, RunResult } from "../types/judge.types";
import { ApiResult } from "@/shared/types/api.types";

export const useRunCode = () => {
  return useMutation<ApiResult<RunResult>, never, RunCodeDto>({
    mutationFn: judgeApi.run,
  });
};
