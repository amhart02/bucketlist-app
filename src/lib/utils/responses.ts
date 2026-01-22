import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function createdResponse<T>(data: T): NextResponse<T> {
  return NextResponse.json(data, { status: 201 });
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function transformObjectId(obj: any): any {
  if (!obj) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(transformObjectId);
  }
  
  if (typeof obj === "object") {
    const transformed: any = {};
    for (const key in obj) {
      if (key === "_id") {
        transformed.id = obj[key].toString();
      } else if (key.endsWith("Id") && obj[key]?._id) {
        transformed[key] = obj[key]._id.toString();
      } else if (obj[key] instanceof Date) {
        transformed[key] = obj[key].toISOString();
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        transformed[key] = transformObjectId(obj[key]);
      } else {
        transformed[key] = obj[key];
      }
    }
    return transformed;
  }
  
  return obj;
}

export function filterSensitiveFields<T extends Record<string, any>>(
  obj: T,
  fieldsToRemove: string[] = ["passwordHash", "__v"]
): Partial<T> {
  const filtered = { ...obj };
  fieldsToRemove.forEach((field) => {
    delete filtered[field];
  });
  return filtered;
}
