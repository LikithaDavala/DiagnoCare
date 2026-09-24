import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLabContext } from "../../context/labContext";

function Header({ sidebarOpen, onToggleSidebar, onCloseSidebar }) {
  const { currentUser, setCurrentUser, staffUsers, notifications, markNotificationsAsRead } = useLabContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const todayFormatted = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const handleSwitchRole = (staff) => {
    setCurrentUser({
      id: staff.id,
      name: staff.name,
      role: staff.role,
      title: staff.title,
      email: staff.email,
      avatar: staff.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    });
    setShowUserMenu(false);
  };

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

      <NavLink className="brand" to="/dashboard" onClick={onCloseSidebar}>
        <span className="brand-mark">LD</span>
        <div className="brand-copy">
          <span className="brand-main">LAB DIAGNOSTICS</span>
          <span className="brand-sub">Clinical Pathology & LIS</span>
        </div>
      </NavLink>

      <div className="header-right-controls">
        {/* Date Display */}
        <div className="header-date-badge">
          <span className="calendar-icon" aria-hidden="true">📅</span>
          <span>{todayFormatted}</span>
        </div>

        {/* Notification Bell */}
        <div className="header-notification-wrap">
          <button
            type="button"
            className="btn-notification-bell"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            aria-label="Notifications"
          >
            <span className="bell-icon">🔔</span>
            {unreadCount > 0 && <span className="notification-badge-count">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown-panel">
              <div className="dropdown-header">
                <strong>System Alerts & Notifications</strong>
                {unreadCount > 0 && (
                  <button type="button" className="btn-mark-read" onClick={markNotificationsAsRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="dropdown-list">
                {notifications.length === 0 ? (
                  <div className="dropdown-empty">No active notifications.</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`dropdown-item ${notif.read ? "read" : "unread"}`}>
                      <div className={`notif-indicator ${notif.type}`} />
                      <div className="notif-content">
                        <strong>{notif.title}</strong>
                        <p>{notif.message}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="header-user-wrap">
          <button
            type="button"
            className="header-profile-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <span className="profile-avatar">{currentUser.avatar || "DA"}</span>
            <div className="profile-details-col">
              <span className="profile-name">{currentUser.name}</span>
              <span className="profile-role-badge">{currentUser.role}</span>
            </div>
            <span className="dropdown-caret">▾</span>
          </button>

          {showUserMenu && (
            <div className="user-role-dropdown-panel">
              <div className="user-dropdown-header">
                <p className="active-as-label">Signed in as</p>
                <strong>{currentUser.name}</strong>
                <span>{currentUser.title}</span>
              </div>

              <div className="role-switch-title">Switch Active Role (Demo):</div>
              <div className="role-switch-list">
                {staffUsers.map((staff) => (
                  <button
                    key={staff.id}
                    type="button"
                    className={`role-option-btn ${currentUser.id === staff.id ? "selected" : ""}`}
                    onClick={() => handleSwitchRole(staff)}
                  >
                    <div className="role-info">
                      <strong>{staff.name}</strong>
                      <span>{staff.role}</span>
                    </div>
                    {currentUser.id === staff.id && <span className="active-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
