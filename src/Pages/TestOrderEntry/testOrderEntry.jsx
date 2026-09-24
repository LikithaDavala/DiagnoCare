import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLabContext } from "../../context/labContext";
import "./testOrderEntry.css";

function TestOrderEntry() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patients, orders, testCatalog, createOrder } = useLabContext();

  // Pick patient from state if passed from registration, or default to first patient
  const initialPid = location.state?.selectedPid || (patients[0] ? patients[0].id : "");
  const [selectedPatientId, setSelectedPatientId] = useState(initialPid);
  const [selectedTestIds, setSelectedTestIds] = useState(["CBC"]);
  const [specimenType, setSpecimenType] = useState("EDTA Whole Blood");
  const [priority, setPriority] = useState("Routine");
  const [prescribingDoctor, setPrescribingDoctor] = useState("Dr. Suresh Varma, MD");
  const [createdOrderNotice, setCreatedOrderNotice] = useState(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const toggleTest = (testId) => {
    setSelectedTestIds((prev) => {
      if (prev.includes(testId)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((id) => id !== testId);
      } else {
        return [...prev, testId];
      }
    });
  };

  const selectedTests = testCatalog.filter((t) => selectedTestIds.includes(t.id));
  const totalAmount = selectedTests.reduce((sum, t) => sum + t.price, 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert("Please select a valid registered patient.");
      return;
    }

    const newOrder = createOrder({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      age: selectedPatient.age,
      gender: selectedPatient.gender,
      referralDoctor: prescribingDoctor || selectedPatient.referralDoctor,
      testIds: selectedTestIds,
      specimen: specimenType,
      priority
    });

    setCreatedOrderNotice(newOrder);
  };

  return (
    <div className="test-order-page">
      <div className="order-page-heading">
        <div>
          <span className="order-badge">MAIN • TEST ORDERS</span>
          <h1>Diagnostic Test Selection & Order Entry</h1>
          <p>Accession specimens, prescribe diagnostic panels, and generate sample barcodes.</p>
        </div>
      </div>

      {createdOrderNotice && (
        <div className="order-success-alert">
          <div className="alert-badge">✓ ORDER CREATED</div>
          <div className="alert-content">
            <h3>Sample Barcode Generated: <strong>{createdOrderNotice.sampleId}</strong></h3>
            <p>
              Order <strong>{createdOrderNotice.id}</strong> accessioned for <strong>{createdOrderNotice.patientName}</strong> ({createdOrderNotice.patientId}).
            </p>
          </div>
          <button
            type="button"
            className="btn-go-values"
            onClick={() => navigate("/lab-value-entry", { state: { selectedOrderId: createdOrderNotice.id } })}
          >
            Enter Lab Values Now &rarr;
          </button>
        </div>
      )}

      <form className="order-form-layout" onSubmit={handlePlaceOrder}>
        {/* Left Column: Patient & Tests */}
        <div className="order-main-col">
          {/* Section 1: Select Patient */}
          <div className="order-section-card">
            <h2 className="section-title">1. Patient Identification</h2>
            <div className="patient-select-row">
              <label htmlFor="patientSelect">Select Registered Patient</label>
              <select
                id="patientSelect"
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  const pt = patients.find((p) => p.id === e.target.value);
                  if (pt && pt.referralDoctor) {
                    setPrescribingDoctor(pt.referralDoctor);
                  }
                }}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.id}) - {p.age} yrs, {p.gender}
                  </option>
                ))}
              </select>
            </div>

            {selectedPatient && (
              <div className="patient-demographics-preview">
                <div className="demographic-item">
                  <span className="demo-label">Patient ID</span>
                  <strong>{selectedPatient.id}</strong>
                </div>
                <div className="demographic-item">
                  <span className="demo-label">Age / Gender</span>
                  <strong>{selectedPatient.age} Yrs / {selectedPatient.gender}</strong>
                </div>
                <div className="demographic-item">
                  <span className="demo-label">Mobile</span>
                  <strong>{selectedPatient.mobile}</strong>
                </div>
                <div className="demographic-item">
                  <span className="demo-label">Blood Group</span>
                  <strong>{selectedPatient.bloodGroup || "O+"}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Select Tests */}
          <div className="order-section-card">
            <div className="tests-header-line">
              <h2 className="section-title">2. Select Diagnostic Test Panels</h2>
              <span className="selected-counter">{selectedTestIds.length} Selected</span>
            </div>
            <div className="test-cards-grid">
              {testCatalog.map((test) => {
                const isSelected = selectedTestIds.includes(test.id);
                return (
                  <div
                    key={test.id}
                    className={`test-picker-card ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleTest(test.id)}
                  >
                    <div className="card-top">
                      <div className="test-code-dept">
                        <span className="test-code-badge">{test.code}</span>
                        <span className="dept-tag">{test.department}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        aria-label={`Select ${test.name}`}
                      />
                    </div>
                    <h4>{test.name}</h4>
                    <p className="test-meta">
                      Specimen: <span>{test.specimen}</span>
                    </p>
                    <div className="card-bottom">
                      <span className="test-tat">TAT: {test.tat} • <strong style={{ color: "#25824e" }}>Active</strong></span>
                      <span className="test-price">₹{test.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Specimen Accessioning & Summary */}
        <div className="order-side-col">
          <div className="order-summary-card">
            <h2 className="section-title">3. Accession & Summary</h2>

            <div className="side-group">
              <label htmlFor="specimenSelect">Specimen Tube</label>
              <select
                id="specimenSelect"
                value={specimenType}
                onChange={(e) => setSpecimenType(e.target.value)}
              >
                <option value="EDTA Whole Blood">EDTA Whole Blood (Lavender Top)</option>
                <option value="Serum">Serum / Plain (Red/Gold Top)</option>
                <option value="Sodium Fluoride Blood">Sodium Fluoride (Grey Top)</option>
                <option value="Heparin Plasma">Heparin Plasma (Green Top)</option>
                <option value="Spot Urine">Clean-Catch Spot Urine</option>
              </select>
            </div>

            <div className="side-group">
              <label htmlFor="prioritySelect">Clinical Priority</label>
              <select
                id="prioritySelect"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Routine">Routine Order (Standard TAT)</option>
                <option value="Urgent (STAT)">Emergency / STAT (High Priority)</option>
              </select>
            </div>

            <div className="side-group">
              <label htmlFor="drInput">Referring Doctor</label>
              <input
                id="drInput"
                type="text"
                value={prescribingDoctor}
                onChange={(e) => setPrescribingDoctor(e.target.value)}
              />
            </div>

            <div className="order-calc-table">
              <div className="calc-header">Selected Tests Breakdown:</div>
              {selectedTests.map((t) => (
                <div key={t.id} className="calc-row">
                  <span>{t.name}</span>
                  <strong>₹{t.price}</strong>
                </div>
              ))}
              <div className="calc-divider" />
              <div className="calc-total">
                <span>Total Investigation Fee:</span>
                <span className="total-val">₹{totalAmount}</span>
              </div>
            </div>

            <button type="submit" className="btn-create-order">
              Generate Barcode & Place Order
            </button>
          </div>
        </div>
      </form>

      {/* Existing Orders Table */}
      <div className="active-orders-section">
        <h2>Laboratory Order Queue ({orders.length})</h2>
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Sample Barcode</th>
                <th>Patient</th>
                <th>Investigations</th>
                <th>Priority</th>
                <th>Specimen</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => {
                const isPending = ord.status !== "Completed";
                const testObj = testCatalog.find((t) => t.id === ord.testIds[0]);
                return (
                  <tr key={ord.id}>
                    <td>
                      <span className="barcode-badge">{ord.sampleId}</span>
                      <span className="order-id-sub">{ord.id}</span>
                    </td>
                    <td>
                      <strong>{ord.patientName}</strong>
                      <span className="patient-meta-sub">{ord.patientId} • {ord.age}y/{ord.gender[0]}</span>
                    </td>
                    <td>{testObj ? testObj.name : "Diagnostic Panel"}</td>
                    <td>
                      <span className={`priority-tag ${ord.priority.includes("STAT") ? "stat" : "routine"}`}>
                        {ord.priority}
                      </span>
                    </td>
                    <td>{ord.specimen}</td>
                    <td>
                      <span className={`status-pill ${ord.status === "Completed" ? "completed" : "pending"}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td>
                      {isPending ? (
                        <button
                          type="button"
                          className="btn-table-action enter"
                          onClick={() => navigate("/lab-value-entry", { state: { selectedOrderId: ord.id } })}
                        >
                          Enter Values &rarr;
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-table-action view"
                          onClick={() => navigate("/report-history")}
                        >
                          View Report
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

export default TestOrderEntry;
