"use client";

import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="quick-actions">
      <div className="qa-btn" onClick={() => router.push("/patients/new")}>
        <div className="qa-icon">👤</div>
        <div className="qa-label">Register New Patient</div>
      </div>

      <div className="qa-btn" onClick={() => router.push("/search")}>
        <div className="qa-icon">🔍</div>
        <div className="qa-label">Search by Phone</div>
      </div>

      <div className="qa-btn" onClick={() => router.push("/followups")}>
        <div className="qa-icon">🔔</div>
        <div className="qa-label">View Follow-ups</div>
      </div>
    </div>
  );
}
