"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { initials, fmtDate, calcAge } from "@/lib/utils";

export default function RecentPatients() {
  const router = useRouter();
  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent patients directly from Supabase
  useEffect(() => {
    async function fetchRecentPatients() {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .order("reg_date", { ascending: false })
          .limit(5);

        if (error) {
          console.error("Error pulling recent patients:", error.message);
        } else if (data) {
          // Map DB snake_case columns to camelCase expected by the template layout
          const mapped = data.map((p) => ({
            ...p,
            regDate: p.reg_date,
            payStatus: p.pay_status,
          }));
          setAllPatients(mapped);
        }
      } catch (err) {
        console.error("Unexpected fetch failure:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentPatients();
  }, []);

  // Professional Loading Layout (Skeleton Rows)
  if (loading) {
    return (
      <div className="card">
        <div className="card-title">🕐 Recently Registered</div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="patient-row"
            style={{ opacity: 0.6, animation: "pulse 1.5s infinite" }}
          >
            <div className="avatar" style={{ background: "var(--gray)" }}>
              &nbsp;
            </div>
            <div className="patient-info" style={{ flex: 1 }}>
              <div
                style={{
                  height: "12px",
                  width: "40%",
                  background: "var(--gray)",
                  marginBottom: "6px",
                  borderRadius: "4px",
                }}
              />
              <div
                style={{
                  height: "10px",
                  width: "60%",
                  background: "var(--gray)",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div
              style={{
                height: "10px",
                width: "15%",
                background: "var(--gray)",
                borderRadius: "4px",
              }}
            />
          </div>
        ))}
        {/* Basic embedded keyframe animation if pulse isn't defined in your global CSS */}
        <style jsx>{`
          @keyframes pulse {
            0% {
              opacity: 0.4;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              opacity: 0.4;
            }
          }
        `}</style>
      </div>
    );
  }

  if (!allPatients.length) {
    return null;
  }

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
        <div
          key={p.id}
          className="patient-row"
          onClick={() => router.push(`/patients/${p.id}`)}
          style={{ cursor: "pointer" }}
        >
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

              {/* Dynamic Payment Status Badge */}
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
