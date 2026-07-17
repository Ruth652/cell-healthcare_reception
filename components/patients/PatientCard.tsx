"use client";
import { initials, calcAge, fmtDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PatientCard({ patient }: any) {
  const paymentClass =
    patient.payStatus === "Fully Paid" ||
    patient.payStatus === "Insurance Covered"
      ? "b-paid"
      : patient.payStatus === "Partially Paid"
      ? "b-partial"
      : "b-pending";

  const router = useRouter();
  return (
    <div
      className="patient-row"
      onClick={() => router.push(`/patients/${patient.id}`)}
    >
      <div
        className={`avatar ${
          patient.pt === "international" ? "av-intl" : "av-local"
        }`}
      >
        {initials(patient.name)}
      </div>

      <div className="patient-info">
        <div className="p-name">
          {patient.name}

          <span
            className={`badge ${
              patient.pt === "international" ? "b-intl" : "b-local"
            }`}
          >
            {patient.pt === "international" ? "✈ INTL" : "🏠 LOCAL"}
          </span>

          {patient.treat && (
            <span className="badge b-treat">
              {patient.treat.split("/")[0].trim()}
            </span>
          )}

          {patient.payStatus && (
            <span className={`badge ${paymentClass}`}>{patient.payStatus}</span>
          )}
        </div>

        <div className="p-meta">
          📱 {patient.phone}
          {patient.nationality && ` · 🌍 ${patient.nationality}`}
          {" · "}
          {patient.gender || "—"}
          {" · "}
          {calcAge(patient.dob)}
        </div>
      </div>

      <div
        style={{
          fontSize: "10px",
          color: "var(--text3)",
          textAlign: "right",
          marginLeft: "auto",
        }}
      >
        {fmtDate(patient.regDate)}
      </div>
    </div>
  );
}
