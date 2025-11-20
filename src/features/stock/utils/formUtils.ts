export const getFieldError = (
  errors: Record<string, { message?: string } | undefined>,
  field: string,
): { error: boolean; message?: string } => {
  const error = errors[field]
  return {
    error: !!error,
    message: error?.message,
  }
}
