import { z } from "zod";

type FieldErrors = Record<string, string[] | undefined>;

// Thrown anywhere inside a handler and turned into a JSON error response.
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors?: FieldErrors,
  ) {
    super(message);
  }
}

export type ApiErrorBody = { error: string; fieldErrors?: FieldErrors };

// Wraps a route handler so every failure has the same `{ error, fieldErrors? }` shape.
export function withApiErrors<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ApiError) {
        const body: ApiErrorBody = { error: error.message };
        if (error.fieldErrors) body.fieldErrors = error.fieldErrors;
        return Response.json(body, { status: error.status });
      }
      console.error("Unhandled API error:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}

export function parseWith<T extends z.ZodType>(
  schema: T,
  input: unknown,
  message = "Invalid input",
): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ApiError(400, message, z.flattenError(result.error).fieldErrors);
  }
  return result.data;
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON");
  }
}

export async function parseJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T,
  message?: string,
) {
  return parseWith(schema, await readJsonBody(request), message);
}
