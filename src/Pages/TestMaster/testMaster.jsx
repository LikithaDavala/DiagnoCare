import React, { useState } from "react";
import { useLabContext } from "../../context/labContext";
import "./testMaster.css";

function TestMaster() {
  const { testCatalog, saveTestMaster } = useLabContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    department: "Biochemistry",
    specimen: "Serum",
    price: "",
    tat: "2 Hours"
  });

  const departments = ["All", "Hematology", "Biochemistry", "Endocrinology", "Microbiology"];

  const filteredTests = testCatalog.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "All" || t.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenAdd = () => {
    setEditingTest(null);
    setFormData({
      code: `TEST-${101 + testCatalog.length}`,
      name: "",
      department: "Biochemistry",
      specimen: "Serum",
      price: "500",
      tat: "3 Hours"
    });
    setShowModal(true);
  };

  const handleOpenEdit = (test) => {
    setEditingTest(test);
    setFormData({
      code: test.code,
      name: test.name,
      department: test.department,
      specimen: test.specimen,
      price: String(test.price),
      tat: test.tat
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Please enter test name and price.");
      return;
    }

    saveTestMaster({
      id: editingTest ? editingTest.id : undefined,
      code: formData.code,
      name: formData.name,
      department: formData.department,
      specimen: formData.specimen,
      price: parseFloat(formData.price),
      tat: formData.tat,
      status: "Active"
    });

    setShowModal(false);
  };

  return (
    <div className="test-master-page">
      <div className="master-heading">
        <div>
          <span className="master-kicker">MANAGEMENT • TEST CATALOG</span>
          <h1>Test Master Directory</h1>
          <p>Configure investigation profiles, diagnostic codes, specimen requirements, and tariff rates.</p>
        </div>
        <button type="button" className="btn-add-test" onClick={handleOpenAdd}>
          + Add Diagnostic Test
        </button>
      </div>

      {/* Toolbar */}
      <div className="master-toolbar-card">
        <div className="search-wrap">
          <span className="search-icon" aria-hidden="true">&#128269;</span>
          <input
            type="text"
            placeholder="Search by test name or code (e.g. CBC, HAEM-001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="dept-tabs">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              className={`dept-tab-btn ${deptFilter === dept ? "active" : ""}`}
              onClick={() => setDeptFilter(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Test Directory Table */}
      <div className="master-table-card">
        <div className="table-wrap">
          <table className="master-table">
            <thead>
              <tr>
                <th>Test Code</th>
                <th>Investigation Name</th>
                <th>Department</th>
                <th>Specimen Tube</th>
                <th>Turnaround (TAT)</th>
                <th>Standard Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr key={test.id}>
                  <td>
                    <span className="code-badge">{test.code}</span>
                  </td>
                  <td>
                    <strong className="test-name-bold">{test.name}</strong>
                  </td>
                  <td>
                    <span className="dept-pill">{test.department}</span>
                  </td>
                  <td>{test.specimen}</td>
                  <td>{test.tat}</td>
                  <td>
                    <strong className="price-tag">₹{test.price}</strong>
                  </td>
                  <td>
                    <span className="status-pill active">Active</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-edit-test"
                      onClick={() => handleOpenEdit(test)}
                    >
                      Edit Test
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Test Modal */}
      {showModal && (
        <div className="test-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="test-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTest ? "Edit Diagnostic Test" : "Add New Diagnostic Test"}</h3>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="testCode">Test Code *</label>
                  <input
                    id="testCode"
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="testDept">Department *</label>
                  <select
                    id="testDept"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Clinical Pathology">Clinical Pathology</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="testName">Investigation Name *</label>
                <input
                  id="testName"
                  type="text"
                  placeholder="e.g. Glycated Hemoglobin (HbA1c)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="testSpecimen">Specimen Requirement</label>
                  <select
                    id="testSpecimen"
                    value={formData.specimen}
                    onChange={(e) => setFormData({ ...formData, specimen: e.target.value })}
                  >
                    <option value="EDTA Whole Blood">EDTA Whole Blood (Lavender Top)</option>
                    <option value="Serum">Serum / Clot Activator (Red Top)</option>
                    <option value="Serum (Fasting 12h)">Serum (Fasting 12h)</option>
                    <option value="Sodium Fluoride Blood">Sodium Fluoride (Grey Top)</option>
                    <option value="Clean-Catch Urine">Clean-Catch Urine</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="testPrice">Tariff Price (₹) *</label>
                  <input
                    id="testPrice"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="testTat">Turnaround Time (TAT)</label>
                <input
                  id="testTat"
                  type="text"
                  placeholder="e.g. 3 Hours"
                  value={formData.tat}
                  onChange={(e) => setFormData({ ...formData, tat: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Investigation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestMaster;
