"use client";

import { patients } from "@/lib/mock-data";
import { initials, fmtDate, calcAge } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

  return (
    <div>
      <button className="back-btn" onClick={() => router.back()}>
        ← Back
      </button>

      <div className="det-hdr">
        <div className="det-av">{initials(patient.name)}</div>

        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "800",
            }}
          >
            {patient.name}
          </div>

          <div
            style={{
              fontSize: "12px",
              opacity: "0.8",
            }}
          >
            {patient.pt === "international"
              ? "✈ International Patient"
              : "🏠 Local Patient"}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">👤 Patient Information</div>

        <div className="info-grid">
          <div className="irow">
            <div className="ilabel">Phone</div>

            <div className="ival">{patient.phone}</div>
          </div>

          <div className="irow">
            <div className="ilabel">Gender</div>

            <div className="ival">{patient.gender || "—"}</div>
          </div>

          <div className="irow">
            <div className="ilabel">Age</div>

            <div className="ival">{calcAge(patient.dob)}</div>
          </div>

          <div className="irow">
            <div className="ilabel">Nationality</div>

            <div className="ival">{patient.nationality || "—"}</div>
          </div>

          <div className="irow">
            <div className="ilabel">Registered</div>

            <div className="ival">{fmtDate(patient.regDate)}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">🏥 Medical Information</div>

        <div className="info-grid">
          <div className="irow">
            <div className="ilabel">Treatment</div>

            <div className="ival">{patient.treatment || "—"}</div>
          </div>

          <div className="irow">
            <div className="ilabel">Payment Status</div>

            <div className="ival">{patient.payStatus || "—"}</div>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <button className="btn btn-primary">✏ Edit Patient</button>

        <button className="btn btn-secondary">🔔 Add Follow-up</button>
      </div>
    </div>
  );
}
