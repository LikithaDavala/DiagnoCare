import React, { useState } from "react";
import { useLabContext } from "../../context/labContext";
import "./referenceRangeManagement.css";

function ReferenceRangeManagement() {
  const { referenceRanges, testCatalog, saveReferenceRange, toggleReferenceRangeStatus } = useLabContext();
  const [selectedTestFilter, setSelectedTestFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRange, setEditingRange] = useState(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    testId: "CBC",
    parameterId: "",
    parameterName: "",
    unit: "",
    min: "",
    max: "",
    panicMin: "",
    panicMax: "",
    gender: "All"
  });

  const filteredRanges = referenceRanges.filter((r) => {
    const matchesTest = selectedTestFilter === "All" || r.testId === selectedTestFilter;
    const matchesSearch =
      r.parameterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.testName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTest && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingRange(null);
    setFormData({
      testId: testCatalog[0]?.id || "CBC",
      parameterId: "",
      parameterName: "",
      unit: "",
      min: "",
      max: "",
      panicMin: "",
      panicMax: "",
      gender: "All"
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (range) => {
    setEditingRange(range);
    setFormData({
      testId: range.testId,
      parameterId: range.parameterId,
      parameterName: range.parameterName,
      unit: range.unit,
      min: range.min,
      max: range.max,
      panicMin: range.panicMin !== null ? range.panicMin : "",
      panicMax: range.panicMax !== null ? range.panicMax : "",
      gender: range.gender || "All"
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.parameterName || formData.min === "" || formData.max === "") {
      alert("Please fill in parameter name, lower and upper reference limits.");
      return;
    }

    const testObj = testCatalog.find((t) => t.id === formData.testId);

    saveReferenceRange({
      id: editingRange ? editingRange.id : undefined,
      testId: formData.testId,
      testName: testObj ? testObj.name : formData.testId,
      parameterId: formData.parameterId || formData.parameterName.toLowerCase().replace(/\s+/g, "_"),
      parameterName: formData.parameterName,
      unit: formData.unit,
      min: parseFloat(formData.min),
      max: parseFloat(formData.max),
      panicMin: formData.panicMin !== "" ? parseFloat(formData.panicMin) : null,
      panicMax: formData.panicMax !== "" ? parseFloat(formData.panicMax) : null,
      gender: formData.gender
    });

    setShowModal(false);
  };

  return (
    <div className="ref-ranges-page">
      <div className="ranges-heading">
        <div>
          <span className="ranges-kicker">MANAGEMENT • CLINICAL STANDARDS</span>
          <h1>Biological Reference Range Management</h1>
          <p>Configure biological intervals, clinical panic thresholds, and demographic rules across diagnostic panels.</p>
        </div>
        <button type="button" className="btn-add-range" onClick={handleOpenAddModal}>
          + Add Reference Interval
        </button>
      </div>

      {/* Toolbar */}
      <div className="ranges-toolbar-card">
        <div className="search-wrap">
          <span className="search-icon" aria-hidden="true">&#128269;</span>
          <input
            type="text"
            placeholder="Search parameter name or test panel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="testFilterSelect">Diagnostic Panel:</label>
          <select
            id="testFilterSelect"
            value={selectedTestFilter}
            onChange={(e) => setSelectedTestFilter(e.target.value)}
          >
            <option value="All">All Diagnostic Panels</option>
            {testCatalog.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ranges Table */}
      <div className="ranges-table-card">
        <div className="table-wrap">
          <table className="ranges-table">
            <thead>
              <tr>
                <th>Test Panel</th>
                <th>Parameter Name</th>
                <th>Applicable Gender</th>
                <th>Unit</th>
                <th>Normal Reference Interval</th>
                <th>Critical Panic Limits</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRanges.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-ranges-td">
                    No reference intervals match the search filter.
                  </td>
                </tr>
              ) : (
                filteredRanges.map((ref) => (
                  <tr key={ref.id}>
                    <td>
                      <span className="test-badge">{ref.testName}</span>
                    </td>
                    <td>
                      <strong>{ref.parameterName}</strong>
                    </td>
                    <td>
                      <span className={`gender-pill ${ref.gender.toLowerCase()}`}>
                        {ref.gender}
                      </span>
                    </td>
                    <td>
                      <span className="unit-mono">{ref.unit}</span>
                    </td>
                    <td>
                      <strong className="range-highlight">
                        {ref.min} – {ref.max} {ref.unit}
                      </strong>
                    </td>
                    <td>
                      <span className="panic-text">
                        {ref.panicMin !== null ? `≤ ${ref.panicMin}` : "—"} / {ref.panicMax !== null ? `≥ ${ref.panicMax}` : "—"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge-toggle ${ref.status.toLowerCase()}`}>
                        {ref.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-btn-group">
                        <button
                          type="button"
                          className="btn-edit-range"
                          onClick={() => handleOpenEditModal(ref)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-toggle-range"
                          onClick={() => toggleReferenceRangeStatus(ref.id)}
                        >
                          {ref.status === "Active" ? "Deactivate" : "Activate"}
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="range-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="range-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRange ? "Edit Biological Reference Range" : "Add New Reference Range"}</h3>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="modalTest">Diagnostic Test Panel *</label>
                  <select
                    id="modalTest"
                    value={formData.testId}
                    onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
                  >
                    {testCatalog.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="modalGender">Applicable Demographic / Gender</label>
                  <select
                    id="modalGender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="All">All Genders (Standard)</option>
                    <option value="Male">Male Adult</option>
                    <option value="Female">Female Adult</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="modalParamName">Parameter Name *</label>
                  <input
                    id="modalParamName"
                    type="text"
                    placeholder="e.g. Hemoglobin"
                    value={formData.parameterName}
                    onChange={(e) => setFormData({ ...formData, parameterName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modalUnit">Measurement Unit *</label>
                  <input
                    id="modalUnit"
                    type="text"
                    placeholder="e.g. g/dL, mg/dL, /µL"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="modalMin">Lower Normal Limit *</label>
                  <input
                    id="modalMin"
                    type="number"
                    step="any"
                    placeholder="e.g. 13.0"
                    value={formData.min}
                    onChange={(e) => setFormData({ ...formData, min: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modalMax">Upper Normal Limit *</label>
                  <input
                    id="modalMax"
                    type="number"
                    step="any"
                    placeholder="e.g. 17.0"
                    value={formData.max}
                    onChange={(e) => setFormData({ ...formData, max: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="modalPanicMin">Critical Panic Minimum (Optional)</label>
                  <input
                    id="modalPanicMin"
                    type="number"
                    step="any"
                    placeholder="e.g. 7.0"
                    value={formData.panicMin}
                    onChange={(e) => setFormData({ ...formData, panicMin: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modalPanicMax">Critical Panic Maximum (Optional)</label>
                  <input
                    id="modalPanicMax"
                    type="number"
                    step="any"
                    placeholder="e.g. 20.0"
                    value={formData.panicMax}
                    onChange={(e) => setFormData({ ...formData, panicMax: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Reference Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferenceRangeManagement;
