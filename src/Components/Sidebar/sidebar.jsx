import React from "react";
import { NavLink } from "react-router-dom";

export const navigationSections = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: "📊" },
      { label: "Patients", path: "/patient-registration", icon: "👥" },
      { label: "Test Orders", path: "/test-order-entry", icon: "📋" },
      { label: "Samples", path: "/samples", icon: "🧪" },
      { label: "Results", path: "/lab-value-entry", icon: "🔬" },
      { label: "Reports", path: "/report-history", icon: "📄" },
    ]
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Test Master", path: "/test-master", icon: "📑" },
      { label: "Reference Ranges", path: "/reference-ranges", icon: "📐" },
      { label: "Staff & Users", path: "/staff-management", icon: "👤" },
    ]
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Report Templates", path: "/report-templates", icon: "📝" },
      { label: "Settings", path: "/settings", icon: "⚙️" },
    ]
  }
];

function Sidebar({ sidebarOpen, onClose }) {
  return (
    <>
      <aside className={`app-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="sidebar-brand-top">
          <span className="brand-logo-pill">LAB</span>
          <div>
            <div className="brand-title">DIAGNOCARE</div>
            <div className="brand-subtitle">Diagnostics LIS v2.6</div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigationSections.map((section) => (
            <div key={section.title} className="nav-section-group">
              <div className="sidebar-section-title">{section.title}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                  to={item.path}
                  onClick={onClose}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}

          <div className="nav-section-group" style={{ marginTop: "12px" }}>
            <NavLink
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
              to="/login"
              onClick={onClose}
            >
              <span className="nav-icon">🚪</span>
              <span className="nav-label">Logout / Switch</span>
            </NavLink>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="system-indicator">
            <span className="status-dot-pulse" />
            <div className="footer-system-text">
              <strong>LIS Core Online</strong>
              <span>NABL Lab Verified</span>
            </div>
          </div>
        </div>
      </aside>
      {sidebarOpen && (
        <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onClose} />
      )}
    </>
  );
}

export default Sidebar;
