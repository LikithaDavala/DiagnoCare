import React, { useState } from "react";
import { useLabContext } from "../../context/labContext";
import "./reportTemplate.css";

function ReportTemplate() {
  const { reportTemplateSettings, setReportTemplateSettings } = useLabContext();
  const [formData, setFormData] = useState({ ...reportTemplateSettings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setReportTemplateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="template-page">
      <div className="template-heading">
        <div>
          <span className="template-kicker">SYSTEM • REPORT FORMATTING</span>
          <h1>Report Template Configuration</h1>
          <p>Customize clinical letterhead branding, accreditations, digital signature seals, and report footers.</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="save-success-banner">
          ✓ Report template settings updated! Changes reflect immediately on all generated PDF and print reports.
        </div>
      )}

      <div className="template-layout-grid">
        {/* Form Settings */}
        <form className="template-form-card" onSubmit={handleSubmit}>
          <h3>Letterhead & Laboratory Identity</h3>

          <div className="form-group">
            <label htmlFor="labName">Official Laboratory Name</label>
            <input
              id="labName"
              type="text"
              value={formData.labName}
              onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tagline">Facility Tagline</label>
            <input
              id="tagline"
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="accreditations">Regulatory Accreditations & Licenses</label>
            <input
              id="accreditations"
              type="text"
              value={formData.accreditations}
              onChange={(e) => setFormData({ ...formData, accreditations: e.target.value })}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="phone">Contact Telephone</label>
              <input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Official Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Physical Lab Address</label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="disclaimer">Standard Clinical Disclaimer & Footnote</label>
            <textarea
              id="disclaimer"
              rows="3"
              value={formData.disclaimer}
              onChange={(e) => setFormData({ ...formData, disclaimer: e.target.value })}
            />
          </div>

          <div className="toggles-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={formData.showQrCode}
                onChange={(e) => setFormData({ ...formData, showQrCode: e.target.checked })}
              />
              Include Security QR Verification Code on Reports
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={formData.showDoctorSeal}
                onChange={(e) => setFormData({ ...formData, showDoctorSeal: e.target.checked })}
              />
              Include Official Pathology Digital Authentication Stamp
            </label>
          </div>

          <div className="form-footer-btn">
            <button type="submit" className="btn-save-template">
              Save Report Template Settings
            </button>
          </div>
        </form>

        {/* Live Preview Card */}
        <div className="template-preview-card">
          <div className="preview-header-bar">
            <span>Live Report Header Preview</span>
          </div>
          <div className="preview-sheet-box">
            <div className="mini-header-preview">
              <div className="mini-logo">LD</div>
              <div>
                <h4>{formData.labName || "LABORATORY NAME"}</h4>
                <p className="mini-tagline">{formData.tagline}</p>
                <p className="mini-accred">{formData.accreditations}</p>
              </div>
            </div>
            <div className="mini-contact-row">
              <span>{formData.phone}</span> • <span>{formData.email}</span>
            </div>
            <div className="mini-sheet-divider" />
            <div className="mini-demo-block">
              <div className="mini-demo-line" />
              <div className="mini-demo-line short" />
            </div>
            <div className="mini-table-placeholder">
              <div className="tbl-hdr" />
              <div className="tbl-row" />
              <div className="tbl-row" />
            </div>
            <div className="mini-footer-preview">
              <span className="mini-foot-text">
                {formData.disclaimer ? formData.disclaimer.slice(0, 75) + "..." : "Disclaimer"}
              </span>
              {formData.showDoctorSeal && (
                <span className="mini-seal">DIAGNOCARE • SEAL</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportTemplate;
