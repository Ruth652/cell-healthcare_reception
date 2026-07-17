import { patients } from "@/lib/mock-data";
import { initials, fmtDate, calcAge } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function RecentPatients() {
  const allPatients = [...patients]
    .sort(
      (a, b) =>
        new Date(b.regDate || 0).getTime() - new Date(a.regDate || 0).getTime()
    )
    .slice(0, 5);

  if (!allPatients.length) {
    return null;
  }
  const router = useRouter();

  return (
    <div className="card">
      <div className="card-title">
        🕐 Recently Registered
        <span
          className="ctr"
          onClick={() => router.push("/patients")}
          style={{ cursor: "pointer" }}
        >
          All patients →
        </span>
      </div>

      {allPatients.map((p) => (
        <div key={p.id} className="patient-row">
          <div
            className={`avatar ${
              p.pt === "international" ? "av-intl" : "av-local"
            }`}
          >
            {initials(p.name)}
          </div>

          <div className="patient-info">
            <div className="p-name">
              {p.name}

              <span
                className={`badge ${
                  p.pt === "international" ? "b-intl" : "b-local"
                }`}
              >
                {p.pt === "international" ? "✈ INTL" : "🏠 LOCAL"}
              </span>

              {p.treat && (
                <span className="badge b-treat">{p.treat.split("/")[0]}</span>
              )}

              {/* Dynamic Payment Status Badge linked entirely to your CSS classes */}
              {p.payStatus && (
                <span
                  className={`badge ${
                    p.payStatus === "Fully Paid" ||
                    p.payStatus === "Insurance Covered"
                      ? "b-paid"
                      : p.payStatus === "Partially Paid"
                      ? "b-partial"
                      : "b-pending"
                  }`}
                >
                  {p.payStatus}
                </span>
              )}
            </div>

            <div className="p-meta">
              📱 {p.phone}
              {p.nationality && ` · 🌍 ${p.nationality}`}
              {" · "}
              {p.gender || "—"}
              {" · "}
              {calcAge(p.dob)}
            </div>
          </div>

          <div
            style={{
              fontSize: "10px",
              color: "var(--text3)",
              textAlign: "right",
            }}
          >
            {fmtDate(p.regDate)}
          </div>
        </div>
      ))}
    </div>
  );
}
