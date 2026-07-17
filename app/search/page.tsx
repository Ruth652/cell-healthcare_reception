"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { patients } from "@/lib/mock-data";
import { initials, fmtDate } from "@/lib/utils";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!query.trim()) {
      setHasSearched(false);
      setResults([]);
      return;
    }

    // This handles both Name or Phone scanning cleanly
    const filtered = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.phone.replace(/[\s\-]/g, "").includes(query.replace(/[\s\-]/g, ""))
    );

    setResults(filtered);
    setHasSearched(true);
  };

  return (
    <div
      className="card"
      style={{
        width: "100%",
        margin: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Label matching the original UI structure */}
      <div
        className="card-title"
        style={{
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "10px",
          marginBottom: "15px",
        }}
      >
        🔍 SEARCH PATIENT BY PHONE NUMBER OR NAME
      </div>

      {/* Control Input Row with Action Button */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Enter phone number (e.g. +251911234567) or name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value.trim()) setHasSearched(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccd7e0",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          className="btn btn-primary"
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#45a29e", // Match your theme's teal tone
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Search
        </button>
      </div>

      {/* Results Workspace Area */}
      <div>
        {hasSearched ? (
          results.length > 0 ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {results.map((p) => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/patients/${p.id}`)}
                  className="patient-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    position: "relative",
                  }}
                >
                  {/* Avatar Section */}
                  <div
                    className={`avatar ${
                      p.pt === "international" ? "av-intl" : "av-local"
                    }`}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: "bold",
                      marginRight: "12px",
                      backgroundColor:
                        p.pt === "international" ? "#e6f7ff" : "#e6fffb",
                      color: p.pt === "international" ? "#0050b3" : "#006d75",
                    }}
                  >
                    {initials(p.name)}
                  </div>

                  {/* Badges and core identifiers info */}
                  <div style={{ flex: 1, paddingRight: "70px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexWrap: "wrap",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#0f2537",
                        }}
                      >
                        {p.name}
                      </span>

                      <span
                        className={`badge ${
                          p.pt === "international" ? "b-intl" : "b-local"
                        }`}
                        style={{
                          fontSize: "10px",
                          fontWeight: "bold",
                          padding: "1px 6px",
                          borderRadius: "10px",
                          backgroundColor:
                            p.pt === "international" ? "#e6f7ff" : "#e6fffb",
                          color:
                            p.pt === "international" ? "#1890ff" : "#13c2c2",
                        }}
                      >
                        {p.pt === "international" ? "✈ INTL" : "🏠 LOCAL"}
                      </span>

                      {p.treat && (
                        <span
                          className="badge b-treat"
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "1px 6px",
                            borderRadius: "10px",
                            backgroundColor: "#f9f0ff",
                            color: "#722ed1",
                          }}
                        >
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
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "1px 6px",
                            borderRadius: "10px",
                          }}
                        >
                          {p.payStatus}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#557a95",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      📱 {p.phone} · {p.gender || "—"} · —
                    </div>
                  </div>

                  {/* Float-right fixed position date */}
                  <div
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "11px",
                      color: "#557a95",
                    }}
                  >
                    {fmtDate ? fmtDate(p.regDate) : p.regDate}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Explicit Empty Screen State matching Screenshot 2 */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  marginBottom: "10px",
                  color: "#557a95",
                }}
              >
                🔍
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  color: "#557a95",
                  margin: "0 0 4px 0",
                  fontWeight: "bold",
                }}
              >
                No patient found
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "#7795a3",
                  margin: "0 0 20px 0",
                }}
              >
                No record matches this criteria
              </p>

              <button
                onClick={() => router.push("/patients/new")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#45a29e",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                <span>+</span> Register New Patient
              </button>
            </div>
          )
        ) : (
          /* Default Placeholder Screen */
          <div
            style={{
              textAlign: "center",
              padding: "30px",
              color: "#7795a3",
              fontSize: "13px",
            }}
          >
            Enter a phone number or name to find a patient record.
          </div>
        )}
      </div>
    </div>
  );
}
