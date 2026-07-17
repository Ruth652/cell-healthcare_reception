import { dashboardStats } from "@/lib/mock-data";

export default function StatsCards() {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-num">{dashboardStats.totalPatients}</div>

        <div className="stat-label">Total Patients</div>

        <div className="stat-sub">{dashboardStats.thisMonth} this month</div>
      </div>

      <div className="stat-card intl">
        <div className="stat-num">{dashboardStats.internationalPatients}</div>

        <div className="stat-label">International</div>

        <div className="stat-sub">
          {Math.round(
            (dashboardStats.internationalPatients /
              dashboardStats.totalPatients) *
              100
          )}
          % of total
        </div>
      </div>

      <div
        className={`stat-card ${
          dashboardStats.followupAlerts > 0 ? "alert-c" : ""
        }`}
      >
        <div className="stat-num">{dashboardStats.followupAlerts}</div>

        <div className="stat-label">Follow-up Alerts</div>

        <div className="stat-sub">
          {dashboardStats.overdueFollowups} overdue
        </div>
      </div>

      <div className="stat-card paid-c">
        <div className="stat-num">{dashboardStats.paymentsCleared}</div>

        <div className="stat-label">Payments Cleared</div>

        <div className="stat-sub">{dashboardStats.pendingPayments} pending</div>
      </div>
    </div>
  );
}
