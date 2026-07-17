"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { patients } from "@/lib/mock-data";

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
];
const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];
const PAY_STATUS = [
  "Pending",
  "Partially Paid",
  "Fully Paid",
  "Insurance Covered",
  "Complimentary",
];
const REFERRAL = [
  "Self-referred",
  "Online / Website",
  "Embassy Referral",
  "Hospital Referral",
  "Travel Agent",
  "Previous Patient",
  "NGO / Aid Organization",
  "Other",
];
const GENDERS = ["Female", "Male", "Other", "Prefer not to say"];
const CURRENCIES = ["ETB", "USD", "EUR", "GBP", "AED", "SAR", "Other"];

export default function EditPatientForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // Locate current record
  const existingPatient = patients.find((p) => p.id === id);

  // Form States linked to original schema keys
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pt: "local",
    gender: "Female",
    dob: "",
    bloodType: "Unknown",
    nationality: "",
    phone2: "",
    email: "",
    language: "",
    address: "",
    ecName: "",
    ecPhone: "",
    passport: "",
    country: "",
    visa: "",
    arrivalDate: "",
    departureDate: "",
    hotel: "",
    referrer: "",
    interpreter: "No",
    treat: "",
    treatPlan: "",
    refSrc: "Self-referred",
    conditions: "",
    surgeries: "",
    medications: "",
    allergies: "",
    familyHx: "",
    obsHx: "",
    labRem: "",
    labDate: "",
    labPend: "",
    payStatus: "Pending",
    currency: "ETB",
    totalAmt: "",
    paidAmt: "",
    payMethod: "",
    insurance: "",
    payRem: "",
    regDate: "",
  });

  const [followups, setFollowups] = useState([
    { date: "", note: "" },
    { date: "", note: "" },
    { date: "", note: "" },
    { date: "", note: "" },
  ]);

  useEffect(() => {
    if (existingPatient) {
      setFormData({
        name: existingPatient.name || "",
        phone: existingPatient.phone || "",
        pt: existingPatient.pt || "local",
        gender: existingPatient.gender || "Female",
        dob: existingPatient.dob || "",
        bloodType: existingPatient.bloodType || "Unknown",
        nationality: existingPatient.nationality || "",
        phone2: existingPatient.phone2 || "",
        email: existingPatient.email || "",
        language: existingPatient.language || "",
        address: existingPatient.address || "",
        ecName: existingPatient.ecName || "",
        ecPhone: existingPatient.ecPhone || "",
        passport: existingPatient.passport || "",
        country: existingPatient.country || "",
        visa: existingPatient.visa || "",
        arrivalDate: existingPatient.arrivalDate || "",
        departureDate: existingPatient.departureDate || "",
        hotel: existingPatient.hotel || "",
        referrer: existingPatient.referrer || "",
        interpreter: existingPatient.interpreter || "No",
        treat: existingPatient.treat || "",
        treatPlan: existingPatient.treatPlan || "",
        refSrc: existingPatient.refSrc || "Self-referred",
        conditions: existingPatient.conditions || "",
        surgeries: existingPatient.surgeries || "",
        medications: existingPatient.medications || "",
        allergies: existingPatient.allergies || "",
        familyHx: existingPatient.familyHx || "",
        obsHx: existingPatient.obsHx || "",
        labRem: existingPatient.labRem || "",
        labDate: existingPatient.labDate || "",
        labPend: existingPatient.labPend || "",
        payStatus: existingPatient.payStatus || "Pending",
        currency: existingPatient.currency || "ETB",
        totalAmt: existingPatient.totalAmt || "",
        paidAmt: existingPatient.paidAmt || "",
        payMethod: existingPatient.payMethod || "",
        insurance: existingPatient.insurance || "",
        payRem: existingPatient.payRem || "",
        regDate: existingPatient.regDate
          ? existingPatient.regDate.split("T")[0]
          : "",
      });

      setFollowups([
        {
          date: existingPatient.fu1?.date || "",
          note: existingPatient.fu1?.note || "",
        },
        {
          date: existingPatient.fu2?.date || "",
          note: existingPatient.fu2?.note || "",
        },
        {
          date: existingPatient.fu3?.date || "",
          note: existingPatient.fu3?.note || "",
        },
        {
          date: existingPatient.fu4?.date || "",
          note: existingPatient.fu4?.note || "",
        },
      ]);
    }
  }, [existingPatient]);

  if (!existingPatient) {
    return (
      <div className="card">
        <div className="card-title">Patient Not Found</div>
        <div className="no-results">
          No patient record matches this identifier.
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFuChange = (
    index: number,
    field: "date" | "note",
    value: string
  ) => {
    setFollowups((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("⚠️ Patient name and phone number are required.");
      return;
    }

    const updatedRecord = {
      ...existingPatient,
      ...formData,
      fu1: followups[0],
      fu2: followups[1],
      fu3: followups[2],
      fu4: followups[3],
      updatedDate: new Date().toISOString(),
    };

    console.log("Saving dynamic record pipeline update:", updatedRecord);
    // Persist changes to your database or context cache wrapper here.
    alert("✅ Record updated!");
    router.push(`/patients/${id}`);
  };

  return (
    <div className="card">
      <div className="card-title">✏️ Edit Patient Record</div>
      <form onSubmit={handleSave}>
        {/* Patient Type Selectors */}
        <div className="form-section">
          <div className="fst">Patient Type</div>
          <div className="type-sel">
            <div
              className={`type-btn ${
                formData.pt === "local" ? "sel-local" : ""
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, pt: "local" }))}
            >
              🏠 Local Patient
              <br />
              <span style={{ fontSize: "9px", opacity: 0.7, fontWeight: 400 }}>
                Ethiopian Resident
              </span>
            </div>
            <div
              className={`type-btn ${
                formData.pt === "international" ? "sel-intl" : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, pt: "international" }))
              }
            >
              ✈️ International Patient
              <br />
              <span style={{ fontSize: "9px", opacity: 0.7, fontWeight: 400 }}>
                Foreign National / Medical Tourist
              </span>
            </div>
          </div>
        </div>

        {/* Demographics Information */}
        <div className="form-section">
          <div className="fst">Personal Information</div>
          <div className="form-grid">
            <div className="fg full">
              <label>
                Full Name <span className="req">*</span>
              </label>
              <input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full legal name"
              />
            </div>
            <div className="fg">
              <label>Gender</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {" "}
                    {g}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label>Date of Birth</label>
              <input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label>Blood Type</label>
              <select
                id="bloodType"
                value={formData.bloodType}
                onChange={handleInputChange}
              >
                {BLOOD.map((b) => (
                  <option key={b} value={b}>
                    {" "}
                    {b}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label>Nationality</label>
              <input
                id="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="e.g. Ethiopian"
              />
            </div>
            <div className="fg">
              <label>
                Phone Number <span className="req">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label>Alternate Phone</label>
              <input
                id="phone2"
                type="tel"
                value={formData.phone2}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label>Email Address</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label>Preferred Language</label>
              <input
                id="language"
                value={formData.language}
                onChange={handleInputChange}
                placeholder="e.g. Amharic, English"
              />
            </div>
            <div className="fg full">
              <label>Home Address / Hotel</label>
              <input
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="City, Country / Hotel name"
              />
            </div>
            <div className="fg">
              <label>Emergency Contact Name</label>
              <input
                id="ecName"
                value={formData.ecName}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label>Emergency Contact Phone</label>
              <input
                id="ecPhone"
                type="tel"
                value={formData.ecPhone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Conditional Cross-Border Medical Tourism Fields */}
        {formData.pt === "international" && (
          <div className="form-section">
            <div className="fst">✈️ Travel & Visa Information</div>
            <div className="form-grid">
              <div className="fg">
                <label>Passport Number</label>
                <input
                  id="passport"
                  value={formData.passport}
                  onChange={handleInputChange}
                />
              </div>
              <div className="fg">
                <label>Country of Origin</label>
                <input
                  id="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div className="fg">
                <label>Visa Type / Status</label>
                <input
                  id="visa"
                  value={formData.visa}
                  onChange={handleInputChange}
                />
              </div>
              <div className="fg">
                <label>Arrival Date</label>
                <input
                  id="arrivalDate"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="fg">
                <label>Planned Departure</label>
                <input
                  id="departureDate"
                  type="date"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="fg">
                <label>Accommodation</label>
                <input
                  id="hotel"
                  value={formData.hotel}
                  onChange={handleInputChange}
                />
              </div>
              <div className="fg">
                <label>Referring Hospital</label>
                <input
                  id="referrer"
                  value={formData.referrer}
                  onChange={handleInputChange}
                />
              </div>
              <div className="fg">
                <label>Interpreter Required?</label>
                <select
                  id="interpreter"
                  value={formData.interpreter}
                  onChange={handleInputChange}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Arranged">Yes — Already Arranged</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Treatment Specifications */}
        <div className="form-section">
          <div className="fst">🏥 Type of Treatment</div>
          <div className="form-grid">
            <div className="fg full">
              <label>
                Treatment Type <span className="req">*</span>
              </label>
              <select
                id="treat"
                value={formData.treat}
                onChange={handleInputChange}
              >
                <option value="">Select treatment...</option>
                {TREATMENTS.map((t) => (
                  <option key={t} value={t}>
                    {" "}
                    {t}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="fg full">
              <label>Treatment Plan Description</label>
              <textarea
                id="treatPlan"
                value={formData.treatPlan}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label>Source of Referral</label>
              <select
                id="refSrc"
                value={formData.refSrc}
                onChange={handleInputChange}
              >
                {REFERRAL.map((r) => (
                  <option key={r} value={r}>
                    {" "}
                    {r}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label>Registration Date</label>
              <input
                id="regDate"
                type="date"
                value={formData.regDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Patient Case Histories */}
        <div className="form-section">
          <div className="fst">📋 Past Medical History</div>
          <div className="form-grid">
            <div className="fg full">
              <label>Chronic Illnesses</label>
              <textarea
                id="conditions"
                value={formData.conditions}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg full">
              <label>Previous Surgeries</label>
              <textarea
                id="surgeries"
                value={formData.surgeries}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg full">
              <label>Current Medications</label>
              <textarea
                id="medications"
                value={formData.medications}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg full">
              <label>Known Allergies</label>
              <textarea
                id="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg full">
              <label>Family Medical History</label>
              <textarea
                id="familyHx"
                value={formData.familyHx}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg full">
              <label>Obstetric History</label>
              <textarea
                id="obsHx"
                value={formData.obsHx}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Labs Block */}
        <div className="form-section">
          <div className="fst">🔬 Lab Investigations</div>
          <div className="form-grid">
            <div className="fg full">
              <label>Lab Investigation Results</label>
              <textarea
                id="labRem"
                value={formData.labRem}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label>Date of Last Lab Tests</label>
              <input
                id="labDate"
                type="date"
                value={formData.labDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label>Pending Investigations</label>
              <input
                id="labPend"
                value={formData.labPend}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Chronological Followup Subgrid entries */}
        <div className="form-section">
          <div className="fst">📅 Follow-up Schedule (4 Visits)</div>
          <div className="fu-grid">
            {followups.map((fu, i) => (
              <div key={i} className="fu-item">
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    color: "var(--brand)",
                    marginBottom: "6px",
                  }}
                >
                  Follow-up {i + 1}
                </div>
                <div className="fg" style={{ marginBottom: "5px" }}>
                  <label>Date</label>
                  <input
                    type="date"
                    value={fu.date}
                    onChange={(e) => handleFuChange(i, "date", e.target.value)}
                  />
                </div>
                <div className="fg">
                  <label>Remarks</label>
                  <input
                    placeholder="Purpose..."
                    value={fu.note}
                    onChange={(e) => handleFuChange(i, "note", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Accounting Ledgers */}
        <div className="form-section">
          <div className="fst">💳 Payment Information</div>
          <div className="form-grid">
            <div className="fg">
              <label>Payment Status</label>
              <select
                id="payStatus"
                value={formData.payStatus}
                onChange={handleInputChange}
              >
                {PAY_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {" "}
                    {s}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label>Currency</label>
              <select
                id="currency"
                value={formData.currency}
                onChange={handleInputChange}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {" "}
                    {c}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label>Total Amount</label>
              <input
                id="totalAmt"
                type="number"
                value={formData.totalAmt}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label>Amount Paid</label>
              <input
                id="paidAmt"
                type="number"
                value={formData.paidAmt}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg">
              <label>Payment Method</label>
              <input
                id="payMethod"
                value={formData.payMethod}
                onChange={handleInputChange}
                placeholder="Cash, Bank Transfer"
              />
            </div>
            <div className="fg">
              <label>Insurance Provider</label>
              <input
                id="insurance"
                value={formData.insurance}
                onChange={handleInputChange}
              />
            </div>
            <div className="fg full">
              <label>Payment Remarks</label>
              <textarea
                id="payRem"
                value={formData.payRem}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="action-bar">
          <button type="submit" className="btn btn-primary">
            💾 Update Record
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push(`/patients/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
