export type PatientType = "local" | "international";

export type PaymentStatus =
  | "Pending"
  | "Partially Paid"
  | "Fully Paid"
  | "Insurance Covered"
  | "Complimentary";

export interface FollowUp {
  date?: string;
  note?: string;
}

export interface Patient {
  id: string;

  // Personal Information
  name: string;
  phone: string;
  phone2?: string;
  email?: string;

  gender?: string;
  dob?: string;
  nationality?: string;
  country?: string;
  address?: string;

  // Patient Type
  pt: PatientType;

  // Medical
  treat?: string;
  bloodGroup?: string;

  // Payment
  payStatus?: PaymentStatus;
  currency?: string;

  // Registration
  regDate?: string;

  // Follow-ups
  fu1?: FollowUp;
  fu2?: FollowUp;
  fu3?: FollowUp;
  fu4?: FollowUp;

  // Notes
  remarks?: string;
}