import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLabContext } from "../../context/labContext";
import RegistrationForm from "../RegistrationForm/registrationForm";
import "./patientRegistration.css";

function PatientRegistration() {
  const navigate = useNavigate();
  const { patients } = useLabContext();
  const [activeTab, setActiveTab] = useState("list"); // "list" or "new"
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [sortField, setSortField] = useState("name"); // "name", "id", "lastVisit"
  const [selectedPatientModal, setSelectedPatientModal] = useState(null);

  // Filter and sort patients
  const filteredPatients = patients
    .filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        p.fullName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q) ||
        p.mobile?.toLowerCase().includes(q);

      const matchesGender = genderFilter === "All" || p.gender === genderFilter;
      return matchesSearch && matchesGender;
    })
    .sort((a, b) => {
      if (sortField === "name") return a.fullName.localeCompare(b.fullName);
      if (sortField === "id") return b.id.localeCompare(a.id);
      return 0;
    });

  return (
    <div className="patients-page-container">
      {/* Page Title & Tab Navigation */}
      <div className="patients-header-bar">
        <div>
          <span className="patients-kicker">MAIN • PATIENT MANAGEMENT</span>
          <h1>Patient Management & Registry</h1>
          <p>Register outpatients/inpatients, access records, and initiate diagnostic test orders.</p>
        </div>

        <div className="patients-tab-switch">
          <button
            type="button"
            className={`tab-switch-btn ${activeTab === "list" ? "active" : ""}`}
            onClick={() => setActiveTab("list")}
          >
            👥 Patient Directory ({patients.length})
          </button>
          <button
            type="button"
            className={`tab-switch-btn ${activeTab === "new" ? "active" : ""}`}
            onClick={() => setActiveTab("new")}
          >
            + New Patient Intake
          </button>
        </div>
      </div>

      {activeTab === "new" ? (
        <RegistrationForm onComplete={() => setActiveTab("list")} />
      ) : (
        <div className="patient-directory-view">
          {/* Search, Filter, Sort Toolbar */}
          <div className="directory-toolbar-card">
            <div className="search-bar-wrap">
              <span className="search-icon" aria-hidden="true">&#128269;</span>
              <input
                type="text"
                placeholder="Search patient by Name, Patient ID (LAB-2026-...), or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button type="button" className="btn-clear-search" onClick={() => setSearchTerm("")}>
                  ✕
                </button>
              )}
            </div>

            <div className="filter-controls-group">
              <div className="filter-item">
                <label htmlFor="genderFilter">Gender:</label>
                <select
                  id="genderFilter"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="filter-item">
                <label htmlFor="sortField">Sort By:</label>
                <select
                  id="sortField"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="name">Patient Name (A-Z)</option>
                  <option value="id">Latest Registered (ID)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Patient Directory Table */}
          <div className="patients-table-card">
            <div className="table-wrap">
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Age / Gender</th>
                    <th>Contact Phone</th>
                    <th>Last Visit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-table-cell">
                        No registered patients found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <span className="patient-id-badge">{p.id}</span>
                        </td>
                        <td>
                          <strong className="patient-name-text">{p.fullName}</strong>
                          {p.bloodGroup && (
                            <span className="blood-badge">{p.bloodGroup}</span>
                          )}
                        </td>
                        <td>{p.age} Yrs / {p.gender}</td>
                        <td>{p.phone || p.mobile || "—"}</td>
                        <td>{p.lastVisit || "Recent"}</td>
                        <td>
                          <span className="patient-status-pill active">Active</span>
                        </td>
                        <td>
                          <div className="patient-action-buttons">
                            <button
                              type="button"
                              className="btn-pat-action view"
                              onClick={() => setSelectedPatientModal(p)}
                              title="View Patient Profile"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="btn-pat-action order"
                              onClick={() =>
                                navigate("/test-order-entry", { state: { selectedPid: p.id } })
                              }
                              title="Order Diagnostic Tests"
                            >
                              + Order Test
                            </button>
                            <button
                              type="button"
                              className="btn-pat-action reports"
                              onClick={() => navigate("/report-history")}
                              title="View Past Reports"
                            >
                              Reports
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatientModal && (
        <div className="patient-modal-backdrop" onClick={() => setSelectedPatientModal(null)}>
          <div className="patient-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Patient Clinical Dossier</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setSelectedPatientModal(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="patient-bio-header">
                <div className="avatar-big">{selectedPatientModal.gender === "Female" ? "F" : "M"}</div>
                <div>
                  <h2>{selectedPatientModal.fullName}</h2>
                  <p className="bio-sub">
                    {selectedPatientModal.id} • {selectedPatientModal.age} Years • {selectedPatientModal.gender} • Blood Group: {selectedPatientModal.bloodGroup || "O+"}
                  </p>
                </div>
              </div>

              <div className="patient-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Contact Phone:</span>
                  <strong>{selectedPatientModal.phone || selectedPatientModal.mobile}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email Address:</span>
                  <strong>{selectedPatientModal.email || "patient@example.com"}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date of Birth:</span>
                  <strong>{selectedPatientModal.dob || "1990-01-01"}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Residential Address:</span>
                  <strong>{selectedPatientModal.address || "Medical Enclave, Bangalore"}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Referring Physician:</span>
                  <strong>{selectedPatientModal.referralDoctor || "Self / OPD Walk-in"}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hospital / Clinic:</span>
                  <strong>{selectedPatientModal.hospitalClinic || "Apollo City OPD"}</strong>
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-modal-order"
                  onClick={() => {
                    navigate("/test-order-entry", { state: { selectedPid: selectedPatientModal.id } });
                    setSelectedPatientModal(null);
                  }}
                >
                  Create New Test Order for {selectedPatientModal.fullName} &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientRegistration;
