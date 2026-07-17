"use client";

import { useState } from "react";
import { toEthiopian, toGregorian } from "ethiopian-date";
import Select from "react-select";
import { countries } from "@/app/data/countries";
import { addPatient } from "@/lib/patient-store";
import { useRouter } from "next/navigation";

export default function PatientForm() {
  const [patientType, setPatientType] = useState("local");

  const [dateType, setDateType] = useState<"gregorian" | "ethiopian">(
    "gregorian"
  );

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: "Female",
    dob: "",
    email: "",
    nationality: "",
    country: "",
    address: "",
    bloodGroup: "Unknown",
    emergencyContact: "",
    medicalNotes: "",
    treatment: "IVF / Assisted Reproduction",
    referral: "Self-referred",
    paymentStatus: "Pending",
    currency: "ETB",
  });

  const [errors, setErrors] = useState<any>({});
  const [customCountry, setCustomCountry] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // remove error when user starts fixing input
    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let newErrors: any = {};

    // Full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Phone
    const ethiopianPhone = /^(09\d{8}|\+2519\d{8})$/;
    const internationalPhone = /^\+[1-9]\d{7,14}$/;

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (patientType == "local" && !ethiopianPhone.test(formData.phone)) {
      newErrors.phone =
        "Enter a valid Ethiopian phone number (09xxxxxxxx or +2519xxxxxxxx)";
    } else if (
      patientType == "international" &&
      !internationalPhone.test(formData.phone)
    ) {
      newErrors.phone =
        "Enter a valid international phone number starting with + and country code";
    }

    if (
      formData.emergencyContact.trim() &&
      !ethiopianPhone.test(formData.emergencyContact)
    ) {
      newErrors.emergencyContact =
        "Enter a valid Ethiopian phone number (09xxxxxxxx or +2519xxxxxxxx)";
    }

    // Email
    if (formData.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(formData.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    // Date
    if (formData.dob) {
      if (dateType === "ethiopian") {
        const parts = formData.dob.split("-");

        if (parts.length !== 3) {
          newErrors.dob = "Enter Ethiopian date as YYYY-MM-DD";
        }
      } else {
        const selectedDate = new Date(formData.dob);

        if (selectedDate > new Date()) {
          newErrors.dob = "Date of birth cannot be in the future";
        }
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let finalData = {
      ...formData,
      patientType,
    };

    // Convert Ethiopian date to Gregorian before saving
    if (dateType === "ethiopian" && formData.dob) {
      const [year, month, day] = formData.dob.split("-").map(Number);

      const gregorian = toGregorian(year, month, day);

      finalData.dob = `${gregorian.year}-${String(gregorian.month).padStart(
        2,
        "0"
      )}-${String(gregorian.day).padStart(2, "0")}`;
    }

    addPatient(finalData);

    console.log("Patient Data:", finalData);
    alert("Patient registered successfully");
    router.push("/dashboard");
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="card-title">➕ Register New Patient</div>

      {/* Patient Type */}
      <div className="form-section">
        <div className="fst">Patient Type</div>

        <div className="type-sel">
          <button
            type="button"
            className={
              patientType === "local" ? "type-btn sel-local" : "type-btn"
            }
            onClick={() => setPatientType("local")}
          >
            🏠 Local Patient
          </button>

          <button
            type="button"
            className={
              patientType === "international" ? "type-btn sel-intl" : "type-btn"
            }
            onClick={() => setPatientType("international")}
          >
            ✈ International Patient
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="form-section">
        <div className="fst">Personal Information</div>

        <div className="form-grid">
          <div className="fg">
            <label>
              Full Name <span className="req">*</span>
            </label>

            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Patient full name"
            />

            {errors.fullName && (
              <small className="error">{errors.fullName}</small>
            )}
          </div>

          <div className="fg">
            <label>
              Phone Number <span className="req">*</span>
            </label>

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+251..."
            />

            {errors.phone && <small className="error">{errors.phone}</small>}
          </div>

          <div className="fg">
            <label>Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option>Female</option>

              <option>Male</option>

              <option>Other</option>

              <option>Prefer not to say</option>
            </select>
          </div>

          <div className="fg">
            <label>Date of Birth</label>

            <select
              value={dateType}
              onChange={(e) => setDateType(e.target.value as any)}
            >
              <option value="gregorian">Gregorian</option>

              <option value="ethiopian">Ethiopian</option>
            </select>

            <input
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder={dateType === "ethiopian" ? "2018-01-01" : ""}
              type={dateType === "gregorian" ? "date" : "text"}
            />

            {errors.dob && <small className="error">{errors.dob}</small>}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="form-section">
        <div className="fst">Contact Information</div>

        <div className="form-grid">
          <div className="fg">
            <label>Email</label>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />

            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="fg">
            <label>Nationality</label>

            <input
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Nationality"
            />
          </div>

          {/* <div className="fg">
            <label>Country</label>

            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
            />
          </div> */}
          <div className="fg">
            <label>Country</label>

            <Select
              className="react-select-container"
              classNamePrefix={"react-select"}
              instanceId={"country-select"}
              options={countries}
              placeholder="Search country..."
              isSearchable
              value={countries.find((c) => c.label === formData.country)}
              onChange={(selected: any) => {
                setFormData((prev) => ({
                  ...prev,
                  country: selected?.label || "",
                }));
              }}
            />

            {formData.country === "Other" && (
              <input
                placeholder="Enter country name"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
              />
            )}
          </div>

          <div className="fg">
            <label>Address</label>

            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="form-section">
        <div className="fst">Medical Information</div>

        <div className="form-grid">
          <div className="fg">
            <label>Blood Group</label>

            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option>Unknown</option>

              <option>A+</option>

              <option>A-</option>

              <option>B+</option>

              <option>B-</option>

              <option>AB+</option>

              <option>AB-</option>

              <option>O+</option>

              <option>O-</option>
            </select>
          </div>

          <div className="fg">
            <label>Emergency Contact</label>

            <input
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Emergency phone"
            />
            {errors.emergencyContact && (
              <small className="error">{errors.emergencyContact}</small>
            )}
          </div>

          <div className="fg full">
            <label>Medical Notes</label>

            <textarea
              name="medicalNotes"
              value={formData.medicalNotes}
              onChange={handleChange}
              placeholder="Medical history, allergies, notes..."
            />
          </div>
        </div>
      </div>

      {/* Treatment Information */}
      <div className="form-section">
        <div className="fst">Treatment Information</div>

        <div className="form-grid">
          <div className="fg">
            <label>Treatment</label>

            <select
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
            >
              <option>IVF / Assisted Reproduction</option>

              <option>Intrauterine Insemination (IUI)</option>

              <option>Egg Freezing / Cryopreservation</option>

              <option>Cardiac Surgery / Cardiology</option>

              <option>General Surgery</option>

              <option>Other</option>
            </select>
          </div>

          <div className="fg">
            <label>Referral Source</label>

            <select
              name="referral"
              value={formData.referral}
              onChange={handleChange}
            >
              <option>Self-referred</option>

              <option>Online / Website</option>

              <option>Hospital Referral</option>

              <option>Embassy Referral</option>

              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="form-section">
        <div className="fst">Payment Information</div>

        <div className="form-grid">
          <div className="fg">
            <label>Payment Status</label>

            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
            >
              <option>Pending</option>

              <option>Partially Paid</option>

              <option>Fully Paid</option>

              <option>Insurance Covered</option>

              <option>Complimentary</option>
            </select>
          </div>

          <div className="fg">
            <label>Currency</label>

            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            >
              <option>ETB</option>

              <option>USD</option>

              <option>EUR</option>

              <option>GBP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="action-bar">
        <button type="submit" className="btn btn-primary">
          Save Patient
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setFormData({
              fullName: "",
              phone: "",
              gender: "Female",
              dob: "",
              email: "",
              nationality: "",
              country: "",
              address: "",
              bloodGroup: "Unknown",
              emergencyContact: "",
              medicalNotes: "",
              treatment: "IVF / Assisted Reproduction",
              referral: "Self-referred",
              paymentStatus: "Pending",
              currency: "ETB",
            });

            setErrors({});
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
