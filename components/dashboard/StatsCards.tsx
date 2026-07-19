// import { dashboardStats } from "@/lib/mock-data";

// export default function StatsCards() {
//   return (
//     <div className="stats-row">
//       <div className="stat-card">
//         <div className="stat-num">{dashboardStats.totalPatients}</div>

//         <div className="stat-label">Total Patients</div>

//         <div className="stat-sub">{dashboardStats.thisMonth} this month</div>
//       </div>

//       <div className="stat-card intl">
//         <div className="stat-num">{dashboardStats.internationalPatients}</div>

//         <div className="stat-label">International</div>

//         <div className="stat-sub">
//           {Math.round(
//             (dashboardStats.internationalPatients /
//               dashboardStats.totalPatients) *
//               100
//           )}
//           % of total
//         </div>
//       </div>

//       <div
//         className={`stat-card ${
//           dashboardStats.followupAlerts > 0 ? "alert-c" : ""
//         }`}
//       >
//         <div className="stat-num">{dashboardStats.followupAlerts}</div>

//         <div className="stat-label">Follow-up Alerts</div>

//         <div className="stat-sub">
//           {dashboardStats.overdueFollowups} overdue
//         </div>
//       </div>

//       <div className="stat-card paid-c">
//         <div className="stat-num">{dashboardStats.paymentsCleared}</div>

//         <div className="stat-label">Payments Cleared</div>

//         <div className="stat-sub">{dashboardStats.pendingPayments} pending</div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StatsType {
  totalPatients: number;
  thisMonth: number;
  internationalPatients: number;
  followupAlerts: number;
  overdueFollowups: number;
  paymentsCleared: number;
  pendingPayments: number;
}

// Global in-memory cache to prevent layout flashing on page changes
let statsCache: StatsType | null = null;

export default function StatsCards() {
  // If we already have cached data, initialize with it immediately
  const [stats, setStats] = useState<StatsType | null>(statsCache);
  const [loading, setLoading] = useState(!statsCache);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: patients, error } = await supabase
          .from("patients")
          .select("country, pay_status, fu1, fu2, fu3, fu4, arrival_date");

        if (error) throw error;

        if (patients) {
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          const total = patients.length;
          const international = patients.filter(
            (p) => p.country && p.country.toLowerCase() !== "ethiopia"
          ).length;

          const cleared = patients.filter(
            (p) => p.pay_status === "Cleared" || p.pay_status === "Paid"
          ).length;
          const pending = patients.filter(
            (p) => p.pay_status === "Pending"
          ).length;

          // Normalize today's date context for pure calendar day comparisons
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Follow-up parsing logic for object structure: { date: 'YYYY-MM-DD', note: '' }
          const isAlert = (val: any) => {
            if (!val || !val.date) return false;
            const dueDate = new Date(val.date);
            dueDate.setHours(0, 0, 0, 0);

            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Alert if due today or within the next 3 days
            return diffDays >= 0 && diffDays <= 3;
          };

          const isOverdue = (val: any) => {
            if (!val || !val.date) return false;
            const dueDate = new Date(val.date);
            dueDate.setHours(0, 0, 0, 0);

            // Overdue if the calendar date has already passed
            return dueDate < today;
          };

          // Individual task counters instead of patient-level filtering
          let totalAlertsCount = 0;
          let totalOverdueCount = 0;

          patients.forEach((p) => {
            if (isAlert(p.fu1)) totalAlertsCount++;
            if (isAlert(p.fu2)) totalAlertsCount++;
            if (isAlert(p.fu3)) totalAlertsCount++;
            if (isAlert(p.fu4)) totalAlertsCount++;

            if (isOverdue(p.fu1)) totalOverdueCount++;
            if (isOverdue(p.fu2)) totalOverdueCount++;
            if (isOverdue(p.fu3)) totalOverdueCount++;
            if (isOverdue(p.fu4)) totalOverdueCount++;
          });

          const monthlyCount = patients.filter((p) => {
            if (!p.arrival_date) return false;
            const arrival = new Date(p.arrival_date);
            return (
              arrival.getMonth() === currentMonth &&
              arrival.getFullYear() === currentYear
            );
          }).length;

          const calculatedStats = {
            totalPatients: total,
            thisMonth: monthlyCount,
            internationalPatients: international,
            paymentsCleared: cleared,
            pendingPayments: pending,
            followupAlerts: totalAlertsCount,
            overdueFollowups: totalOverdueCount,
          };

          // Update cache and state
          statsCache = calculatedStats;
          setStats(calculatedStats);
        }
      } catch (err) {
        console.error("Error loading live dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const internationalPercentage =
    stats && stats.totalPatients > 0
      ? Math.round((stats.internationalPatients / stats.totalPatients) * 100)
      : 0;

  return (
    <div className="stats-row">
      {/* Total Patients Card */}
      <div className="stat-card">
        <div className="stat-num">
          {loading && !stats ? (
            <span className="skeleton-text">...</span>
          ) : (
            stats?.totalPatients
          )}
        </div>
        <div className="stat-label">Total Patients</div>
        <div className="stat-sub">
          {loading && !stats ? "Loading..." : `${stats?.thisMonth} this month`}
        </div>
      </div>

      {/* International Card */}
      <div className="stat-card intl">
        <div className="stat-num">
          {loading && !stats ? (
            <span className="skeleton-text">...</span>
          ) : (
            stats?.internationalPatients
          )}
        </div>
        <div className="stat-label">International</div>
        <div className="stat-sub">
          {loading && !stats
            ? "Loading..."
            : `${internationalPercentage}% of total`}
        </div>
      </div>

      {/* Upcoming Follow-ups Card */}
      <div
        className={`stat-card ${
          (stats?.followupAlerts ?? 0) > 0 ? "alert-c" : ""
        }`}
      >
        <div className="stat-num">
          {loading && !stats ? (
            <span className="skeleton-text">...</span>
          ) : (
            stats?.followupAlerts
          )}
        </div>
        <div className="stat-label">
          Upcoming Follow-ups <br /> (3 Days)
        </div>
        <div className="stat-sub">
          {loading && !stats
            ? "Loading..."
            : `${stats?.overdueFollowups} overdue`}
        </div>
      </div>

      {/* Payments Card */}
      <div className="stat-card paid-c">
        <div className="stat-num">
          {loading && !stats ? (
            <span className="skeleton-text">...</span>
          ) : (
            stats?.paymentsCleared
          )}
        </div>
        <div className="stat-label">Payments Cleared</div>
        <div className="stat-sub">
          {loading && !stats
            ? "Loading..."
            : `${stats?.pendingPayments} pending`}
        </div>
      </div>
    </div>
  );
}
