import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLabContext } from "../../context/labContext";
import "./labValueEntry.css";

const LIFECYCLE_STAGES = ["Draft", "Processing", "Awaiting Verification", "Verified", "Released"];

function LabValueEntry() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    orders,
    testCatalog,
    referenceRanges,
    evaluateFlag,
    saveLabResults,
    verifyAndReleaseReport
  } = useLabContext();

  // Find initial order
  const defaultOrder =
    orders.find((o) => o.id === location.state?.selectedOrderId) ||
    orders.find((o) => o.status !== "Verified") ||
    orders[0];

  const [selectedOrderId, setSelectedOrderId] = useState(defaultOrder ? defaultOrder.id : "");
  const [paramValues, setParamValues] = useState({});
  const [remarks, setRemarks] = useState("Specimen processed on automated clinical analyzer. Quality controls valid.");
  const [pathologist, setPathologist] = useState(currentUser.name || "Dr. Preeti Menon, MD");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLockedForEditing, setIsLockedForEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || defaultOrder;

  const currentTest = currentOrder
    ? testCatalog.find((t) => t.id === currentOrder.testIds[0]) || testCatalog[0]
    : testCatalog[0];

  // Parameters pulled from Reference Ranges module for this test
  const testParameters = referenceRanges.filter(
    (r) => r.testId === currentTest.id && (r.gender === "All" || r.gender === currentOrder?.gender)
  );

  useEffect(() => {
    if (currentOrder) {
      const isVerified = currentOrder.status === "Verified" || currentOrder.status === "Released";
      setIsLockedForEditing(isVerified);

      const initialMap = {};
      testParameters.forEach((ref) => {
        const midVal = ((ref.min + ref.max) / 2).toFixed(1);
        initialMap[ref.parameterId] = midVal;
      });
      setParamValues(initialMap);
    }
  }, [selectedOrderId, currentOrder?.status, currentTest.id]);

  const handleValueChange = (paramId, val) => {
    if (isLockedForEditing) return;
    setParamValues((prev) => ({
      ...prev,
      [paramId]: val
    }));
  };

  const handleFillNormals = () => {
    if (isLockedForEditing) return;
    const normals = {};
    testParameters.forEach((p) => {
      normals[p.parameterId] = ((p.min + p.max) / 2).toFixed(1);
    });
    setParamValues(normals);
    setToastMessage("Reference normal values autofilled.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleFillAbnormalDemo = () => {
    if (isLockedForEditing) return;
    const abnormals = {};
    testParameters.forEach((p, idx) => {
      if (idx === 0) abnormals[p.parameterId] = (p.min - 1.5).toFixed(1);
      else if (idx === 1) abnormals[p.parameterId] = (p.max + (p.max > 100 ? 35 : 2.5)).toFixed(1);
      else abnormals[p.parameterId] = ((p.min + p.max) / 2).toFixed(1);
    });
    setParamValues(abnormals);
    setToastMessage("Simulated abnormal values loaded.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Save as Draft / In Processing
  const handleSaveDraft = () => {
    if (!currentOrder) return;
    saveLabResults({
      orderId: currentOrder.id,
      parameterValues: paramValues,
      interpretation: remarks,
      submitForVerification: false
    });
    setToastMessage("Results saved as In Processing draft.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Submit for Verification
  const handleSubmitForVerification = () => {
    if (!currentOrder) return;
    saveLabResults({
      orderId: currentOrder.id,
      parameterValues: paramValues,
      interpretation: remarks,
      submitForVerification: true
    });
    setToastMessage("Submitted to Pathologist for verification.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Confirm Verification & Release
  const handleConfirmVerification = () => {
    if (!currentOrder) return;
    verifyAndReleaseReport({
      orderId: currentOrder.id,
      parameterValues: paramValues,
      interpretation: remarks,
      pathologistName: pathologist
    });
    setShowConfirmModal(false);
    setIsLockedForEditing(true);
    setToastMessage("Report officially verified and released!");
    setTimeout(() => setToastMessage(""), 4000);
  };

  const currentStatus = currentOrder?.status || "Processing";
  const isVerified = currentStatus === "Verified" || currentStatus === "Released";

  return (
    <div className="results-page">
      <div className="results-page-heading">
        <div>
          <span className="results-badge">MAIN • RESULT ENTRY & VERIFICATION</span>
          <h1>Clinical Result Entry & Verification</h1>
          <p>Record observed laboratory findings against active reference intervals and authenticate reports.</p>
        </div>
      </div>

      {toastMessage && <div className="results-toast-banner">✓ {toastMessage}</div>}

      {/* Result Verification Lifecycle Stepper */}
      <div className="verification-lifecycle-card">
        <span className="lifecycle-label">Result Verification Lifecycle:</span>
        <div className="lifecycle-stepper">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            let stepState = "pending";
            if (currentStatus === stage) stepState = "current";
            else if (isVerified && (stage === "Draft" || stage === "Processing" || stage === "Awaiting Verification" || stage === "Verified")) {
              stepState = "done";
            } else if (currentStatus === "Awaiting Verification" && (stage === "Draft" || stage === "Processing")) {
              stepState = "done";
            }

            return (
              <div key={stage} className={`lifecycle-step ${stepState}`}>
                <span className="step-num">{stepState === "done" ? "✓" : idx + 1}</span>
                <span className="step-name">{stage}</span>
                {idx < LIFECYCLE_STAGES.length - 1 && <span className="step-divider">&rarr;</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sample Selector & Patient Context */}
      <div className="results-order-selector-card">
        <div className="selector-field">
          <label htmlFor="orderSelect">Active Laboratory Order / Sample:</label>
          <select
            id="orderSelect"
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
          >
            {orders.map((ord) => (
              <option key={ord.id} value={ord.id}>
                [{ord.sampleId}] {ord.patientName} ({ord.patientId}) - {ord.testIds.join(", ")} • Status: {ord.status}
              </option>
            ))}
          </select>
        </div>

        <div className="status-indicator-block">
          <span className={`order-status-pill ${currentStatus.toLowerCase().replace(/\s+/g, "-")}`}>
            Status: {currentStatus}
          </span>
          {isLockedForEditing && (
            <span className="locked-badge" title="Verified reports are locked to protect medical integrity">
              🔒 Locked (Verified)
            </span>
          )}
        </div>
      </div>

      {currentOrder && (
        <div className="patient-specimen-banner">
          <div className="banner-item">
            <span className="banner-lbl">Patient Name</span>
            <strong>{currentOrder.patientName}</strong>
            <span className="banner-sub">{currentOrder.patientId} • {currentOrder.age}y / {currentOrder.gender}</span>
          </div>
          <div className="banner-item">
            <span className="banner-lbl">Sample Barcode</span>
            <strong className="mono-sample">{currentOrder.sampleId}</strong>
            <span className="banner-sub">{currentOrder.specimen}</span>
          </div>
          <div className="banner-item">
            <span className="banner-lbl">Diagnostic Investigation</span>
            <strong className="test-hl">{currentTest.name}</strong>
            <span className="banner-sub">Dept: {currentTest.department}</span>
          </div>
          <div className="banner-item">
            <span className="banner-lbl">Referring Doctor</span>
            <strong>{currentOrder.referralDoctor}</strong>
            <span className="banner-sub">Order Date: {currentOrder.date}</span>
          </div>
        </div>
      )}

      {/* Main Parameters Entry Table */}
      <div className="parameters-card">
        <div className="parameters-card-header">
          <div>
            <h3>Configured Test Parameters & Live Reference Intervals</h3>
            <p className="sub-hint">Reference ranges are dynamically pulled from the Reference Ranges module.</p>
          </div>
          {!isLockedForEditing && (
            <div className="preset-btns">
              <button type="button" className="btn-preset-sm normal" onClick={handleFillNormals}>
                Fill Normal Values
              </button>
              <button type="button" className="btn-preset-sm abnormal" onClick={handleFillAbnormalDemo}>
                Simulate Flags
              </button>
            </div>
          )}
        </div>

        {isLockedForEditing && (
          <div className="verified-lock-notice">
            <span>ℹ️</span> This diagnostic report has been verified and released by authorized pathology staff. Parameter inputs are locked to preserve diagnostic audit trail integrity.
          </div>
        )}

        <div className="table-wrap">
          <table className="parameters-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Result Value</th>
                <th>Unit</th>
                <th>Biological Reference Range</th>
                <th>Result Status</th>
              </tr>
            </thead>
            <tbody>
              {testParameters.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-param-td">
                    No active parameters configured in Reference Ranges for this test panel.
                  </td>
                </tr>
              ) : (
                testParameters.map((param) => {
                  const currentVal = paramValues[param.parameterId] !== undefined ? paramValues[param.parameterId] : "";
                  const flag = evaluateFlag(currentVal, param);

                  let flagClass = "normal";
                  if (flag === "Low") flagClass = "low";
                  if (flag === "High") flagClass = "high";
                  if (flag === "Critical") flagClass = "critical";

                  return (
                    <tr key={param.id} className={`param-row ${flagClass}`}>
                      <td>
                        <strong>{param.parameterName}</strong>
                        {param.gender !== "All" && (
                          <span className="gender-param-tag">({param.gender})</span>
                        )}
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          disabled={isLockedForEditing}
                          value={currentVal}
                          onChange={(e) => handleValueChange(param.parameterId, e.target.value)}
                          className={`param-input ${isLockedForEditing ? "locked" : ""}`}
                          placeholder="0.0"
                        />
                      </td>
                      <td className="param-unit-text">{param.unit}</td>
                      <td className="param-range-text">
                        {param.min} – {param.max} {param.unit}
                      </td>
                      <td>
                        <span className={`status-flag-pill ${flagClass}`}>
                          {flagClass === "critical" ? "⚠️ " : ""}
                          {flag}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Clinical Remarks & Pathologist Notes */}
        <div className="remarks-authorizer-grid">
          <div className="form-group-col">
            <label htmlFor="txtRemarks">Clinical Interpretation / Pathologist Remarks</label>
            <textarea
              id="txtRemarks"
              rows="3"
              disabled={isLockedForEditing}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Clinical observation, smear description, or analytical comments..."
            />
          </div>

          <div className="form-group-col">
            <label htmlFor="txtPathologist">Authorizing Pathologist / Reviewer</label>
            <input
              id="txtPathologist"
              type="text"
              disabled={isLockedForEditing}
              value={pathologist}
              onChange={(e) => setPathologist(e.target.value)}
            />
            <span className="field-sub-note">Must be an authorized medical reviewer</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="results-actions-bar">
          {!isLockedForEditing ? (
            <>
              <button type="button" className="btn-save-draft" onClick={handleSaveDraft}>
                💾 Save Draft
              </button>
              <button
                type="button"
                className="btn-submit-verification"
                onClick={handleSubmitForVerification}
              >
                ⏳ Submit for Verification
              </button>
              <button
                type="button"
                className="btn-authorize-verify"
                onClick={() => setShowConfirmModal(true)}
              >
                ✓ Authorize & Verify Report
              </button>
            </>
          ) : (
            <div className="verified-actions-row">
              <span className="verified-msg">✓ Report officially verified and ready for release.</span>
              <button
                type="button"
                className="btn-open-report-view"
                onClick={() => navigate("/report-history")}
              >
                Open Official Report Sheet & PDF &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal before Verification */}
      {showConfirmModal && (
        <div className="confirm-modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon">⚠️</div>
            <h3>Authorize & Verify Diagnostic Report?</h3>
            <p>
              You are authorizing official clinical test results for <strong>{currentOrder?.patientName}</strong> ({currentOrder?.patientId}), Sample <strong>{currentOrder?.sampleId}</strong>.
            </p>
            <p className="confirm-disclaimer">
              Once verified, the report will be digitally signed by <strong>{pathologist}</strong> and archived as an official medical legal document.
            </p>
            <div className="confirm-buttons">
              <button
                type="button"
                className="btn-cancel-modal"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel / Return
              </button>
              <button
                type="button"
                className="btn-confirm-release"
                onClick={handleConfirmVerification}
              >
                Yes, Authorize & Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabValueEntry;
