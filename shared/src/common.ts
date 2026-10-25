export type UserRole = "user" | "admin";
export type DiscountType = "percentage" | "fixed";

/** MySQL DECIMAL values are sometimes numbers and sometimes strings in JSON. */
export type DecimalValue = number | string;

/** MySQL BOOLEAN often arrives as 0 or 1. */
export type SqlBoolean = boolean | 0 | 1;

export interface ApiMessage {
  message: string;
}

export interface ValidationIssue {
  msg: string;
  param?: string;
  path?: string;
  location?: string;
}

export interface ApiValidationError {
  errors: ValidationIssue[];
}

export type StatsPeriod = "today" | "week" | "month" | "year" | "all";
