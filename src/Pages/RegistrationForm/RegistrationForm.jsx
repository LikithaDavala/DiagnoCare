import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLabContext } from "../../context/labContext";
import "./registrationForm.css";

function RegistrationForm({ onComplete }) {
  const navigate = useNavigate();
  const { patients, addPatient } = useLabContext();

  const nextPad = String(patients.length + 1).padStart(5, "0");
  const nextPid = `LAB-2026-${nextPad}`;

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  // Visit Information
  const [referralDoctor, setReferralDoctor] = useState("");
  const [hospitalClinic, setHospitalClinic] = useState("");
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);
  const [clinicalNotes, setClinicalNotes] = useState("");

  const [registeredPatient, setRegisteredPatient] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !gender || !phone.trim()) {
      alert("Please fill in required fields: Full Name, Gender, and Contact Phone.");
      return;
    }

    const created = addPatient({
      fullName: fullName.trim(),
      dob: dob || "1990-01-01",
      age: parseInt(age, 10) || 30,
      gender,
      phone: phone.trim(),
      mobile: phone.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      address: address.trim() || "Medical Enclave, City",
      bloodGroup: bloodGroup || "O+",
      referralDoctor: referralDoctor.trim() || "Self / Walk-in",
      hospitalClinic: hospitalClinic.trim() || "City General OPD",
      visitDate,
      clinicalNotes
    });

    setRegisteredPatient(created);
  };

  const handleReset = () => {
    setFullName("");
    setDob("");
    setAge("");
    setGender("");
    setPhone("");
    setEmail("");
    setAddress("");
    setBloodGroup("");
    setReferralDoctor("");
    setHospitalClinic("");
    setClinicalNotes("");
    setRegisteredPatient(null);
  };

  return (
    <div className="registration-container">
      {registeredPatient ? (
        <div className="registration-success-card">
          <div className="success-icon">✓</div>
          <h3>Patient Intake Registered Successfully!</h3>
          <p className="success-details">
            Auto-Generated Patient ID: <strong>{registeredPatient.id}</strong> | Name: <strong>{registeredPatient.fullName}</strong>
          </p>
          <div className="success-actions">
            <button
              type="button"
              className="btn-order-tests"
              onClick={() =>
                navigate("/test-order-entry", { state: { selectedPid: registeredPatient.id } })
              }
            >
              Order Diagnostic Tests for this Patient &rarr;
            </button>
            <button
              type="button"
              className="btn-register-another"
              onClick={() => {
                handleReset();
                if (onComplete) onComplete();
              }}
            >
              View in Patient Directory
            </button>
            <button type="button" className="btn-register-another" onClick={handleReset}>
              + Register Another Patient
            </button>
          </div>
        </div>
      ) : (
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-section-legend">1. Patient Demographic Information</div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="txtID">Patient ID (Auto-Generated)</label>
              <input id="txtID" type="text" value={nextPid} readOnly className="input-readonly" />
            </div>

            <div className="form-group">
              <label htmlFor="txtName">Full Name *</label>
              <input
                id="txtName"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="txtDob">Date of Birth</label>
              <input
                id="txtDob"
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  if (e.target.value) {
                    const birthYear = new Date(e.target.value).getFullYear();
                    const currYear = new Date().getFullYear();
                    setAge(String(currYear - birthYear));
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="txtAge">Age (Years) *</label>
              <input
                id="txtAge"
                type="number"
                min="0"
                max="125"
                placeholder="Years"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ddlGender">Gender *</label>
              <select id="ddlGender" value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="txtPhone">Contact Phone Number *</label>
              <input
                id="txtPhone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="txtEmail">Email Address</label>
              <input
                id="txtEmail"
                type="email"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ddlBlood">Blood Group</label>
              <select id="ddlBlood" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                <option value="">-- Select Group --</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="txtAddress">Residential Address</label>
              <input
                id="txtAddress"
                type="text"
                placeholder="Street address, apartment, locality, city"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="form-section-legend" style={{ marginTop: "24px" }}>
            2. Visit & Clinical Referral Information
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="txtDoctor">Referring Doctor</label>
              <input
                id="txtDoctor"
                type="text"
                placeholder="e.g. Dr. Suresh Varma, MD"
                value={referralDoctor}
                onChange={(e) => setReferralDoctor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="txtClinic">Hospital / Clinic</label>
              <input
                id="txtClinic"
                type="text"
                placeholder="e.g. Apollo City Hospital"
                value={hospitalClinic}
                onChange={(e) => setHospitalClinic(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="txtVisitDate">Visit Date</label>
              <input
                id="txtVisitDate"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="txtNotes">Clinical Notes / Reason for Visit</label>
              <input
                id="txtNotes"
                type="text"
                placeholder="e.g. Routine checkup, fever workup, preoperative"
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn-submit">
              Register Patient & Assign ID ({nextPid})
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default RegistrationForm;
