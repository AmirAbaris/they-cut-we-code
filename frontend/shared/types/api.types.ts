export type ApiError = {
  code?: string;
  message: string;
  details?: Record<string, unknown>;
  fieldErrors?: Record<string, string[]>;
};

export type ApiResponse<T = unknown> = {
  data?: T;
  error?: ApiError;
  message?: string;
  success: boolean;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };
