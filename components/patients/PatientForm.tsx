"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { countries } from "@/app/data/countries";

const TREATMENTS = [
  "IVF / Assisted Reproduction",
  "Intrauterine Insemination (IUI)",
  "Egg Freezing / Cryopreservation",
  "Surrogacy Support",
  "Oncology / Cancer Treatment",
  "Cardiac Surgery / Cardiology",
  "Orthopedic Surgery",
  "Neurosurgery / Neurology",
  "Cosmetic & Plastic Surgery",
  "Eye Surgery (LASIK / Cataract)",
  "Dental & Maxillofacial",
  "General Surgery",
  "Stem Cell Therapy",
  "Laparoscopic Surgery",
  "Endoscopy / Gastroenterology",
  "Fertility Preservation",
  "Gynaecological Surgery",
  "Urology",
  "Health Checkup Package",
  "Rehabilitation",
  "Other",
] as const;

const BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
] as const;
const PAY_STATUS = [
  "Pending",
  "Partially Paid",
  "Fully Paid",
  "Insurance Covered",
  "Complimentary",
] as const;
const REFERRALS = [
  "Self-referred",
  "Online / Website",
  "Embassy Referral",
  "Hospital Referral",
  "Travel Agent",
  "Previous Patient",
  "NGO / Aid Organization",
  "Other",
] as const;
const GENDERS = ["Female", "Male", "Other", "Prefer not to say"] as const;
const CURRENCIES = ["ETB", "USD", "EUR", "GBP", "AED", "SAR", "Other"] as const;

const patientFormSchema = z
  .object({
    pt: z.enum(["local", "international"]),
    name: z.string().default(""),
    gender: z.string().default("Female"),
    dob: z.string().default(""),
    bloodType: z.string().default("Unknown"),

    nationality: z.string().default(""),
    customNationality: z.string().default(""),

    phone: z.string().min(1, "Phone number is required"),
    phone2: z.string().default(""),

    email: z
      .string()
      .or(z.literal(""))
      .transform((v) => (v === "" ? undefined : v))
      .pipe(z.string().email("Enter a valid email address").optional()),

    language: z.string().default(""),
    address: z.string().default(""),
    ecName: z.string().default(""),
    ecPhone: z.string().default(""),

    passport: z.string().default(""),
    country: z.string().default(""),
    customCountry: z.string().default(""),
    visa: z.string().default(""),
    arrivalDate: z.string().default(""),
    departureDate: z.string().default(""),
    hotel: z.string().default(""),
    referrer: z.string().default(""),
    interpreter: z.string().default("No"),

    treat: z.string().default(""),
    treatPlan: z.string().default(""),
    refSrc: z.string().default("Self-referred"),
    regDate: z.string().default(() => new Date().toISOString().split("T")[0]),

    conditions: z.string().default(""),
    surgeries: z.string().default(""),
    medications: z.string().default(""),
    allergies: z.string().default(""),
    familyHx: z.string().default(""),
    obsHx: z.string().default(""),

    labRem: z.string().default(""),
    labDate: z.string().default(""),
    labPend: z.string().default(""),

    fu1: z.object({
      date: z.string().default(""),
      note: z.string().default(""),
    }),
    fu2: z.object({
      date: z.string().default(""),
      note: z.string().default(""),
    }),
    fu3: z.object({
      date: z.string().default(""),
      note: z.string().default(""),
    }),
    fu4: z.object({
      date: z.string().default(""),
      note: z.string().default(""),
    }),

    payStatus: z.string().default("Pending"),
    currency: z.string().default("ETB"),
    totalAmt: z.string().default(""),
    paidAmt: z.string().default(""),
    payMethod: z.string().default(""),
    insurance: z.string().default(""),
    payRem: z.string().default(""),
  })
  .superRefine((data, ctx) => {
    const ethiopianPhoneRegex = /^(09\d{8}|\+2519\d{8})$/;
    // Generic international phone regex: Allows optional +, country code, and 1 to 14 standard digits
    const internationalPhoneRegex = /^\+?[1-9]\d{1,14}$/;

    // 1. Primary Phone Validation
    const cleanPhone = data.phone.replace(/[\s\-]/g, "");
    if (data.pt === "local") {
      if (!ethiopianPhoneRegex.test(cleanPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message:
            "Enter a valid Ethiopian phone number (09xxxxxxxx or +2519xxxxxxxx)",
        });
      }
    } else {
      if (!internationalPhoneRegex.test(cleanPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message:
            "Enter a valid international phone number (e.g., +14155552671)",
        });
      }
    }

    // 2. Emergency Phone Validation (Optional, validations apply if field contains content)
    if (data.ecPhone && data.ecPhone.trim() !== "") {
      const cleanEcPhone = data.ecPhone.replace(/[\s\-]/g, "");
      if (data.pt === "local") {
        if (!ethiopianPhoneRegex.test(cleanEcPhone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ecPhone"],
            message:
              "Enter a valid Ethiopian phone number (09xxxxxxxx or +2519xxxxxxxx)",
          });
        }
      } else {
        if (!internationalPhoneRegex.test(cleanEcPhone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ecPhone"],
            message:
              "Enter a valid international phone number (e.g., +14155552671)",
          });
        }
      }
    }
  });

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
  initialData?: Partial<PatientFormValues>;
  id?: string;
}

export default function PatientForm({ initialData, id }: PatientFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      pt: "local",
      gender: "Female",
      bloodType: "Unknown",
      refSrc: "Self-referred",
      interpreter: "No",
      payStatus: "Pending",
      currency: "ETB",
      nationality: "Ethiopian",
      regDate: new Date().toISOString().split("T")[0],
      ...initialData,
    },
  });

  const selectedPatientType = watch("pt");
  const selectedNationality = watch("nationality");
  const selectedCountry = watch("country");

  const selectOptions = [...countries, { value: "OTHER", label: "Other" }];

  const handlePatientTypeChange = (type: "local" | "international") => {
    setValue("pt", type);
    if (type === "local") {
      setValue("nationality", "Ethiopian");
      setValue("customNationality", "");
    } else {
      setValue("nationality", "");
    }
  };

  const onSubmit = (data: PatientFormValues) => {
    const finalSubmission = {
      ...data,
      nationality:
        data.nationality === "Other"
          ? data.customNationality
          : data.nationality,
      country: data.country === "Other" ? data.customCountry : data.country,
    };

    console.log("Submitting fully validated configuration:", finalSubmission);
    alert(
      id
        ? "Patient record updated successfully!"
        : "Patient registered successfully!"
    );
    router.push("/dashboard");
  };

  // Shared conditional configuration for inputs
  const phonePlaceholder =
    selectedPatientType === "local"
      ? "09xxxxxxxx or +2519xxxxxxxx"
      : "+14155552671";

  return (
    <form className="card" onSubmit={handleSubmit(onSubmit)}>
      <div className="card-title">
        {id ? "✏️ Edit Patient Record" : "➕ Register New Patient"}
      </div>

      {/* Patient Type Selectors */}
      <div className="form-section">
        <div className="fst">Patient Type</div>
        <div className="type-sel">
          <div
            className={`type-btn ${
              selectedPatientType === "local" ? "sel-local" : ""
            }`}
            onClick={() => handlePatientTypeChange("local")}
            style={{ cursor: "pointer" }}
          >
            🏠 Local Patient
            <br />
            <span style={{ fontSize: "9px", opacity: 0.7, fontWeight: 400 }}>
              Ethiopian Resident
            </span>
          </div>
          <div
            className={`type-btn ${
              selectedPatientType === "international" ? "sel-intl" : ""
            }`}
            onClick={() => handlePatientTypeChange("international")}
            style={{ cursor: "pointer" }}
          >
            ✈️ International Patient
            <br />
            <span style={{ fontSize: "9px", opacity: 0.7, fontWeight: 400 }}>
              Foreign National / Medical Tourist
            </span>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="form-section">
        <div className="fst">Personal Information</div>
        <div className="form-grid">
          <div className="fg full">
            <label>
              Full Name <span className="req">*</span>
            </label>
            <input {...register("name")} placeholder="Full legal name" />
          </div>

          <div className="fg">
            <label>Gender</label>
            <select {...register("gender")}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="fg">
            <label>Date of Birth</label>
            <input type="date" {...register("dob")} />
          </div>

          <div className="fg">
            <label>Blood Type</label>
            <select {...register("bloodType")}>
              {BLOOD_TYPES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Nationality Select */}
          <div className="fg">
            <label>Nationality</label>
            <Select
              className="react-select-container"
              classNamePrefix="react-select"
              instanceId="nationality-select"
              options={selectOptions}
              placeholder="Search nationality..."
              isSearchable
              value={
                selectOptions.find((c) => c.label === selectedNationality) ||
                null
              }
              onChange={(selected: any) => {
                setValue("nationality", selected?.label || "");
              }}
            />
            {selectedNationality === "Other" && (
              <input
                style={{ marginTop: "6px" }}
                placeholder="Enter nationality name"
                {...register("customNationality")}
              />
            )}
          </div>

          <div className="fg">
            <label>
              Phone Number <span className="req">*</span>
            </label>
            <input
              type="tel"
              {...register("phone")}
              placeholder={phonePlaceholder}
            />
            {errors.phone && (
              <span
                style={{
                  color: "var(--red)",
                  fontSize: "10px",
                  marginTop: "2px",
                }}
              >
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="fg">
            <label>Alternate Phone</label>
            <input
              type="tel"
              {...register("ecPhone")}
              placeholder={phonePlaceholder}
            />
            {errors.ecPhone && (
              <span
                style={{
                  color: "var(--red)",
                  fontSize: "10px",
                  marginTop: "2px",
                }}
              >
                {errors.ecPhone.message}
              </span>
            )}
          </div>

          <div className="fg">
            <label>Email Address</label>
            <input
              type="email"
              {...register("email")}
              placeholder="example@domain.com"
            />
            {errors.email && (
              <span
                style={{
                  color: "var(--red)",
                  fontSize: "10px",
                  marginTop: "2px",
                }}
              >
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="fg">
            <label>Preferred Language</label>
            <input
              {...register("language")}
              placeholder="e.g. Amharic, English"
            />
          </div>

          <div className="fg full">
            <label>Home Address / Hotel</label>
            <input
              {...register("address")}
              placeholder="City, Country / Hotel name"
            />
          </div>

          <div className="fg">
            <label>Emergency Contact Name</label>
            <input {...register("ecName")} placeholder="Full name" />
          </div>

          <div className="fg">
            <label>Emergency Contact Phone</label>
            <input
              type="tel"
              {...register("ecPhone")}
              placeholder={phonePlaceholder}
            />
            {errors.ecPhone && (
              <span
                style={{
                  color: "var(--red)",
                  fontSize: "10px",
                  marginTop: "2px",
                }}
              >
                {errors.ecPhone.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Travel & Visa Information */}
      <div
        className="form-section"
        style={{
          display: selectedPatientType === "international" ? "" : "none",
        }}
      >
        <div className="fst">✈️ Travel & Visa Information</div>
        <div className="form-grid">
          <div className="fg">
            <label>Passport Number</label>
            <input {...register("passport")} placeholder="Passport number" />
          </div>

          {/* Dynamic Country Select */}
          <div className="fg">
            <label>Country of Origin</label>
            <Select
              className="react-select-container"
              classNamePrefix="react-select"
              instanceId="country-select"
              options={selectOptions}
              placeholder="Search country..."
              isSearchable
              value={
                selectOptions.find((c) => c.label === selectedCountry) || null
              }
              onChange={(selected: any) => {
                setValue("country", selected?.label || "");
              }}
            />
            {selectedCountry === "Other" && (
              <input
                style={{ marginTop: "6px" }}
                placeholder="Enter country name"
                {...register("customCountry")}
              />
            )}
          </div>

          <div className="fg">
            <label>Visa Type / Status</label>
            <input {...register("visa")} placeholder="e.g. Medical Visa" />
          </div>
          <div className="fg">
            <label>Arrival Date in Ethiopia</label>
            <input type="date" {...register("arrivalDate")} />
          </div>
          <div className="fg">
            <label>Planned Departure Date</label>
            <input type="date" {...register("departureDate")} />
          </div>
          <div className="fg">
            <label>Accommodation / Hotel</label>
            <input {...register("hotel")} placeholder="Hotel name" />
          </div>
          <div className="fg">
            <label>Referring Hospital / Agent</label>
            <input {...register("referrer")} placeholder="Institution name" />
          </div>
          <div className="fg">
            <label>Interpreter Required?</label>
            <select {...register("interpreter")}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Arranged">Yes — Already Arranged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Type of Treatment */}
      <div className="form-section">
        <div className="fst">🏥 Type of Treatment</div>
        <div className="form-grid">
          <div className="fg full">
            <label>
              Treatment Type <span className="req">*</span>
            </label>
            <select {...register("treat")}>
              <option value="">Select treatment...</option>
              {TREATMENTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="fg full">
            <label>Treatment Plan / Package Description</label>
            <textarea
              {...register("treatPlan")}
              placeholder="Describe the treatment plan, procedures..."
            />
          </div>
          <div className="fg">
            <label>Source of Referral</label>
            <select {...register("refSrc")}>
              {REFERRALS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label>Registration Date</label>
            <input type="date" {...register("regDate")} />
          </div>
        </div>
      </div>

      {/* Past Medical History */}
      <div className="form-section">
        <div className="fst">📋 Past Medical History</div>
        <div className="form-grid">
          <div className="fg full">
            <label>Previous Medical Conditions / Chronic Illnesses</label>
            <textarea
              {...register("conditions")}
              placeholder="e.g. Hypertension, Diabetes, PCOS..."
            />
          </div>
          <div className="fg full">
            <label>Previous Surgeries / Procedures</label>
            <textarea
              {...register("surgeries")}
              placeholder="e.g. Appendectomy 2018..."
            />
          </div>
          <div className="fg full">
            <label>Current Medications</label>
            <textarea
              {...register("medications")}
              placeholder="List current medications..."
            />
          </div>
          <div className="fg full">
            <label>Known Allergies</label>
            <textarea
              {...register("allergies")}
              placeholder="List all known allergies..."
            />
          </div>
          <div className="fg full">
            <label>Family Medical History</label>
            <textarea
              {...register("familyHx")}
              placeholder="Relevant family history..."
            />
          </div>
          <div className="fg full">
            <label>Obstetric / Reproductive History (if applicable)</label>
            <textarea
              {...register("obsHx")}
              placeholder="e.g. G2P1A1, previous IVF attempts..."
            />
          </div>
        </div>
      </div>

      {/* Lab Investigations */}
      <div className="form-section">
        <div className="fst">🔬 Lab Investigations</div>
        <div className="form-grid">
          <div className="fg full">
            <label>Lab Investigation Results & Remarks</label>
            <textarea
              {...register("labRem")}
              style={{ minHeight: "70px" }}
              placeholder="e.g. AMH: 1.2 ng/mL..."
            />
          </div>
          <div className="fg">
            <label>Date of Last Lab Tests</label>
            <input type="date" {...register("labDate")} />
          </div>
          <div className="fg">
            <label>Pending Investigations</label>
            <input
              {...register("labPend")}
              placeholder="e.g. Awaiting MRI..."
            />
          </div>
        </div>
      </div>

      {/* Follow-up Schedule */}
      <div className="form-section">
        <div className="fst">📅 Follow-up Schedule (4 Visits)</div>
        <div className="fu-grid">
          {[1, 2, 3, 4].map((i) => (
            <div className="fu-item" key={i}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "var(--brand)",
                  marginBottom: "6px",
                }}
              >
                Follow-up {i}
              </div>
              <div className="fg" style={{ marginBottom: "5px" }}>
                <label>Date</label>
                <input type="date" {...register(`fu${i}.date` as any)} />
              </div>
              <div className="fg">
                <label>Remarks / Purpose</label>
                <input
                  {...register(`fu${i}.note` as any)}
                  placeholder="e.g. Post-transfer check..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Information */}
      <div className="form-section">
        <div className="fst">💳 Payment Information</div>
        <div className="form-grid">
          <div className="fg">
            <label>Payment Status</label>
            <select {...register("payStatus")}>
              {PAY_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label>Currency</label>
            <select {...register("currency")}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label>Total Amount</label>
            <input
              type="number"
              step="0.01"
              {...register("totalAmt")}
              placeholder="0.00"
            />
          </div>
          <div className="fg">
            <label>Amount Paid</label>
            <input
              type="number"
              step="0.01"
              {...register("paidAmt")}
              placeholder="0.00"
            />
          </div>
          <div className="fg">
            <label>Payment Method</label>
            <input
              {...register("payMethod")}
              placeholder="e.g. Cash, Bank Transfer..."
            />
          </div>
          <div className="fg">
            <label>Insurance Provider</label>
            <input
              {...register("insurance")}
              placeholder="Insurance company (if any)"
            />
          </div>
          <div className="fg full">
            <label>Payment Remarks / Notes</label>
            <textarea
              {...register("payRem")}
              placeholder="Payment notes, receipt numbers..."
            />
          </div>
        </div>
      </div>

      {/* Action Footers */}
      <div className="action-bar">
        <button type="submit" className="btn btn-primary">
          💾 {id ? "Update Record" : "Register Patient"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
