import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLabContext } from "../../context/labContext";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, getStats, getRecentReports, orders, samples, reports } = useLabContext();
  const [searchQuery, setSearchQuery] = useState("");

  const stats = getStats();
  const allRecent = getRecentReports();

  // Filter recent reports by global search query
  const filteredReports = allRecent.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.patient.toLowerCase().includes(q) ||
      r.test.toLowerCase().includes(q)
    );
  });

  // Daily Activity Data (Last 7 Days)
  const dailyActivity = [
    { day: "Mon", count: 88, height: 60 },
    { day: "Tue", count: 94, height: 65 },
    { day: "Wed", count: 112, height: 80 },
    { day: "Thu", count: 105, height: 75 },
    { day: "Fri", count: 126, height: 95 },
    { day: "Sat", count: 98, height: 70 },
    { day: "Sun", count: 64, height: 45 }
  ];

  // Status breakdown calculations
  const totalReportsCount = reports.length + orders.length;
  const verifiedCount = reports.length;
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const pendingCount = orders.filter((o) => o.status === "Awaiting Verification" || o.status === "Pending Entry").length;

  const verifiedPercent = Math.round((verifiedCount / (totalReportsCount || 1)) * 100);
  const processingPercent = Math.round((processingCount / (totalReportsCount || 1)) * 100);
  const pendingPercent = 100 - verifiedPercent - processingPercent;

  return (
    <section className="dashboard-page">
      {/* Header Banner */}
      <div className="dashboard-hero">
        <div className="hero-copy">
          <h1>Good Morning, {currentUser.name} 👋</h1>
          <p className="hero-subtitle">Here&apos;s today&apos;s laboratory overview.</p>
        </div>

        {/* Global Search Field */}
        <div className="hero-search-wrap">
          <span className="hero-search-icon" aria-hidden="true">&#128269;</span>
          <input
            type="text"
            placeholder="Search patient, report, sample ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="btn-clear-hero-search" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="stat-cards-grid">
        <article
          className="stat-card"
          onClick={() => navigate("/patient-registration")}
          title="Go to Patients"
        >
          <div className="stat-card-top">
            <span className="stat-title">Total Patients</span>
            <div className="stat-icon-wrap blue">👥</div>
          </div>
          <div className="stat-value">{stats.totalPatients}</div>
          <div className="stat-footer-trend positive">
            <span className="trend-arrow">&uarr; +12%</span>
            <span className="trend-sub">vs last month</span>
          </div>
        </article>

        <article
          className="stat-card"
          onClick={() => navigate("/samples")}
          title="Go to Samples"
        >
          <div className="stat-card-top">
            <span className="stat-title">Today&apos;s Samples</span>
            <div className="stat-icon-wrap cyan">🧪</div>
          </div>
          <div className="stat-value">{stats.todaySamples}</div>
          <div className="stat-footer-trend neutral">
            <span className="trend-dot" />
            <span className="trend-sub">{samples.filter((s) => s.status === "Processing").length + 28} currently in processing</span>
          </div>
        </article>

        <article
          className="stat-card"
          onClick={() => navigate("/lab-value-entry")}
          title="Go to Result Entry"
        >
          <div className="stat-card-top">
            <span className="stat-title">Pending Reports</span>
            <div className="stat-icon-wrap amber">⏳</div>
          </div>
          <div className="stat-value">{stats.pendingReports}</div>
          <div className="stat-footer-trend warning">
            <span className="trend-arrow">!</span>
            <span className="trend-sub">5 urgent STAT priority</span>
          </div>
        </article>

        <article
          className="stat-card"
          onClick={() => navigate("/report-history")}
          title="Go to Reports"
        >
          <div className="stat-card-top">
            <span className="stat-title">Completed Reports</span>
            <div className="stat-icon-wrap green">✓</div>
          </div>
          <div className="stat-value">{stats.completedReports}</div>
          <div className="stat-footer-trend positive">
            <span className="trend-arrow">&uarr;</span>
            <span className="trend-sub">98.4% on-time TAT rate</span>
          </div>
        </article>
      </div>

      {/* Quick Actions Bar */}
      <div className="quick-actions-card">
        <span className="quick-actions-label">Quick Actions:</span>
        <div className="quick-actions-group">
          <button
            type="button"
            className="btn-quick-action primary"
            onClick={() => navigate("/patient-registration")}
          >
            + Register Patient
          </button>
          <button
            type="button"
            className="btn-quick-action"
            onClick={() => navigate("/test-order-entry")}
          >
            + Create Test Order
          </button>
          <button
            type="button"
            className="btn-quick-action"
            onClick={() => navigate("/lab-value-entry")}
          >
            + Enter Results
          </button>
          <button
            type="button"
            className="btn-quick-action outline"
            onClick={() => navigate("/report-history")}
          >
            View Pending Reports &rarr;
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts-grid">
        {/* Chart 1: Daily Test Activity */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Daily Test Activity</h3>
              <p>Specimens accessioned over the past 7 days</p>
            </div>
            <span className="chart-badge">Weekly Trend</span>
          </div>
          <div className="bar-chart-visual">
            {dailyActivity.map((item) => (
              <div key={item.day} className="bar-column">
                <span className="bar-value-tooltip">{item.count}</span>
                <div className="bar-pillar-wrap">
                  <div
                    className={`bar-pillar ${item.day === "Fri" ? "peak" : ""}`}
                    style={{ height: `${item.height}%` }}
                  />
                </div>
                <span className="bar-day-label">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Report Status Breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Report Status Distribution</h3>
              <p>Active orders and verified diagnostic reports</p>
            </div>
            <span className="chart-badge">Live Status</span>
          </div>
          <div className="status-bars-visual">
            <div className="multi-progress-bar">
              <div
                className="progress-slice verified"
                style={{ width: `${Math.max(verifiedPercent, 15)}%` }}
                title={`Completed / Verified: ${verifiedPercent}%`}
              />
              <div
                className="progress-slice processing"
                style={{ width: `${Math.max(processingPercent, 20)}%` }}
                title={`Processing: ${processingPercent}%`}
              />
              <div
                className="progress-slice pending"
                style={{ width: `${Math.max(pendingPercent, 10)}%` }}
                title={`Pending: ${pendingPercent}%`}
              />
            </div>

            <div className="status-legend-grid">
              <div className="legend-item">
                <span className="legend-dot verified" />
                <div className="legend-text">
                  <strong>Completed / Verified</strong>
                  <span>{reports.length + 105} Reports</span>
                </div>
              </div>
              <div className="legend-item">
                <span className="legend-dot processing" />
                <div className="legend-text">
                  <strong>Processing</strong>
                  <span>{processingCount + 14} Samples</span>
                </div>
              </div>
              <div className="legend-item">
                <span className="legend-dot pending" />
                <div className="legend-text">
                  <strong>Pending Review</strong>
                  <span>{pendingCount + 5} Awaiting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <section className="reports-panel">
        <div className="reports-header">
          <div>
            <h2>Recent Reports</h2>
            <p>Latest patient reports, testing status, and authorization logs.</p>
          </div>
          <NavLink className="view-all-link" to="/report-history">
            View all <span aria-hidden="true">&#8594;</span>
          </NavLink>
        </div>

        <div className="reports-table-wrap">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Patient</th>
                <th>Test</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.slice(0, 5).map((row) => {
                const statusStr = row.status || "Processing";
                let badgeClass = "pending";
                if (statusStr === "Verified" || statusStr === "Completed") badgeClass = "completed";
                if (statusStr === "Processing") badgeClass = "processing";

                return (
                  <tr key={row.id}>
                    <td className="report-id-cell">{row.id}</td>
                    <td>
                      <strong>{row.patient}</strong>
                      {row.patientId && <span className="sub-cell-text">{row.patientId}</span>}
                    </td>
                    <td>{row.test}</td>
                    <td>{row.date}</td>
                    <td>
                      <span className={`report-status-badge ${badgeClass}`}>
                        {statusStr === "Verified" ? "✓ Verified" : statusStr}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-table-view-sm"
                        onClick={() => navigate("/report-history")}
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default Dashboard;
