import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ErrorResponse } from "@/types";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(error: unknown): NextResponse<ErrorResponse> {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation Error",
        message: "Invalid input data",
        details: error.errors.reduce((acc, err) => {
          acc[err.path.join(".")] = err.message;
          return acc;
        }, {} as Record<string, string>),
      },
      { status: 400 }
    );
  }

  // Handle custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.name,
        message: error.message,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  // Handle MongoDB duplicate key errors
  if (error instanceof Error && error.message.includes("E11000")) {
    return NextResponse.json(
      {
        error: "Conflict",
        message: "Resource already exists",
      },
      { status: 409 }
    );
  }

  // Handle generic errors
  console.error("Unhandled error:", error);
  return NextResponse.json(
    {
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    },
    { status: 500 }
  );
}

export function createError(statusCode: number, message: string, details?: Record<string, unknown>): AppError {
  return new AppError(statusCode, message, details);
}

// Common error creators
export const errors = {
  unauthorized: () => createError(401, "Unauthorized"),
  forbidden: () => createError(403, "Forbidden"),
  notFound: (resource: string = "Resource") => createError(404, `${resource} not found`),
  conflict: (message: string = "Resource already exists") => createError(409, message),
  badRequest: (message: string = "Invalid request") => createError(400, message),
};
