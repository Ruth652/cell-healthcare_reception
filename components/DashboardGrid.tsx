"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { initials, fmtDate } from "@/lib/utils";

function getDashboardAlerts(patientsList: any[]) {
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
          alerts.push({ p, i, date: fu.date, note: fu.note || "", s: status });
        }
      }
    });
  });

  return alerts.sort((a, b) => a.date.localeCompare(b.date));
}

export default function DashboardGrid() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pull operational dataset state from Supabase on mount
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data, error } = await supabase.from("patients").select("*");
        if (error) {
          console.error("Error fetching dashboard patients:", error.message);
        } else if (data) {
          // Standard camelCase normalization interface conversion pipeline
          const mapped = data.map((p) => ({
            ...p,
            regDate: p.reg_date,
            payStatus: p.pay_status,
            refSrc: p.ref_src,
          }));
          setPatients(mapped);
        }
      } catch (err) {
        console.error("Dashboard engine critical fetch boundary failure:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const all = patients;
  const alerts = getDashboardAlerts(patients);
  const local = patients.filter((p) => p.pt === "local");
  const intl = patients.filter((p) => p.pt === "international");

  // Filter calculations for Top Treatments
  const treatmentCounts = patients.reduce((acc: Record<string, number>, p) => {
    if (p.treat) {
      acc[p.treat] = (acc[p.treat] || 0) + 1;
    }
    return acc;
  }, {});
  const topT = Object.entries(treatmentCounts).sort((a, b) => b[1] - a[1]);

  // Top Nationalities
  const nationalityCounts = patients.reduce(
    (acc: Record<string, number>, p) => {
      if (p.nationality && p.pt === "international") {
        acc[p.nationality] = (acc[p.nationality] || 0) + 1;
      }
      return acc;
    },
    {}
  );
  const topN = Object.entries(nationalityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  // Search filter criteria
  const filteredPatients = search.trim()
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.phone.replace(/[\s\-]/g, "").includes(search.replace(/[\s\-]/g, ""))
      )
    : [];

  // SVG Donut Path Generation logic matching your original script precisely
  const renderPieSvg = () => {
    const tot = all.length;
    if (!tot) {
      return (
        <>
          <circle cx="40" cy="40" r="30" fill="#e0e0e0" />
          <text x="40" y="44" textAnchor="middle" fontSize="10" fill="#999">
            No data
          </text>
        </>
      );
    }

    const lPct = local.length / tot;
    const iPct = intl.length / tot;
    const r = 30,
      cx = 40,
      cy = 40;

    const arc = (pct: number, off: number) => {
      if (pct <= 0) return "";
      if (pct >= 1) pct = 0.9999;
      const a = pct * 2 * Math.PI;
      const x = cx + r * Math.sin(a - off * 2 * Math.PI);
      const y = cy - r * Math.cos(a - off * 2 * Math.PI);
      const sx = cx + r * Math.sin(-off * 2 * Math.PI);
      const sy = cy - r * Math.cos(-off * 2 * Math.PI);
      return `M${cx},${cy} L${sx},${sy} A${r},${r} 0 ${
        pct > 0.5 ? 1 : 0
      },1 ${x},${y} Z`;
    };

    return (
      <>
        <path d={arc(lPct, 0)} fill="#1DAAAA" />
        <path d={arc(iPct, lPct)} fill="#1565c0" />
        <circle cx="40" cy="40" r="16" fill="white" />
        <text
          x="40"
          y="44"
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill="#0d3535"
        >
          {tot}
        </text>
      </>
    );
  };

  // Professional Dashboard Card Skeleton Fallbacks
  if (loading) {
    return (
      <>
        <div className="two-col" style={{ animation: "pulse 1.5s infinite" }}>
          <div className="card" style={{ height: "180px", opacity: 0.6 }} />
          <div className="card" style={{ height: "180px", opacity: 0.6 }} />
        </div>
        <div
          className="two-col"
          style={{ animation: "pulse 1.5s infinite", marginTop: "20px" }}
        >
          <div className="card" style={{ height: "180px", opacity: 0.6 }} />
          <div className="card" style={{ height: "180px", opacity: 0.6 }} />
        </div>
        <style jsx global>{`
          @keyframes pulse {
            0% {
              opacity: 0.5;
            }
            50% {
              opacity: 0.85;
            }
            100% {
              opacity: 0.5;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      {/* SECTION 1: QUICK LOOKUP & FOLLOW-UP ALERTS */}
      <div className="two-col">
        <div className="card">
          <div className="card-title">🔍 Quick Patient Lookup</div>
          <input
            className="search-input"
            id="qp"
            placeholder="Phone number or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: "8px", width: "100%" }}
          />
          <div id="qr">
            {search.trim() && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/patients/${p.id}`)}
                      className="patient-row"
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
                            <span className="badge b-treat">
                              {p.treat.split("/")[0].trim()}
                            </span>
                          )}

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
                          📱 {p.phone} · {p.gender || "—"} · —
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--text3)",
                          textAlign: "right",
                          marginLeft: "auto",
                          paddingLeft: "10px",
                        }}
                      >
                        {fmtDate ? fmtDate(p.regDate) : p.regDate}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "5px",
                      fontSize: "13px",
                      color: "var(--text3)",
                    }}
                  >
                    No matching records found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            🔔 Follow-up Alerts{" "}
            <span
              className="ctr"
              onClick={() => router.push("/followups")}
              style={{ cursor: "pointer" }}
            >
              View all →
            </span>
          </div>
          {alerts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "var(--text3)",
                fontSize: "12px",
              }}
            >
              ✅ No pending alerts
            </div>
          ) : (
            <div
              style={{
                maxHeight: "155px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {alerts.map((a, idx) => (
                <div
                  key={`${a.p.id}-dash-fu-${idx}`}
                  className={`alert-row ${
                    a.s === "over"
                      ? "overdue"
                      : a.s === "today"
                      ? "today-a"
                      : ""
                  }`}
                  onClick={() => router.push(`/patients/${a.p.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <span>
                    {a.s === "over" ? "🔴" : a.s === "today" ? "🟢" : "🟡"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: "11px" }}>{a.p.name}</strong>
                    <span style={{ fontSize: "10px", color: "var(--text3)" }}>
                      {" "}
                      · FU-{a.i} · {fmtDate ? fmtDate(a.date) : a.date}
                    </span>
                    {a.note && (
                      <div style={{ fontSize: "10px", color: "var(--text3)" }}>
                        {a.note}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 800,
                      color:
                        a.s === "over"
                          ? "#c0392b"
                          : a.s === "today"
                          ? "#1a7a4a"
                          : "#b26200",
                    }}
                  >
                    {a.s === "over"
                      ? "OVERDUE"
                      : a.s === "today"
                      ? "TODAY"
                      : "SOON"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: TOP TREATMENTS & PATIENT ORIGINS */}
      <div className="two-col">
        <div className="card">
          <div className="card-title">🏥 Top Treatments</div>
          {topT.length ? (
            topT.map(([t, c]) => (
              <div className="bar-row" key={t}>
                <div className="bar-label" title={t}>
                  {t.split("/")[0].split("(")[0].trim()}
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${
                        all.length ? Math.round((c / all.length) * 100) : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="bar-count">{c}</div>
              </div>
            ))
          ) : (
            <div
              style={{
                fontSize: "12px",
                color: "var(--text3)",
                textAlign: "center",
                padding: "20px",
              }}
            >
              Register patients to see data
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">🌍 Patient Origins</div>
          <div className="pie-wrap">
            <svg width="80" height="80" viewBox="0 0 80 80">
              {renderPieSvg()}
            </svg>
            <div className="pie-legend">
              <div className="pie-leg-row">
                <div
                  className="pie-dot"
                  style={{ background: "var(--brand)" }}
                ></div>
                <div className="pie-leg-label">Local</div>
                <div className="pie-leg-num">{local.length}</div>
              </div>
              <div className="pie-leg-row">
                <div
                  className="pie-dot"
                  style={{ background: "#1565c0" }}
                ></div>
                <div className="pie-leg-label">International</div>
                <div className="pie-leg-num">{intl.length}</div>
              </div>
              {topN.map(([n, c]) => (
                <div className="pie-leg-row" key={n}>
                  <div
                    className="pie-dot"
                    style={{ background: "#90caf9" }}
                  ></div>
                  <div className="pie-leg-label" style={{ fontSize: "10px" }}>
                    {n}
                  </div>
                  <div className="pie-leg-num" style={{ fontSize: "11px" }}>
                    {c}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
