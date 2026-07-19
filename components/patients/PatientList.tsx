"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import PatientCard from "./PatientCard";

export default function PatientList() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  // Fetch all patients from your Supabase database table on load
  useEffect(() => {
    async function fetchPatients() {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .order("reg_date", { ascending: false }); // Optional: shows newest first

        if (error) {
          console.error("Error fetching patients:", error.message);
        } else if (data) {
          // Map database snake_case fields to camelCase if your PatientCard relies on camelCase properties
          const formattedData = data.map((p) => ({
            ...p,
            bloodType: p.blood_type,
            ecName: p.ec_name,
            ecPhone: p.ec_phone,
            arrivalDate: p.arrival_date,
            departureDate: p.departure_date,
            treatPlan: p.treat_plan,
            refSrc: p.ref_src,
            familyHx: p.family_hx,
            obsHx: p.obs_hx,
            labRem: p.lab_rem,
            labDate: p.lab_date,
            labPend: p.lab_pend,
            payStatus: p.pay_status,
            totalAmt: p.total_amt,
            paidAmt: p.paid_amt,
            payMethod: p.pay_method,
            payRem: p.pay_rem,
            regDate: p.reg_date,
          }));
          setPatients(formattedData);
        }
      } catch (err) {
        console.error("Unexpected error fetching records:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.nationality || "").toLowerCase().includes(search.toLowerCase());

    const matchesType = !type || p.pt === type;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="card">
        <div className="card-title">📋 Loading Patient Registry...</div>
      </div>
    );
  }

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
