import React, { useState } from "react";
import { useLabContext } from "../../context/labContext";
import "./staffManagement.css";

const ROLE_PERMISSIONS_MAP = {
  "Admin": [
    "Full System Access & Master Configuration",
    "Manage Staff Accounts & Security",
    "View Global Audit Logs & Analytics",
    "Override Report Verification & Access Controls"
  ],
  "Receptionist": [
    "Patient Registration & Demographics Intake",
    "Diagnostic Test Orders & Accessioning",
    "Billing & Investigation Fee Calculation",
    "Search & Dispatch Released Reports"
  ],
  "Lab Technician": [
    "Sample Tracking & Barcode Receipt",
    "Analytical Testing & Result Value Entry",
    "Draft Test Finding Summaries",
    "Autofill Quality Baseline Normal Controls"
  ],
  "Pathologist / Authorized Reviewer": [
    "Clinical Smear & Findings Review",
    "Microscopy & Diagnostic Interpretation",
    "Authorize & Verify Diagnostic Reports",
    "Sign-off & Digital Stamp Authentication"
  ]
};

function StaffManagement() {
  const { staffUsers, currentUser, setCurrentUser } = useLabContext();
  const [selectedRoleTab, setSelectedRoleTab] = useState("All");

  const filteredStaff = staffUsers.filter(
    (u) => selectedRoleTab === "All" || u.role.includes(selectedRoleTab)
  );

  const handleSwitchActiveUser = (staff) => {
    setCurrentUser({
      id: staff.id,
      name: staff.name,
      role: staff.role,
      title: staff.title,
      email: staff.email,
      avatar: staff.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    });
  };

  return (
    <div className="staff-page">
      <div className="staff-heading">
        <div>
          <span className="staff-kicker">MANAGEMENT • ACCESS CONTROL</span>
          <h1>Staff & User Management</h1>
          <p>Role-based access authorization, laboratory personnel directories, and clinical permissions.</p>
        </div>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="permissions-matrix-card">
        <h3>Role Access & Permissions Matrix</h3>
        <div className="roles-grid">
          {Object.entries(ROLE_PERMISSIONS_MAP).map(([roleName, perms]) => (
            <div key={roleName} className="role-spec-card">
              <div className="role-spec-header">
                <span className="role-spec-title">{roleName}</span>
              </div>
              <ul className="perms-list">
                {perms.map((p, i) => (
                  <li key={i}>
                    <span className="check-mark">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="staff-table-card">
        <div className="card-top-bar">
          <h3>Laboratory Personnel Directory ({staffUsers.length})</h3>
          <div className="role-filters">
            {["All", "Admin", "Receptionist", "Technician", "Pathologist"].map((r) => (
              <button
                key={r}
                type="button"
                className={`btn-role-tab ${selectedRoleTab === r ? "active" : ""}`}
                onClick={() => setSelectedRoleTab(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Staff Name</th>
                <th>Assigned Role</th>
                <th>Department</th>
                <th>Official Email</th>
                <th>System Status</th>
                <th>Active Session</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => {
                const isCurrent = currentUser.id === staff.id;
                return (
                  <tr key={staff.id} className={isCurrent ? "current-user-row" : ""}>
                    <td>
                      <span className="staff-id-badge">{staff.id}</span>
                    </td>
                    <td>
                      <div className="user-name-cell">
                        <div className="mini-avatar">{staff.name[0]}</div>
                        <div>
                          <strong>{staff.name}</strong>
                          <span className="user-title-sub">{staff.title}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="role-badge">{staff.role}</span>
                    </td>
                    <td>{staff.department}</td>
                    <td>{staff.email}</td>
                    <td>
                      <span className="status-pill active">Active</span>
                    </td>
                    <td>
                      {isCurrent ? (
                        <span className="active-session-tag">Current Active User</span>
                      ) : (
                        <button
                          type="button"
                          className="btn-switch-user"
                          onClick={() => handleSwitchActiveUser(staff)}
                        >
                          Switch to User
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffManagement;
