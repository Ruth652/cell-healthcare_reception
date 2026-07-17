"use client";

import { useRouter } from "next/navigation";
import StatsCards from "./StatsCards";
import QuickActions from "./QuickActions";
import RecentPatients from "./RecentPatients";
import DashboardGrid from "../DashboardGrid";

export default function Dashboard() {
  const router = useRouter();

  return (
    <>
      <div className="dash-hero">
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
          }}
        >
          <div className="hero-title">Welcome to Cell Healthcare Solutions</div>

          <div className="hero-sub">
            Medical Tourism & Reproductive Medicine — Addis Ababa, Ethiopia
          </div>

          <div className="hero-amharic">
            የጤናዎ ታማኝ እንልጋይ! — Your Trusted Health Partner
          </div>

          <button
            className="hero-btn"
            onClick={() => router.push("/patients/new")}
          >
            ➕ Register Patient
          </button>

          <button className="hero-btn2" onClick={() => router.push("/search")}>
            🔍 Find Patient
          </button>
        </div>

        <svg
          width="90"
          height="90"
          viewBox="0 0 44 44"
          fill="none"
          style={{
            opacity: 0.15,
            flexShrink: 0,
          }}
        >
          <g stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M13 13 Q13 19 19 19 Q13 19 13 25" />
            <path d="M31 13 Q31 19 25 19 Q31 19 31 25" />
            <path d="M13 31 Q13 25 19 25 Q13 25 13 19" />
            <path d="M31 31 Q31 25 25 25 Q31 25 31 19" />
          </g>

          <circle cx="22" cy="22" r="4" fill="#fff" />
        </svg>
      </div>

      <StatsCards />

      <QuickActions />
      <DashboardGrid />
      <RecentPatients />
    </>
  );
}
