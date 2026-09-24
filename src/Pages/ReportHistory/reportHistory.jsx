import React, { useState } from "react";
import { useLabContext } from "../../context/labContext";
import "./reportHistory.css";

function ReportHistory() {
  const { reports, testCatalog, reportTemplateSettings } = useLabContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestFilter, setSelectedTestFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = reports.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      r.id.toLowerCase().includes(term) ||
      r.patientName.toLowerCase().includes(term) ||
      r.patientId.toLowerCase().includes(term) ||
      r.sampleId.toLowerCase().includes(term) ||
      r.testName.toLowerCase().includes(term);

    const matchesTest = selectedTestFilter === "All" || r.testName.includes(selectedTestFilter);
    const matchesStatus = selectedStatusFilter === "All" || r.status === selectedStatusFilter;

    return matchesSearch && matchesTest && matchesStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdfSimulation = () => {
    window.print();
  };

  return (
    <div className="report-history-page">
      <div className="history-heading">
        <div>
          <span className="history-badge">MAIN • REPORTS & ARCHIVAL</span>
          <h1>Diagnostic Reports Directory</h1>
          <p>Search, review, authenticate, and print verified patient laboratory diagnostic reports.</p>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="history-controls-card">
        <div className="search-input-wrap">
          <span className="search-icon" aria-hidden="true">&#128269;</span>
          <input
            type="text"
            placeholder="Search by Report ID (RPT-2026-...), Patient Name, PID, or Sample Barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button type="button" className="btn-clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-dropdowns">
          <div className="dropdown-item-wrap">
            <label htmlFor="testFilter">Test:</label>
            <select
              id="testFilter"
              value={selectedTestFilter}
              onChange={(e) => setSelectedTestFilter(e.target.value)}
            >
              <option value="All">All Tests</option>
              {testCatalog.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-item-wrap">
            <label htmlFor="statusFilter">Status:</label>
            <select
              id="statusFilter"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
            </select>
          </div>
        </div>

        <div className="reports-counter-pill">
          Showing <strong>{filteredReports.length}</strong> of {reports.length} Reports
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-history-table-card">
        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Patient Details</th>
                <th>Test Investigation</th>
                <th>Sample Barcode</th>
                <th>Reporting Date</th>
                <th>Authorized Pathologist</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-message">
                    No verified diagnostic reports match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((rpt) => (
                  <tr key={rpt.id}>
                    <td>
                      <span className="rpt-id-badge">{rpt.id}</span>
                    </td>
                    <td>
                      <strong className="patient-strong">{rpt.patientName}</strong>
                      <span className="patient-sub-info">
                        {rpt.patientId} • {rpt.age}y/{rpt.gender ? rpt.gender[0] : "A"}
                      </span>
                    </td>
                    <td>
                      <span className="test-name-bold">{rpt.testName}</span>
                      <span className="dept-sub-info">{rpt.department}</span>
                    </td>
                    <td>
                      <span className="sample-barcode-tag">{rpt.sampleId}</span>
                    </td>
                    <td>{rpt.date}</td>
                    <td>
                      <span className="doctor-sub">{rpt.pathologist}</span>
                    </td>
                    <td>
                      <span className="status-badge-verified">✓ Verified</span>
                    </td>
                    <td>
                      <div className="actions-cell-flex">
                        <button
                          type="button"
                          className="btn-view-official"
                          onClick={() => setSelectedReport(rpt)}
                          title="View Official Report"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="btn-print-table-icon"
                          onClick={() => {
                            setSelectedReport(rpt);
                            setTimeout(() => window.print(), 300);
                          }}
                          title="Print Report"
                        >
                          🖨️
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

      {/* Official Medical Lab Report Modal */}
      {selectedReport && (
        <div className="report-modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="report-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Controls (Hidden in Print) */}
            <div className="modal-toolbar no-print">
              <span className="toolbar-title">Official Medical Diagnostic Report Preview</span>
              <div className="toolbar-actions">
                <button type="button" className="btn-print-report" onClick={handlePrint}>
                  🖨️ Print Report
                </button>
                <button
                  type="button"
                  className="btn-download-pdf"
                  onClick={handleDownloadPdfSimulation}
                >
                  📥 Download PDF
                </button>
                <button
                  type="button"
                  className="btn-close-modal"
                  onClick={() => setSelectedReport(null)}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Printable Clinical Sheet */}
            <div className="printable-report-sheet" id="printableLabReport">
              {/* Header */}
              <div className="sheet-header">
                <div className="sheet-brand">
                  <div className="sheet-logo-mark">LD</div>
                  <div>
                    <h1>{reportTemplateSettings.labName}</h1>
                    <p className="sheet-tagline">{reportTemplateSettings.tagline}</p>
                    <p className="sheet-accreditation">{reportTemplateSettings.accreditations}</p>
                  </div>
                </div>
                <div className="sheet-contact">
                  <p>{reportTemplateSettings.address}</p>
                  <p>{reportTemplateSettings.phone}</p>
                  <p>{reportTemplateSettings.email} | {reportTemplateSettings.website}</p>
                </div>
              </div>

              <div className="sheet-divider" />

              {/* Patient and Sample Demographics Box */}
              <div className="sheet-demographics-grid">
                <div className="demo-box-col">
                  <div className="demo-field">
                    <span>Patient Name:</span>
                    <strong>{selectedReport.patientName}</strong>
                  </div>
                  <div className="demo-field">
                    <span>Patient ID (PID):</span>
                    <strong>{selectedReport.patientId}</strong>
                  </div>
                  <div className="demo-field">
                    <span>Age / Gender:</span>
                    <strong>{selectedReport.age} Years / {selectedReport.gender}</strong>
                  </div>
                  <div className="demo-field">
                    <span>Ref By Doctor:</span>
                    <strong>{selectedReport.referralDoctor || "Self / Walk-in"}</strong>
                  </div>
                </div>

                <div className="demo-box-col">
                  <div className="demo-field">
                    <span>Report ID:</span>
                    <strong>{selectedReport.id}</strong>
                  </div>
                  <div className="demo-field">
                    <span>Sample Barcode:</span>
                    <strong className="barcode-mono">{selectedReport.sampleId}</strong>
                  </div>
                  <div className="demo-field">
                    <span>Collection Date:</span>
                    <strong>{selectedReport.date}</strong>
                  </div>
                  <div className="demo-field">
                    <span>Verification Date:</span>
                    <strong>{selectedReport.verificationDate || selectedReport.date}</strong>
                  </div>
                </div>
              </div>

              {/* Investigation Header */}
              <div className="investigation-title-bar">
                <h2>{selectedReport.testName.toUpperCase()}</h2>
                <span className="dept-tag-print">DEPARTMENT OF {selectedReport.department?.toUpperCase() || "PATHOLOGY"}</span>
              </div>

              {/* Test Parameters Findings Table */}
              <table className="sheet-findings-table">
                <thead>
                  <tr>
                    <th style={{ width: "38%" }}>Test Parameter</th>
                    <th style={{ width: "20%" }}>Observed Result</th>
                    <th style={{ width: "16%" }}>Units</th>
                    <th style={{ width: "26%" }}>Biological Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReport.parameters.map((p, index) => {
                    const isAbnormal = p.flag !== "Normal";
                    return (
                      <tr key={index} className={isAbnormal ? "abnormal-row" : ""}>
                        <td className="param-title">{p.name}</td>
                        <td className="param-val">
                          <strong>{p.value}</strong>
                          {isAbnormal && (
                            <span className={`print-flag ${p.flag.toLowerCase().replace(/\s+/g, "-")}`}>
                              [{p.flag.toUpperCase()}]
                            </span>
                          )}
                        </td>
                        <td className="param-unit">{p.unit}</td>
                        <td className="param-ref">
                          {p.min} – {p.max} {p.unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Interpretation & Remarks */}
              <div className="sheet-interpretation-box">
                <h4>CLINICAL INTERPRETATION & DIAGNOSTIC OBSERVATIONS:</h4>
                <p>{selectedReport.interpretation}</p>
                <p className="smear-footnote">
                  * {reportTemplateSettings.disclaimer}
                </p>
              </div>

              {/* Signatures & QR Verification */}
              <div className="sheet-footer-signatures">
                <div className="qr-verification-block">
                  <div className="qr-visual-box">
                    <div className="fake-qr-code">
                      <span className="qr-cell tl" />
                      <span className="qr-cell tr" />
                      <span className="qr-cell bl" />
                      <span className="qr-text">VERIFIED</span>
                    </div>
                  </div>
                  <div className="qr-label">
                    <span>Scan to verify digital authenticity</span>
                    <strong>report.diagnocare.org/v/{selectedReport.id}</strong>
                  </div>
                </div>

                <div className="signature-block">
                  {reportTemplateSettings.showDoctorSeal && (
                    <div className="signature-stamp">
                      <span className="stamp-seal">DIAGNOCARE • AUTHENTICATED</span>
                      <span className="signature-sign">Preeti Menon</span>
                    </div>
                  )}
                  <strong>{selectedReport.pathologist}</strong>
                  <span>Consultant Pathologist, MD</span>
                  <span className="reg-no">Reg. No: KMC-74921</span>
                </div>
              </div>

              {/* End of Report Bar */}
              <div className="sheet-end-bar">
                <span>*** END OF OFFICIAL LABORATORY DIAGNOSTIC REPORT ***</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportHistory;
