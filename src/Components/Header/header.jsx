import React from "react";
import { NavLink } from "react-router-dom";

function Header({ sidebarOpen, onToggleSidebar, onCloseSidebar }) {
  return (
    <header className="app-header">
      <button
        className="menu-toggle"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={sidebarOpen}
        onClick={onToggleSidebar}
      >
        <span />
        <span />
        <span />
      </button>
      <NavLink className="brand" to="/" onClick={onCloseSidebar}>
        <span className="brand-mark">D</span>
        <span>DiagnoCare</span>
      </NavLink>
      <div className="header-profile" aria-label="Signed in user">
        <span className="profile-avatar">DR</span>
        <span className="profile-name">Care Portal</span>
      </div>
    </header>
  );
}

export default Header;
