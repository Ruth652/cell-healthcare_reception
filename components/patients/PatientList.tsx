"use client";

import { useState } from "react";
import { patients } from "@/lib/mock-data";
import PatientCard from "./PatientCard";

export default function PatientList() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.nationality || "").toLowerCase().includes(search.toLowerCase());

    const matchesType = !type || p.pt === type;

    return matchesSearch && matchesType;
  });

  return (
    <div className="card">
      <div className="card-title">
        📋 All Patients ({filteredPatients.length})
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <input
          className="search-input"
          placeholder="Filter by name, phone, country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            padding: "7px 10px",
            border: "1px solid var(--border)",
            borderRadius: "7px",
            fontSize: "11px",
          }}
        >
          <option value="">All Types</option>

          <option value="international">International</option>

          <option value="local">Local</option>
        </select>
      </div>

      {filteredPatients.length > 0 ? (
        filteredPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))
      ) : (
        <div className="no-results">
          <div style={{ fontSize: "30px" }}>👥</div>

          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              marginTop: "8px",
            }}
          >
            No patients found
          </div>
        </div>
      )}
    </div>
  );
}
