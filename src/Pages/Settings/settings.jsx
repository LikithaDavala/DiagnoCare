import React, { useState } from "react";
import { useLabContext } from "../../context/labContext";
import "./settings.css";

const SETTING_TABS = [
  { id: "profile", label: "User Profile", icon: "👤" },
  { id: "labInfo", label: "Laboratory Info", icon: "🏥" },
  { id: "notifs", label: "Notifications", icon: "🔔" },
  { id: "security", label: "Security & Access", icon: "🛡️" },
  { id: "system", label: "System Defaults", icon: "⚙️" }
];

function Settings() {
  const { currentUser, systemSettings, setSystemSettings } = useLabContext();
  const [activeTab, setActiveTab] = useState("profile");
  const [saveToast, setSaveToast] = useState(false);

  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    title: currentUser.title,
    email: currentUser.email,
    phone: "+91 (80) 4122-8901",
    department: "Pathology & Laboratory Medicine"
  });

  const [labInfoData, setLabInfoData] = useState({
    name: systemSettings.labName,
    npiNabl: "NABL-MED-7849/2026",
    taxId: "GSTIN29ABCDE1234F1Z5",
    director: "Dr. Admin, MD (Pathology)",
    emergencyContact: "104 / +91 98450 11223"
  });

  const [notifPreferences, setNotifPreferences] = useState({
    emailOnCritical: true,
    smsOnStat: true,
    soundAlerts: false,
    dailySummaryDigest: true
  });

  const [securityData, setSecurityData] = useState({
    twoFactorEnabled: true,
    sessionTimeoutMinutes: "30",
    enforcePasswordRotation: true,
    auditLoggingLevel: "Detailed"
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSystemSettings((prev) => ({
      ...prev,
      labName: labInfoData.name
    }));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div>
          <span className="settings-kicker">SYSTEM • ADMINISTRATION</span>
          <h1>System Configuration & Preferences</h1>
          <p>Manage user security, laboratory facility information, alert routing, and global LIS defaults.</p>
        </div>
      </div>

      {saveToast && (
        <div className="settings-toast-banner">
          ✓ Configuration preferences saved successfully!
        </div>
      )}

      <div className="settings-container-layout">
        {/* Left Vertical Tabs */}
        <aside className="settings-tabs-sidebar">
          {SETTING_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`settings-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-ico">{tab.icon}</span>
              <span className="tab-txt">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Right Settings Content */}
        <main className="settings-content-card">
          <form onSubmit={handleSave}>
            {/* Tab 1: Profile */}
            {activeTab === "profile" && (
              <div className="settings-section">
                <h3>Operator Profile & Credentials</h3>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="pName">Full Name</label>
                    <input
                      id="pName"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="pTitle">Designation</label>
                    <input
                      id="pTitle"
                      type="text"
                      value={profileData.title}
                      onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="pEmail">Email Address</label>
                    <input
                      id="pEmail"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="pDept">Department</label>
                    <input
                      id="pDept"
                      type="text"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Lab Information */}
            {activeTab === "labInfo" && (
              <div className="settings-section">
                <h3>Facility Registration & Accreditation</h3>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="labNameInput">Laboratory Name</label>
                    <input
                      id="labNameInput"
                      type="text"
                      value={labInfoData.name}
                      onChange={(e) => setLabInfoData({ ...labInfoData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="nablInput">NABL / Accreditation Certificate ID</label>
                    <input
                      id="nablInput"
                      type="text"
                      value={labInfoData.npiNabl}
                      onChange={(e) => setLabInfoData({ ...labInfoData, npiNabl: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="dirInput">Medical Director & Pathologist</label>
                    <input
                      id="dirInput"
                      type="text"
                      value={labInfoData.director}
                      onChange={(e) => setLabInfoData({ ...labInfoData, director: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="emgInput">Emergency Hotline Phone</label>
                    <input
                      id="emgInput"
                      type="text"
                      value={labInfoData.emergencyContact}
                      onChange={(e) => setLabInfoData({ ...labInfoData, emergencyContact: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Notifications */}
            {activeTab === "notifs" && (
              <div className="settings-section">
                <h3>Alert Routing & Clinical Panic Flags</h3>
                <div className="checkboxes-stack">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={notifPreferences.emailOnCritical}
                      onChange={(e) => setNotifPreferences({ ...notifPreferences, emailOnCritical: e.target.checked })}
                    />
                    <div>
                      <strong>Critical Panic Value Immediate Alert</strong>
                      <p>Send urgent notification to referring physician when parameter exceeds critical limits.</p>
                    </div>
                  </label>

                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={notifPreferences.smsOnStat}
                      onChange={(e) => setNotifPreferences({ ...notifPreferences, smsOnStat: e.target.checked })}
                    />
                    <div>
                      <strong>Urgent STAT Sample Receipt Ping</strong>
                      <p>Notify technicians immediately upon accessioning high-priority STAT specimens.</p>
                    </div>
                  </label>

                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={notifPreferences.dailySummaryDigest}
                      onChange={(e) => setNotifPreferences({ ...notifPreferences, dailySummaryDigest: e.target.checked })}
                    />
                    <div>
                      <strong>Daily TAT & Volume Performance Digest</strong>
                      <p>Compile end-of-day turnaround time and verification volume metrics.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Tab 4: Security */}
            {activeTab === "security" && (
              <div className="settings-section">
                <h3>Access Security & Audit Trails</h3>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="sessionInput">Inactivity Auto-Logout (Minutes)</label>
                    <select
                      id="sessionInput"
                      value={securityData.sessionTimeoutMinutes}
                      onChange={(e) => setSecurityData({ ...securityData, sessionTimeoutMinutes: e.target.value })}
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes (Recommended)</option>
                      <option value="60">60 Minutes</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="auditInput">Audit Logging Detail</label>
                    <select
                      id="auditInput"
                      value={securityData.auditLoggingLevel}
                      onChange={(e) => setSecurityData({ ...securityData, auditLoggingLevel: e.target.value })}
                    >
                      <option value="Standard">Standard (Logins & Releases)</option>
                      <option value="Detailed">Detailed (All Result Modifies & Views)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: System Defaults */}
            {activeTab === "system" && (
              <div className="settings-section">
                <h3>Global LIS Operational Defaults</h3>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="tatHours">TAT SLA Warning Threshold (Hours)</label>
                    <input
                      id="tatHours"
                      type="number"
                      value={systemSettings.tatWarningHours}
                      onChange={(e) => setSystemSettings({ ...systemSettings, tatWarningHours: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="dateFmt">Default Date Display Format</label>
                    <select
                      id="dateFmt"
                      value={systemSettings.dateFormat}
                      onChange={(e) => setSystemSettings({ ...systemSettings, dateFormat: e.target.value })}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (Standard UK/India)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="settings-btn-row">
              <button type="submit" className="btn-save-settings">
                Save Changes
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Settings;
