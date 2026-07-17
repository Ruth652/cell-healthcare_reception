"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="nav">
      <Link href="/dashboard" className="nav-btn">
        🏠 Dashboard
      </Link>

      <Link href="/patients" className="nav-btn">
        📋 All Patients
      </Link>

      <Link href="/patients/new" className="nav-btn">
        ➕ New Patient
      </Link>

      <Link href="/search" className="nav-btn">
        🔍 Search
      </Link>

      <Link href="/followups" className="nav-btn">
        🔔 Follow-ups
      </Link>
    </nav>
  );
}
