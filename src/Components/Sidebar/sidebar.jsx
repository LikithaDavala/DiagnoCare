import React from "react";
import { NavLink } from "react-router-dom";

export const navigationItems = [
  { label: "Dashboard", path: "/dashboard", icon: "#" },
  { label: "Patient registration", path: "/", icon: "+" },
  { label: "Test selection / order entry", path: "/test-order-entry", icon: "=" },
  { label: "Lab value entry", path: "/lab-value-entry", icon: "~" },
  { label: "Report history", path: "/report-history", icon: "<>" },
  { label: "Test master", path: "/test-master", icon: "T" },
  { label: "Reference range management", path: "/reference-ranges", icon: "[]" },
  { label: "User / staff management", path: "/staff-management", icon: "U" },
  { label: "Report template", path: "/report-templates", icon: "R" },
  { label: "Settings", path: "/settings", icon: "*" },
];

function Sidebar({ sidebarOpen, onClose }) {
  return (
    <>
      <aside className={`app-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="sidebar-heading">Workspace</div>
        <nav aria-label="Main navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          <NavLink
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            to="/login"
            onClick={onClose}
          >
            <span className="nav-icon">&#8594;</span>
            <span>Login screen</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" />
          <span>Care system online</span>
        </div>
      </aside>
      {sidebarOpen && (
        <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onClose} />
      )}
    </>
  );
}

export default Sidebar;
