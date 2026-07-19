"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { savePatientRecord } from "@/lib/db-actions";
import { normalizePhone } from "@/lib/utils";

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

  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(true);

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

  // Fetch the patient record from your Supabase table on load
  useEffect(() => {
    async function fetchPatient() {
      if (!id) return;

      const { data: p, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !p) {
        setExists(false);
        setLoading(false);
        return;
      }

      setFormData({
        name: p.name || "",
        phone: p.phone || "",
        pt: p.pt || "local",
        gender: p.gender || "Female",
        dob: p.dob || "",
        bloodType: p.blood_type || "Unknown",
        nationality: p.nationality || "",
        phone2: p.phone2 || "",
        email: p.email || "",
        language: p.language || "",
        address: p.address || "",
        ecName: p.ec_name || "",
        ecPhone: p.ec_phone || "",
        passport: p.passport || "",
        country: p.country || "",
        visa: p.visa || "",
        arrivalDate: p.arrival_date || "",
        departureDate: p.departure_date || "",
        hotel: p.hotel || "",
        referrer: p.referrer || "",
        interpreter: p.interpreter || "No",
        treat: p.treat || "",
        treatPlan: p.treat_plan || "",
        refSrc: p.ref_src || "Self-referred",
        conditions: p.conditions || "",
        surgeries: p.surgeries || "",
        medications: p.medications || "",
        allergies: p.allergies || "",
        familyHx: p.family_hx || "",
        obsHx: p.obs_hx || "",
        labRem: p.lab_rem || "",
        labDate: p.lab_date || "",
        labPend: p.lab_pend || "",
        payStatus: p.pay_status || "Pending",
        currency: p.currency || "ETB",
        totalAmt: p.total_amt?.toString() || "",
        paidAmt: p.paid_amt?.toString() || "",
        payMethod: p.pay_method || "",
        insurance: p.insurance || "",
        payRem: p.pay_rem || "",
        regDate: p.reg_date ? p.reg_date.split("T")[0] : "",
      });

      setFollowups([
        { date: p.fu1?.date || "", note: p.fu1?.note || "" },
        { date: p.fu2?.date || "", note: p.fu2?.note || "" },
        { date: p.fu3?.date || "", note: p.fu3?.note || "" },
        { date: p.fu4?.date || "", note: p.fu4?.note || "" },
      ]);

      setLoading(false);
    }

    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="card">
        <div className="card-title">Loading Patient Profile...</div>
      </div>
    );
  }

  if (!exists) {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawPhone = formData.phone.trim();
    if (!formData.name.trim() || !rawPhone) {
      alert("⚠️ Patient name and phone number are required.");
      return;
    }

    // Normalize the user's input digits to prepare for checking
    const normalizedInput = normalizePhone(rawPhone);

    // 1. Fetch phone numbers belonging to all OTHER patient profiles
    const { data: records, error: phoneCheckError } = await supabase
      .from("patients")
      .select("id, phone")
      .neq("id", id); // Exclude the current record from validation checks[cite: 4]

    if (phoneCheckError) {
      alert(`⚠️ Error checking phone uniqueness: ${phoneCheckError.message}`);
      return;
    }

    // 2. Validate using the normalization rules to catch matching variations (+251... vs 0...)
    const isDuplicate = records?.some((record) => {
      if (!record.phone) return false;
      return normalizePhone(record.phone) === normalizedInput;
    });

    if (isDuplicate) {
      alert(
        "⚠️ This phone number is already in use by another patient profile under an alternate format structure."
      );
      return;
    }

    // 3. Proceed with saving the records if the fields are valid
    const { error } = await savePatientRecord(id, formData, followups);

    if (error) {
      alert(`⚠️ Update Error: ${error.message}`);
    } else {
      alert("✅ Record updated successfully!");
      router.push(`/patients/${id}`);
    }
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
                    {g}
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
                    {b}
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
                    {t}
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
                    {r}
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
                    {s}
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
                    {c}
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
