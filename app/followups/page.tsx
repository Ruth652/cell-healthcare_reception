"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { fmtDate } from "@/lib/utils";

function getAllAlerts(patientsList: any[]) {
  const alerts: any[] = [];
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTime = new Date(todayStr).getTime();
  const oneWeekLaterTime = todayTime + 7 * 24 * 60 * 60 * 1000;

  patientsList.forEach((p) => {
    [1, 2, 3, 4].forEach((i) => {
      const fu = p[`fu${i}`] as { date?: string; note?: string } | undefined;

      if (fu && fu.date) {
        const fuTime = new Date(fu.date).getTime();
        let status = "";

        if (fu.date < todayStr) {
          status = "over";
        } else if (fu.date === todayStr) {
          status = "today";
        } else if (fuTime > todayTime && fuTime <= oneWeekLaterTime) {
          status = "soon";
        }

        if (status) {
          alerts.push({
            p,
            i,
            date: fu.date,
            note: fu.note || "",
            s: status,
          });
        }
      }
    });
  });

  return alerts.sort((a, b) => a.date.localeCompare(b.date));
}

export default function FollowupsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch operational dataset cache from Supabase on component mounting
  useEffect(() => {
    async function fetchFollowupCache() {
      try {
        const { data, error } = await supabase.from("patients").select("*");
        if (error) {
          console.error(
            "Error pulling follow-up patient cache:",
            error.message
          );
        } else if (data) {
          // Keep structure consistent for the logic engine requirements
          setPatients(data);
        }
      } catch (err) {
        console.error("Unexpected pipeline database lookup error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFollowupCache();
  }, []);

  const alerts = getAllAlerts(patients);

  const over = alerts.filter((a) => a.s === "over");
  const tod = alerts.filter((a) => a.s === "today");
  const soon = alerts.filter((a) => a.s === "soon");

  // Professional Loading Layout Skeletons matching dashboard pattern styles[cite: 4]
  if (loading) {
    return (
      <div
        className="card"
        style={{ opacity: 0.6, animation: "pulse 1.5s infinite" }}
      >
        <div
          style={{
            height: "24px",
            width: "35%",
            background: "var(--gray)",
            marginBottom: "25px",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "14px",
            width: "20%",
            background: "var(--gray)",
            marginBottom: "10px",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "45px",
            width: "100%",
            background: "var(--gray)",
            marginBottom: "8px",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            height: "45px",
            width: "100%",
            background: "var(--gray)",
            borderRadius: "8px",
          }}
        />
        <style jsx global>{`
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

  const renderSection = (
    title: string,
    arr: any[],
    icon: string,
    cls: string
  ) => {
    if (!arr.length) return null;

    return (
      <>
        {/* Matches your .divider layout */}
        <div className="divider">
          {icon} {title} ({arr.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {arr.map((a, index) => (
            <div
              key={`${a.p.id}-fu-${a.i}-${index}`}
              onClick={() => router.push(`/patients/${a.p.id}`)}
              /* Injects 'overdue', 'today-a', or 'soon' to trigger your CSS background colors */
              className={`alert-row ${cls || a.s}`}
              style={{ cursor: "pointer" }}
            >
              <span>{icon}</span>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: "12px" }}>{a.p.name}</strong>
                <span> — Follow-up {a.i}</span>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--text3)",
                    marginTop: "2px",
                  }}
                >
                  📅 {fmtDate ? fmtDate(a.date) : a.date}
                  {a.note ? ` · ${a.note}` : ""}
                  {a.p.treat ? ` · ${a.p.treat.split("/")[0].trim()}` : ""}
                </div>
              </div>
              <span style={{ fontSize: "9px", fontWeight: 800 }}>
                {a.s === "soon"
                  ? "SOON"
                  : a.s === "over"
                  ? "OVER"
                  : a.s.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="card">
      <div className="card-title">🔔 Follow-up Reminders</div>

      {!alerts.length ? (
        <div className="no-results">
          <div style={{ fontSize: "30px" }}>✅</div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              marginTop: "8px",
              color: "var(--text2)",
            }}
          >
            All clear!
          </div>
        </div>
      ) : (
        <div>
          {renderSection("Overdue", over, "🔴", "overdue")}
          {renderSection("Today", tod, "🟢", "today-a")}
          {renderSection("This Week", soon, "🟡", "soon")}
        </div>
      )}
    </div>
  );
}
