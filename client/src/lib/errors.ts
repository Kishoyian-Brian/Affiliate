export class ApiError extends Error {
  readonly code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message
  }
  return fallback
}
