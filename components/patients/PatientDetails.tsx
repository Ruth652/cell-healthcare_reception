"use client";

import { patients } from "@/lib/mock-data";
import { initials, fmtDate, calcAge } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Helper function to figure out follow-up chronological status labels
function getFuStatus(dateStr: string) {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTime = new Date(todayStr).getTime();
  const fuTime = new Date(dateStr).getTime();
  const oneWeekLaterTime = todayTime + 7 * 24 * 60 * 60 * 1000;

  if (dateStr < todayStr) return "over";
  if (dateStr === todayStr) return "today";
  if (fuTime > todayTime && fuTime <= oneWeekLaterTime) return "soon";
  return "scheduled";
}

export default function PatientDetails({ id }: { id: string }) {
  const router = useRouter();

  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return (
      <div className="card">
        <div className="card-title">Patient Not Found</div>
        <div className="no-results">No patient record exists.</div>
      </div>
    );
  }

  // Row helper mapping exactly to your old template's style structure
  const renderRow = (label: string, value: any, fullWidth = false) => (
    <div className="irow" style={fullWidth ? { gridColumn: "1 / -1" } : {}}>
      <div className="ilabel">{label}</div>
      <div className="ival">{value || "—"}</div>
    </div>
  );

  // Financial parsing variables
  const totalN = Number(patient.totalAmt) || 0;
  const paidN = Number(patient.paidAmt) || 0;
  const balN = totalN - paidN;
  const paidPct =
    totalN > 0 ? Math.min(100, Math.round((paidN / totalN) * 100)) : 0;

  // Determine dynamic lookup badge classes for billing
  const payBadgeClass =
    patient.payStatus === "Fully Paid" ||
    patient.payStatus === "Insurance Covered"
      ? "b-paid"
      : patient.payStatus === "Partially Paid"
      ? "b-partial"
      : "b-pending";

  return (
    <div>
      <button className="back-btn" onClick={() => router.back()}>
        ← Back to All Patients
      </button>

      {/* Header Container */}
      <div className="det-hdr">
        <div className="det-av">{initials(patient.name)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "16px", fontWeight: "800" }}>
            {patient.name}{" "}
            <span
              className={`badge ${
                patient.pt === "international" ? "b-intl" : "b-local"
              }`}
            >
              {patient.pt === "international" ? "✈ INTERNATIONAL" : "🏠 LOCAL"}
            </span>
          </div>
          <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "4px" }}>
            📱 {patient.phone}
            {patient.email && ` · 📧 ${patient.email}`}
          </div>
          <div style={{ fontSize: "10px", opacity: 0.6, marginTop: "3px" }}>
            ID: {patient.id} · Registered:{" "}
            {fmtDate ? fmtDate(patient.regDate) : patient.regDate}
          </div>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => router.push(`/patients/${id}/edit`)}
        >
          ✏️ Edit
        </button>
      </div>

      {/* 1. Medical Treatment card */}
      <div className="card">
        <div className="card-title">🏥 Treatment</div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "800",
            color: "var(--brand-dark)",
            marginBottom: "7px",
          }}
        >
          {patient.treat || "Not specified"}
        </div>
        {patient.treatPlan && (
          <div
            style={{
              fontSize: "11px",
              background: "var(--gray)",
              padding: "9px",
              borderRadius: "7px",
              marginBottom: "8px",
            }}
          >
            {patient.treatPlan}
          </div>
        )}
        <div className="info-grid">
          {renderRow("Referral Source", patient.refSrc)}
          {patient.pt === "international" &&
            renderRow(
              "Country of Origin",
              patient.country || patient.nationality
            )}
        </div>
      </div>

      {/* 2. Personal Information card */}
      <div className="card">
        <div className="card-title">👤 Personal Information</div>
        <div className="info-grid">
          {renderRow(
            "Date of Birth",
            patient.dob
              ? `${fmtDate ? fmtDate(patient.dob) : patient.dob} (${calcAge(
                  patient.dob
                )})`
              : "—"
          )}
          {renderRow("Gender", patient.gender)}
          {renderRow("Blood Type", patient.bloodType)}
          {renderRow("Nationality", patient.nationality)}
          {renderRow("Phone", patient.phone)}
          {renderRow("Alternate Phone", patient.phone2)}
          {renderRow("Language", patient.language)}
          {renderRow("Email", patient.email)}
          {renderRow("Address / Hotel", patient.address, true)}
          {renderRow(
            "Emergency Contact",
            patient.ecName + (patient.ecPhone ? ` · ${patient.ecPhone}` : ""),
            true
          )}
        </div>
      </div>

      {/* 3. Conditional Flight & Border Crossing Info card */}
      {patient.pt === "international" && (
        <div className="card">
          <div className="card-title">✈️ Travel & Visa Information</div>
          <div className="info-grid">
            {renderRow("Passport", patient.passport)}
            {renderRow("Visa Status", patient.visa)}
            {renderRow(
              "Arrival Date",
              fmtDate ? fmtDate(patient.arrivalDate) : patient.arrivalDate
            )}
            {renderRow(
              "Departure Date",
              fmtDate ? fmtDate(patient.departureDate) : patient.departureDate
            )}
            {renderRow("Accommodation", patient.hotel)}
            {renderRow("Referring Hospital", patient.referrer)}
            {renderRow("Interpreter", patient.interpreter)}
          </div>
        </div>
      )}

      {/* 4. Past Medical History card */}
      <div className="card">
        <div className="card-title">📋 Past Medical History</div>
        {patient.conditions && (
          <div style={{ marginBottom: "9px" }}>
            <div className="ilabel" style={{ marginBottom: "2px" }}>
              Conditions
            </div>
            <div
              style={{
                fontSize: "11px",
                background: "var(--gray)",
                padding: "8px",
                borderRadius: "7px",
              }}
            >
              {patient.conditions}
            </div>
          </div>
        )}
        {patient.surgeries && (
          <div style={{ marginBottom: "9px" }}>
            <div className="ilabel" style={{ marginBottom: "2px" }}>
              Previous Surgeries
            </div>
            <div
              style={{
                fontSize: "11px",
                background: "var(--gray)",
                padding: "8px",
                borderRadius: "7px",
              }}
            >
              {patient.surgeries}
            </div>
          </div>
        )}
        {patient.medications && (
          <div style={{ marginBottom: "9px" }}>
            <div className="ilabel" style={{ marginBottom: "2px" }}>
              Current Medications
            </div>
            <div
              style={{
                fontSize: "11px",
                background: "#e8f5e9",
                padding: "8px",
                borderRadius: "7px",
              }}
            >
              {patient.medications}
            </div>
          </div>
        )}
        {patient.allergies && (
          <div style={{ marginBottom: "9px" }}>
            <div className="ilabel" style={{ marginBottom: "2px" }}>
              Allergies
            </div>
            <div
              style={{
                fontSize: "11px",
                background: "#fdecea",
                padding: "8px",
                borderRadius: "7px",
                color: "#7a1f1f",
              }}
            >
              {patient.allergies}
            </div>
          </div>
        )}
        {patient.familyHx && (
          <div style={{ marginBottom: "9px" }}>
            <div className="ilabel" style={{ marginBottom: "2px" }}>
              Family History
            </div>
            <div
              style={{
                fontSize: "11px",
                background: "var(--gray)",
                padding: "8px",
                borderRadius: "7px",
              }}
            >
              {patient.familyHx}
            </div>
          </div>
        )}
        {patient.obsHx && (
          <div>
            <div className="ilabel" style={{ marginBottom: "2px" }}>
              Obstetric / Reproductive History
            </div>
            <div
              style={{
                fontSize: "11px",
                background: "var(--gray)",
                padding: "8px",
                borderRadius: "7px",
              }}
            >
              {patient.obsHx}
            </div>
          </div>
        )}
        {!patient.conditions &&
          !patient.surgeries &&
          !patient.medications &&
          !patient.allergies &&
          !patient.familyHx &&
          !patient.obsHx && (
            <div style={{ color: "var(--text3)", fontSize: "11px" }}>
              No history recorded.
            </div>
          )}
      </div>

      {/* 5. Labs & Metrics Box */}
      <div className="card">
        <div className="card-title">🔬 Lab Investigations</div>
        {patient.labRem && (
          <div
            style={{
              fontSize: "11px",
              background: "#e3f2fd",
              border: "1px solid #90caf9",
              padding: "10px",
              borderRadius: "7px",
              marginBottom: "8px",
            }}
          >
            {patient.labRem}
          </div>
        )}
        <div className="info-grid">
          {renderRow(
            "Last Lab Date",
            fmtDate ? fmtDate(patient.labDate) : patient.labDate
          )}
          {renderRow("Pending Investigations", patient.labPend)}
        </div>
        {!patient.labRem && !patient.labDate && (
          <div style={{ color: "var(--text3)", fontSize: "11px" }}>
            No lab records entered.
          </div>
        )}
      </div>

      {/* 6. Dynamic Calendared Follow-up grid rows */}
      <div className="card">
        <div className="card-title">📅 Follow-up Schedule</div>
        <div className="fu-grid">
          {[1, 2, 3, 4].map((i) => {
            const fu = (patient as any)[`fu${i}`] || {};
            if (!fu.date) {
              return (
                <div key={i} className="fu-item" style={{ opacity: 0.5 }}>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "800",
                      color: "var(--text3)",
                    }}
                  >
                    Follow-up {i}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text3)",
                      marginTop: "4px",
                    }}
                  >
                    Not scheduled
                  </div>
                </div>
              );
            }

            const status = getFuStatus(fu.date);
            const statusClass =
              status === "over"
                ? "fu-over"
                : status === "today"
                ? "fu-today"
                : status === "soon"
                ? "fu-soon"
                : "";
            const statusIcon =
              status === "over"
                ? "🔴"
                : status === "today"
                ? "🟢"
                : status === "soon"
                ? "🟡"
                : "✅";
            const statusLabelColor =
              status === "over"
                ? "#c0392b"
                : status === "today"
                ? "#1a7a4a"
                : status === "soon"
                ? "#b26200"
                : "var(--text3)";

            return (
              <div key={i} className={`fu-item ${statusClass}`}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    color: "var(--brand)",
                  }}
                >
                  Follow-up {i} {statusIcon}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "var(--text)",
                    marginTop: "4px",
                  }}
                >
                  {fmtDate ? fmtDate(fu.date) : fu.date}
                </div>
                {fu.note && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--text2)",
                      marginTop: "3px",
                    }}
                  >
                    {fu.note}
                  </div>
                )}
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: "800",
                    marginTop: "4px",
                    color: statusLabelColor,
                  }}
                >
                  {status === "over"
                    ? "OVERDUE"
                    : status === "today"
                    ? "TODAY"
                    : status === "soon"
                    ? "THIS WEEK"
                    : "SCHEDULED"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Comprehensive Payment ledger card */}
      <div className="card">
        <div className="card-title">💳 Payment</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          <span
            className={`badge ${payBadgeClass}`}
            style={{ fontSize: "11px", padding: "4px 12px" }}
          >
            {patient.payStatus || "Pending"}
          </span>
          {patient.totalAmt && (
            <span style={{ fontSize: "13px", fontWeight: "700" }}>
              {patient.currency || "ETB"}{" "}
              {Number(patient.totalAmt).toLocaleString()} total
            </span>
          )}
          {patient.paidAmt && (
            <span
              style={{
                fontSize: "13px",
                color: "var(--green)",
                fontWeight: "600",
              }}
            >
              Paid: {patient.currency || "ETB"}{" "}
              {Number(patient.paidAmt).toLocaleString()}
            </span>
          )}
          {balN > 0 && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--red)",
                fontWeight: "700",
              }}
            >
              Balance: {patient.currency || "ETB"} {balN.toLocaleString()}
            </span>
          )}
        </div>

        {patient.totalAmt && patient.paidAmt && (
          <>
            <div className="pay-bar">
              <div className="pay-paid" style={{ width: `${paidPct}%` }}></div>
              <div
                className="pay-bal"
                style={{ width: `${100 - paidPct}%` }}
              ></div>
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "var(--text3)",
                marginBottom: "8px",
              }}
            >
              {paidPct}% paid
            </div>
          </>
        )}

        <div className="info-grid">
          {renderRow("Payment Method", patient.payMethod)}
          {renderRow("Insurance Provider", patient.insurance)}
        </div>

        {patient.payRem && (
          <div style={{ marginTop: "9px" }}>
            <div className="ilabel" style={{ marginBottom: "2px" }}>
              Payment Remarks
            </div>
            <div
              style={{
                fontSize: "11px",
                background: "#fff8e1",
                border: "1px solid #ffe082",
                padding: "9px",
                borderRadius: "7px",
              }}
            >
              {patient.payRem}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer Navigation Bar */}
      <div className="action-bar">
        <button
          className="btn btn-primary"
          onClick={() => router.push(`/patients/${id}/edit`)}
        >
          ✏️ Edit Record
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => router.push("/patients")}
        >
          ← All Patients
        </button>
        <button
          className="btn btn-danger"
          style={{ marginLeft: "auto" }}
          onClick={() => {
            if (confirm("Are you sure you want to delete this record?")) {
              // Add deletion dispatch implementation logic if needed
              router.push("/patients");
            }
          }}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}
