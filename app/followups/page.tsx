"use client";

import { useRouter } from "next/navigation";
import { patients } from "@/lib/mock-data";
import { fmtDate } from "@/lib/utils";

function getAllAlerts() {
  const alerts: any[] = [];
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTime = new Date(todayStr).getTime();
  const oneWeekLaterTime = todayTime + 7 * 24 * 60 * 60 * 1000;

  patients.forEach((p) => {
    [1, 2, 3, 4].forEach((i) => {
      const fu = p[`fu${i}` as keyof typeof p] as
        | { date?: string; note?: string }
        | undefined;

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
  const alerts = getAllAlerts();

  const over = alerts.filter((a) => a.s === "over");
  const tod = alerts.filter((a) => a.s === "today");
  const soon = alerts.filter((a) => a.s === "soon");

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
