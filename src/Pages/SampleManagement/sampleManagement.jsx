import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLabContext } from "../../context/labContext";
import "./sampleManagement.css";

const STAGES = ["Collected", "Received", "Processing", "Completed"];

function SampleManagement() {
  const navigate = useNavigate();
  const { samples, updateSampleStatus } = useLabContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredSamples = samples.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.testName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStageIndex = (status) => STAGES.indexOf(status);

  const handleAdvanceStatus = (sample) => {
    const currentIdx = getStageIndex(sample.status);
    if (currentIdx < STAGES.length - 1) {
      const nextStatus = STAGES[currentIdx + 1];
      updateSampleStatus(sample.id, nextStatus);
    }
  };

  return (
    <div className="samples-page">
      <div className="samples-heading">
        <div>
          <span className="samples-kicker">MAIN • ACCESSIONING & TRACKING</span>
          <h1>Sample Management & Specimen Tracking</h1>
          <p>Real-time laboratory accessioning, chain-of-custody, and specimen lifecycle pipeline.</p>
        </div>
        <button
          type="button"
          className="btn-new-order-jump"
          onClick={() => navigate("/test-order-entry")}
        >
          + Accession New Specimen
        </button>
      </div>

      {/* Visual Workflow Pipeline Banner */}
      <div className="pipeline-overview-card">
        <h3 className="pipeline-title">Specimen Chain of Custody Pipeline</h3>
        <div className="pipeline-stepper">
          {STAGES.map((stage, idx) => {
            const count = samples.filter((s) => s.status === stage).length;
            return (
              <div key={stage} className="pipeline-step-item">
                <div className="step-circle-badge">{idx + 1}</div>
                <div className="step-text-wrap">
                  <strong>{stage}</strong>
                  <span>{count} Specimens</span>
                </div>
                {idx < STAGES.length - 1 && <span className="step-arrow">&rarr;</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Card */}
      <div className="samples-filter-bar">
        <div className="search-box">
          <span className="search-icon" aria-hidden="true">&#128269;</span>
          <input
            type="text"
            placeholder="Search by Sample Barcode (SMPL-...), Patient Name, or Test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-tabs">
          {["All", ...STAGES].map((st) => (
            <button
              key={st}
              type="button"
              className={`status-tab-btn ${statusFilter === st ? "active" : ""}`}
              onClick={() => setStatusFilter(st)}
            >
              {st} {st !== "All" && `(${samples.filter((s) => s.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Samples Table */}
      <div className="samples-table-card">
        <div className="table-wrap">
          <table className="samples-table">
            <thead>
              <tr>
                <th>Sample Barcode</th>
                <th>Patient Details</th>
                <th>Diagnostic Investigation</th>
                <th>Specimen Tube</th>
                <th>Collection Timestamp</th>
                <th>Collected By</th>
                <th>Pipeline Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-samples-td">
                    No specimen records match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSamples.map((sample) => {
                  const stageIdx = getStageIndex(sample.status);
                  const isCompleted = sample.status === "Completed";
                  return (
                    <tr key={sample.id}>
                      <td>
                        <span className="barcode-badge">{sample.id}</span>
                        <span className="order-ref-sub">{sample.orderId}</span>
                      </td>
                      <td>
                        <strong>{sample.patientName}</strong>
                        <span className="patient-id-sub">{sample.patientId}</span>
                      </td>
                      <td>
                        <span className="test-name-bold">{sample.testName}</span>
                        {sample.priority?.includes("STAT") && (
                          <span className="stat-pill">URGENT STAT</span>
                        )}
                      </td>
                      <td>
                        <span className="specimen-tag">{sample.sampleType}</span>
                      </td>
                      <td>
                        <span className="time-text">{sample.collectionTime}</span>
                      </td>
                      <td>
                        <span className="phleb-text">{sample.collectedBy}</span>
                      </td>
                      <td>
                        <div className="status-cell-wrap">
                          <span className={`status-pill-stage ${sample.status.toLowerCase()}`}>
                            {sample.status}
                          </span>
                          <div className="mini-progress-track">
                            <div
                              className="mini-progress-fill"
                              style={{ width: `${((stageIdx + 1) / STAGES.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          {!isCompleted && (
                            <button
                              type="button"
                              className="btn-advance-status"
                              onClick={() => handleAdvanceStatus(sample)}
                              title={`Advance to ${STAGES[stageIdx + 1]}`}
                            >
                              Mark {STAGES[stageIdx + 1]}
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-enter-results-sm"
                            onClick={() =>
                              navigate("/lab-value-entry", { state: { selectedOrderId: sample.orderId } })
                            }
                          >
                            Enter Results &rarr;
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SampleManagement;
