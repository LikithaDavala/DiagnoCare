import React, { createContext, useContext, useState } from "react";

const LabContext = createContext();

// 1. Reference Ranges Master Catalog (Dynamic source of truth for Result Entry)
export const INITIAL_REFERENCE_RANGES = [
  // Hematology - CBC
  { id: "ref-cbc-hgb-m", testId: "CBC", testName: "Complete Blood Count (CBC)", parameterId: "hgb", parameterName: "Hemoglobin", unit: "g/dL", min: 13.0, max: 17.0, panicMin: 7.0, panicMax: 20.0, gender: "Male", status: "Active" },
  { id: "ref-cbc-hgb-f", testId: "CBC", testName: "Complete Blood Count (CBC)", parameterId: "hgb", parameterName: "Hemoglobin", unit: "g/dL", min: 12.0, max: 15.5, panicMin: 7.0, panicMax: 19.0, gender: "Female", status: "Active" },
  { id: "ref-cbc-wbc", testId: "CBC", testName: "Complete Blood Count (CBC)", parameterId: "wbc", parameterName: "Total WBC Count", unit: "/µL", min: 4000, max: 11000, panicMin: 2000, panicMax: 30000, gender: "All", status: "Active" },
  { id: "ref-cbc-plt", testId: "CBC", testName: "Complete Blood Count (CBC)", parameterId: "plt", parameterName: "Platelet Count", unit: "lakhs/µL", min: 1.5, max: 4.5, panicMin: 0.5, panicMax: 10.0, gender: "All", status: "Active" },
  { id: "ref-cbc-rbc", testId: "CBC", testName: "Complete Blood Count (CBC)", parameterId: "rbc", parameterName: "RBC Count", unit: "mill/µL", min: 4.5, max: 5.9, panicMin: 2.5, panicMax: 7.0, gender: "All", status: "Active" },
  { id: "ref-cbc-hct", testId: "CBC", testName: "Complete Blood Count (CBC)", parameterId: "hct", parameterName: "Hematocrit (PCV)", unit: "%", min: 40.0, max: 50.0, panicMin: 20.0, panicMax: 60.0, gender: "All", status: "Active" },

  // Biochemistry - Lipid Profile
  { id: "ref-lip-chol", testId: "LIPID", testName: "Lipid Profile", parameterId: "chol", parameterName: "Total Cholesterol", unit: "mg/dL", min: 125, max: 200, panicMin: null, panicMax: 300, gender: "All", status: "Active" },
  { id: "ref-lip-trig", testId: "LIPID", testName: "Lipid Profile", parameterId: "trig", parameterName: "Triglycerides", unit: "mg/dL", min: 50, max: 150, panicMin: null, panicMax: 500, gender: "All", status: "Active" },
  { id: "ref-lip-hdl", testId: "LIPID", testName: "Lipid Profile", parameterId: "hdl", parameterName: "HDL (Good) Cholesterol", unit: "mg/dL", min: 40, max: 60, panicMin: 20, panicMax: null, gender: "All", status: "Active" },
  { id: "ref-lip-ldl", testId: "LIPID", testName: "Lipid Profile", parameterId: "ldl", parameterName: "LDL (Bad) Cholesterol", unit: "mg/dL", min: 60, max: 100, panicMin: null, panicMax: 190, gender: "All", status: "Active" },

  // Biochemistry - LFT
  { id: "ref-lft-tbil", testId: "LFT", testName: "Liver Function Test (LFT)", parameterId: "t_bil", parameterName: "Total Bilirubin", unit: "mg/dL", min: 0.2, max: 1.2, panicMin: null, panicMax: 15.0, gender: "All", status: "Active" },
  { id: "ref-lft-sgpt", testId: "LFT", testName: "Liver Function Test (LFT)", parameterId: "sgpt", parameterName: "SGPT (ALT)", unit: "U/L", min: 7, max: 56, panicMin: null, panicMax: 300, gender: "All", status: "Active" },
  { id: "ref-lft-sgot", testId: "LFT", testName: "Liver Function Test (LFT)", parameterId: "sgot", parameterName: "SGOT (AST)", unit: "U/L", min: 10, max: 40, panicMin: null, panicMax: 300, gender: "All", status: "Active" },
  { id: "ref-lft-alp", testId: "LFT", testName: "Liver Function Test (LFT)", parameterId: "alp", parameterName: "Alkaline Phosphatase", unit: "U/L", min: 44, max: 147, panicMin: null, panicMax: 500, gender: "All", status: "Active" },
  { id: "ref-lft-alb", testId: "LFT", testName: "Liver Function Test (LFT)", parameterId: "alb", parameterName: "Serum Albumin", unit: "g/dL", min: 3.5, max: 5.5, panicMin: 1.5, panicMax: 6.5, gender: "All", status: "Active" },

  // Biochemistry - KFT
  { id: "ref-kft-creat", testId: "KFT", testName: "Kidney / Renal Function (KFT)", parameterId: "creat", parameterName: "Serum Creatinine", unit: "mg/dL", min: 0.7, max: 1.3, panicMin: 0.3, panicMax: 5.0, gender: "All", status: "Active" },
  { id: "ref-kft-bun", testId: "KFT", testName: "Kidney / Renal Function (KFT)", parameterId: "bun", parameterName: "Blood Urea Nitrogen", unit: "mg/dL", min: 7, max: 20, panicMin: 3, panicMax: 80, gender: "All", status: "Active" },
  { id: "ref-kft-uric", testId: "KFT", testName: "Kidney / Renal Function (KFT)", parameterId: "uric", parameterName: "Uric Acid", unit: "mg/dL", min: 3.5, max: 7.2, panicMin: null, panicMax: 12.0, gender: "All", status: "Active" },

  // Endocrinology - Thyroid
  { id: "ref-thy-t3", testId: "THYROID", testName: "Thyroid Profile (T3, T4, TSH)", parameterId: "t3", parameterName: "Total T3", unit: "ng/mL", min: 0.8, max: 2.0, panicMin: 0.3, panicMax: 5.0, gender: "All", status: "Active" },
  { id: "ref-thy-t4", testId: "THYROID", testName: "Thyroid Profile (T3, T4, TSH)", parameterId: "t4", parameterName: "Total T4", unit: "µg/dL", min: 5.1, max: 14.1, panicMin: 2.0, panicMax: 20.0, gender: "All", status: "Active" },
  { id: "ref-thy-tsh", testId: "THYROID", testName: "Thyroid Profile (T3, T4, TSH)", parameterId: "tsh", parameterName: "TSH (Ultrasensitive)", unit: "µIU/mL", min: 0.4, max: 4.5, panicMin: 0.05, panicMax: 30.0, gender: "All", status: "Active" },

  // Biochemistry - Glucose
  { id: "ref-glu-fbg", testId: "GLUCOSE", testName: "Blood Glucose (Fasting & PP)", parameterId: "fbg", parameterName: "Fasting Blood Sugar", unit: "mg/dL", min: 70, max: 99, panicMin: 50, panicMax: 350, gender: "All", status: "Active" },
  { id: "ref-glu-ppbs", testId: "GLUCOSE", testName: "Blood Glucose (Fasting & PP)", parameterId: "ppbs", parameterName: "Post Prandial Blood Sugar", unit: "mg/dL", min: 90, max: 140, panicMin: 50, panicMax: 400, gender: "All", status: "Active" }
];

// 2. Test Master Catalog
export const INITIAL_TEST_CATALOG = [
  {
    id: "CBC",
    code: "HAEM-001",
    name: "Complete Blood Count (CBC)",
    department: "Hematology",
    specimen: "EDTA Whole Blood",
    price: 350,
    tat: "2 Hours",
    status: "Active"
  },
  {
    id: "LIPID",
    code: "BIO-004",
    name: "Lipid Profile",
    department: "Biochemistry",
    specimen: "Serum (Fasting 12h)",
    price: 650,
    tat: "4 Hours",
    status: "Active"
  },
  {
    id: "LFT",
    code: "BIO-008",
    name: "Liver Function Test (LFT)",
    department: "Biochemistry",
    specimen: "Serum",
    price: 750,
    tat: "4 Hours",
    status: "Active"
  },
  {
    id: "KFT",
    code: "BIO-012",
    name: "Kidney / Renal Function (KFT)",
    department: "Biochemistry",
    specimen: "Serum",
    price: 600,
    tat: "3 Hours",
    status: "Active"
  },
  {
    id: "THYROID",
    code: "ENDO-002",
    name: "Thyroid Profile (T3, T4, TSH)",
    department: "Endocrinology",
    specimen: "Serum",
    price: 550,
    tat: "6 Hours",
    status: "Active"
  },
  {
    id: "GLUCOSE",
    code: "BIO-001",
    name: "Blood Glucose (Fasting & PP)",
    department: "Biochemistry",
    specimen: "Sodium Fluoride Blood",
    price: 180,
    tat: "1 Hour",
    status: "Active"
  }
];

export function LabProvider({ children }) {
  // Current logged in user & role
  const [currentUser, setCurrentUser] = useState({
    id: "USR-001",
    name: "Dr. Admin",
    role: "Admin", // Admin | Receptionist | Lab Technician | Pathologist / Authorized Reviewer
    title: "Laboratory Director & Pathologist",
    email: "admin@diagnocare.org",
    avatar: "DA"
  });

  // Role accounts for simulation & testing
  const staffUsers = [
    { id: "USR-001", name: "Dr. Admin", role: "Admin", title: "Laboratory Director & Chief Pathologist", email: "admin@diagnocare.org", department: "Administration / Pathology", status: "Active", permissions: "Full Access" },
    { id: "USR-002", name: "Pooja Sharma", role: "Receptionist", title: "Front Desk & Patient Registrar", email: "pooja.s@diagnocare.org", department: "Patient Services", status: "Active", permissions: "Patient Intake, Test Orders, Billing" },
    { id: "USR-003", name: "Kunal Deshmukh", role: "Lab Technician", title: "Senior Medical Laboratory Technician", email: "kunal.d@diagnocare.org", department: "Hematology & Clinical Biochem", status: "Active", permissions: "Sample Tracking, Result Entry" },
    { id: "USR-004", name: "Dr. Preeti Menon", role: "Pathologist / Authorized Reviewer", title: "Consultant Pathologist, MD", email: "preeti.menon@diagnocare.org", department: "Pathology Verification", status: "Active", permissions: "Result Verification, Report Release" }
  ];

  // Dynamic Reference Ranges State
  const [referenceRanges, setReferenceRanges] = useState(INITIAL_REFERENCE_RANGES);

  // Test Master Catalog State
  const [testCatalog, setTestCatalog] = useState(INITIAL_TEST_CATALOG);

  // Patients (Format: LAB-2026-00001)
  const [patients, setPatients] = useState([
    {
      id: "LAB-2026-00001",
      fullName: "Ananya Rao",
      dob: "1997-04-12",
      age: 29,
      gender: "Female",
      phone: "+91 98451 22340",
      email: "ananya.rao@example.com",
      address: "#42 Lakeview Colony, Bangalore",
      bloodGroup: "O+",
      referralDoctor: "Dr. Suresh Varma, MD",
      hospitalClinic: "Apollo City Clinic",
      lastVisit: "11 Sep 2026",
      status: "Active"
    },
    {
      id: "LAB-2026-00002",
      fullName: "Daniel Thomas",
      dob: "1980-08-21",
      age: 46,
      gender: "Male",
      phone: "+91 98112 44590",
      email: "daniel.t@example.com",
      address: "15 Palm Street, Richmond Town",
      bloodGroup: "B+",
      referralDoctor: "Dr. Kavita Reddy, DM",
      hospitalClinic: "Heart & Vascular Care",
      lastVisit: "11 Sep 2026",
      status: "Active"
    },
    {
      id: "LAB-2026-00003",
      fullName: "Meera Nair",
      dob: "1988-02-14",
      age: 38,
      gender: "Female",
      phone: "+91 94470 88214",
      email: "meera.nair@example.com",
      address: "B-201 Green Acres, Koramangala",
      bloodGroup: "A+",
      referralDoctor: "Dr. Rajesh Sharma, MD",
      hospitalClinic: "Gastro Health Center",
      lastVisit: "10 Sep 2026",
      status: "Active"
    },
    {
      id: "LAB-2026-00004",
      fullName: "Arjun Kapoor",
      dob: "1974-11-30",
      age: 52,
      gender: "Male",
      phone: "+91 99201 33418",
      email: "arjun.kapoor@example.com",
      address: "78 Brigade Heights, Indiranagar",
      bloodGroup: "AB+",
      referralDoctor: "Dr. Neha Sen, MD",
      hospitalClinic: "Apex Endocrine Institute",
      lastVisit: "10 Sep 2026",
      status: "Active"
    },
    {
      id: "LAB-2026-00005",
      fullName: "Sofia Joseph",
      dob: "1992-06-18",
      age: 34,
      gender: "Female",
      phone: "+91 97402 11985",
      email: "sofia.j@example.com",
      address: "Unit 34, Whitefield Main Road",
      bloodGroup: "O-",
      referralDoctor: "Dr. Suresh Varma, MD",
      hospitalClinic: "City Health OPD",
      lastVisit: "09 Sep 2026",
      status: "Active"
    }
  ]);

  // Test Orders (Format: ORD-2026-00001)
  const [orders, setOrders] = useState([
    {
      id: "ORD-2026-00001",
      sampleId: "SMPL-2026-00001",
      patientId: "LAB-2026-00001",
      patientName: "Ananya Rao",
      age: 29,
      gender: "Female",
      referralDoctor: "Dr. Suresh Varma, MD",
      testIds: ["CBC"],
      specimen: "EDTA Whole Blood",
      priority: "Routine",
      date: "11 Sep 2026",
      status: "Verified",
      reportId: "RPT-2026-00001"
    },
    {
      id: "ORD-2026-00002",
      sampleId: "SMPL-2026-00002",
      patientId: "LAB-2026-00002",
      patientName: "Daniel Thomas",
      age: 46,
      gender: "Male",
      referralDoctor: "Dr. Kavita Reddy, DM",
      testIds: ["LIPID"],
      specimen: "Serum (Fasting 12h)",
      priority: "Urgent (STAT)",
      date: "11 Sep 2026",
      status: "Processing",
      reportId: null
    },
    {
      id: "ORD-2026-00003",
      sampleId: "SMPL-2026-00003",
      patientId: "LAB-2026-00003",
      patientName: "Meera Nair",
      age: 38,
      gender: "Female",
      referralDoctor: "Dr. Rajesh Sharma, MD",
      testIds: ["LFT"],
      specimen: "Serum",
      priority: "Routine",
      date: "10 Sep 2026",
      status: "Verified",
      reportId: "RPT-2026-00002"
    },
    {
      id: "ORD-2026-00004",
      sampleId: "SMPL-2026-00004",
      patientId: "LAB-2026-00004",
      patientName: "Arjun Kapoor",
      age: 52,
      gender: "Male",
      referralDoctor: "Dr. Neha Sen, MD",
      testIds: ["THYROID"],
      specimen: "Serum",
      priority: "Routine",
      date: "10 Sep 2026",
      status: "Awaiting Verification",
      reportId: null
    },
    {
      id: "ORD-2026-00005",
      sampleId: "SMPL-2026-00005",
      patientId: "LAB-2026-00005",
      patientName: "Sofia Joseph",
      age: 34,
      gender: "Female",
      referralDoctor: "Dr. Suresh Varma, MD",
      testIds: ["GLUCOSE"],
      specimen: "Sodium Fluoride Blood",
      priority: "Routine",
      date: "09 Sep 2026",
      status: "Verified",
      reportId: "RPT-2026-00003"
    }
  ]);

  // Samples Module (Format: SMPL-2026-00001)
  // Workflow statuses: Collected -> Received -> Processing -> Completed
  const [samples, setSamples] = useState([
    {
      id: "SMPL-2026-00001",
      orderId: "ORD-2026-00001",
      patientId: "LAB-2026-00001",
      patientName: "Ananya Rao",
      testName: "Complete Blood Count (CBC)",
      sampleType: "EDTA Whole Blood",
      collectionTime: "11 Sep 2026, 08:30 AM",
      collectedBy: "Ramesh Phleb",
      priority: "Routine",
      status: "Completed"
    },
    {
      id: "SMPL-2026-00002",
      orderId: "ORD-2026-00002",
      patientId: "LAB-2026-00002",
      patientName: "Daniel Thomas",
      testName: "Lipid Profile",
      sampleType: "Serum (Fasting 12h)",
      collectionTime: "11 Sep 2026, 09:15 AM",
      collectedBy: "Sneha Phleb",
      priority: "Urgent (STAT)",
      status: "Processing"
    },
    {
      id: "SMPL-2026-00003",
      orderId: "ORD-2026-00003",
      patientId: "LAB-2026-00003",
      patientName: "Meera Nair",
      testName: "Liver Function Test (LFT)",
      sampleType: "Serum",
      collectionTime: "10 Sep 2026, 10:00 AM",
      collectedBy: "Ramesh Phleb",
      priority: "Routine",
      status: "Completed"
    },
    {
      id: "SMPL-2026-00004",
      orderId: "ORD-2026-00004",
      patientId: "LAB-2026-00004",
      patientName: "Arjun Kapoor",
      testName: "Thyroid Profile (T3, T4, TSH)",
      sampleType: "Serum",
      collectionTime: "10 Sep 2026, 11:30 AM",
      collectedBy: "Sneha Phleb",
      priority: "Routine",
      status: "Received"
    },
    {
      id: "SMPL-2026-00005",
      orderId: "ORD-2026-00005",
      patientId: "LAB-2026-00005",
      patientName: "Sofia Joseph",
      testName: "Blood Glucose (Fasting & PP)",
      sampleType: "Sodium Fluoride Blood",
      collectionTime: "09 Sep 2026, 08:00 AM",
      collectedBy: "Ramesh Phleb",
      priority: "Routine",
      status: "Completed"
    }
  ]);

  // Reports (Format: RPT-2026-00001)
  // Verification lifecycle: Draft -> Processing -> Awaiting Verification -> Verified -> Released
  const [reports, setReports] = useState([
    {
      id: "RPT-2026-00001",
      orderId: "ORD-2026-00001",
      sampleId: "SMPL-2026-00001",
      patientId: "LAB-2026-00001",
      patientName: "Ananya Rao",
      age: 29,
      gender: "Female",
      referralDoctor: "Dr. Suresh Varma, MD",
      testName: "Complete Blood Count (CBC)",
      department: "Hematology",
      date: "11 Sep 2026",
      status: "Verified",
      pathologist: "Dr. Preeti Menon, MD (Pathologist)",
      verificationDate: "11 Sep 2026, 11:45 AM",
      interpretation: "Hemoglobin within normal healthy range. Normocytic normochromic smear. Adequate platelets.",
      parameters: [
        { id: "hgb", name: "Hemoglobin", value: 13.8, unit: "g/dL", min: 12.0, max: 15.5, flag: "Normal" },
        { id: "wbc", name: "Total WBC Count", value: 7200, unit: "/µL", min: 4000, max: 11000, flag: "Normal" },
        { id: "plt", name: "Platelet Count", value: 2.8, unit: "lakhs/µL", min: 1.5, max: 4.5, flag: "Normal" },
        { id: "rbc", name: "RBC Count", value: 4.9, unit: "mill/µL", min: 4.5, max: 5.9, flag: "Normal" },
        { id: "hct", name: "Hematocrit (PCV)", value: 43.5, unit: "%", min: 40.0, max: 50.0, flag: "Normal" }
      ]
    },
    {
      id: "RPT-2026-00002",
      orderId: "ORD-2026-00003",
      sampleId: "SMPL-2026-00003",
      patientId: "LAB-2026-00003",
      patientName: "Meera Nair",
      age: 38,
      gender: "Female",
      referralDoctor: "Dr. Rajesh Sharma, MD",
      testName: "Liver Function Test (LFT)",
      department: "Biochemistry",
      date: "10 Sep 2026",
      status: "Verified",
      pathologist: "Dr. Preeti Menon, MD (Pathologist)",
      verificationDate: "10 Sep 2026, 02:15 PM",
      interpretation: "Mild elevation in SGPT observed. Bilirubin and Albumin are in optimal biological range.",
      parameters: [
        { id: "t_bil", name: "Total Bilirubin", value: 0.8, unit: "mg/dL", min: 0.2, max: 1.2, flag: "Normal" },
        { id: "sgpt", name: "SGPT (ALT)", value: 68, unit: "U/L", min: 7, max: 56, flag: "High" },
        { id: "sgot", name: "SGOT (AST)", value: 34, unit: "U/L", min: 10, max: 40, flag: "Normal" },
        { id: "alp", name: "Alkaline Phosphatase", value: 110, unit: "U/L", min: 44, max: 147, flag: "Normal" },
        { id: "alb", name: "Serum Albumin", value: 4.2, unit: "g/dL", min: 3.5, max: 5.5, flag: "Normal" }
      ]
    },
    {
      id: "RPT-2026-00003",
      orderId: "ORD-2026-00005",
      sampleId: "SMPL-2026-00005",
      patientId: "LAB-2026-00005",
      patientName: "Sofia Joseph",
      age: 34,
      gender: "Female",
      referralDoctor: "Dr. Suresh Varma, MD",
      testName: "Blood Glucose (Fasting & PP)",
      department: "Biochemistry",
      date: "09 Sep 2026",
      status: "Verified",
      pathologist: "Dr. Preeti Menon, MD (Pathologist)",
      verificationDate: "09 Sep 2026, 10:30 AM",
      interpretation: "Fasting and Post Prandial sugar levels are strictly within normal glycemic targets.",
      parameters: [
        { id: "fbg", name: "Fasting Blood Sugar", value: 88, unit: "mg/dL", min: 70, max: 99, flag: "Normal" },
        { id: "ppbs", name: "Post Prandial Blood Sugar", value: 118, unit: "mg/dL", min: 90, max: 140, flag: "Normal" }
      ]
    }
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: "notif-1", title: "Awaiting Verification", message: "Report for Arjun Kapoor (THYROID) is ready for review.", time: "10m ago", read: false, type: "warning" },
    { id: "notif-2", title: "STAT Sample Received", message: "Emergency sample SMPL-2026-00002 received for Daniel Thomas.", time: "25m ago", read: false, type: "urgent" },
    { id: "notif-3", title: "Report Released", message: "Report RPT-2026-00001 verified & released to Dr. Suresh Varma.", time: "1h ago", read: true, type: "success" }
  ]);

  // Report Template & System Settings
  const [reportTemplateSettings, setReportTemplateSettings] = useState({
    labName: "LAB DIAGNOSTICS & PATHOLOGY HEALTHCARE",
    tagline: "Advanced Automated Diagnostic Laboratory & Clinical Research Center",
    accreditations: "NABL ACCREDITED (ISO 15189:2022) • CAP CERTIFIED • LIC: DL-2026/894",
    address: "108 Healthcare Blvd, Medical Enclave, Bangalore - 560034",
    phone: "+91 (80) 4122-8900 | Helpline: 104",
    email: "reports@diagnocare.org",
    website: "www.diagnocare.org",
    disclaimer: "These test findings are produced by automated medical analyzers. Please correlate with clinical symptoms. Reports are electronically authenticated.",
    showQrCode: true,
    showDoctorSeal: true,
    primaryColor: "#1769aa"
  });

  const [systemSettings, setSystemSettings] = useState({
    labName: "DiagnoCare Lab Diagnostics",
    currency: "₹",
    dateFormat: "DD/MM/YYYY",
    tatWarningHours: 4,
    enableCriticalAlerts: true,
    autoBackupEnabled: true,
    defaultTechnician: "Kunal Deshmukh",
    defaultPathologist: "Dr. Preeti Menon, MD"
  });

  // --- HELPER METHODS ---

  // Get active reference range for a test & parameter, factoring gender if specified
  const getReferenceRange = (testId, parameterId, gender = "All") => {
    // Look for gender-specific range first
    const genderMatch = referenceRanges.find(
      (r) => r.testId === testId && r.parameterId === parameterId && r.gender === gender && r.status === "Active"
    );
    if (genderMatch) return genderMatch;

    // Fallback to "All"
    const genericMatch = referenceRanges.find(
      (r) => r.testId === testId && r.parameterId === parameterId && r.status === "Active"
    );
    return (
      genericMatch || {
        parameterName: parameterId,
        unit: "",
        min: 0,
        max: 100,
        panicMin: null,
        panicMax: null
      }
    );
  };

  // Evaluate Flag
  const evaluateFlag = (val, range) => {
    if (val === "" || val === null || val === undefined || isNaN(val)) return "Normal";
    const num = parseFloat(val);
    if (range.panicMin !== null && range.panicMin !== undefined && num <= range.panicMin) return "Critical";
    if (range.panicMax !== null && range.panicMax !== undefined && num >= range.panicMax) return "Critical";
    if (range.min !== null && range.min !== undefined && num < range.min) return "Low";
    if (range.max !== null && range.max !== undefined && num > range.max) return "High";
    return "Normal";
  };

  // Add Patient
  const addPatient = (patientData) => {
    const padNum = String(patients.length + 1).padStart(5, "0");
    const nextPid = `LAB-2026-${padNum}`;
    const newRecord = {
      ...patientData,
      id: nextPid,
      lastVisit: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Active"
    };
    setPatients((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  // Create Test Order
  const createOrder = (orderData) => {
    const padNum = String(orders.length + 1).padStart(5, "0");
    const orderId = `ORD-2026-${padNum}`;
    const sampleId = `SMPL-2026-${padNum}`;
    const dateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const newOrder = {
      ...orderData,
      id: orderId,
      sampleId,
      date: dateStr,
      status: "Processing",
      reportId: null
    };

    // Auto-create linked Sample record
    const testObj = testCatalog.find((t) => t.id === orderData.testIds[0]);
    const newSample = {
      id: sampleId,
      orderId,
      patientId: orderData.patientId,
      patientName: orderData.patientName,
      testName: testObj ? testObj.name : "Diagnostic Panel",
      sampleType: orderData.specimen || (testObj ? testObj.specimen : "Venous Blood"),
      collectionTime: `${dateStr}, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      collectedBy: currentUser.role === "Lab Technician" ? currentUser.name : "Phlebotomy Dept",
      priority: orderData.priority || "Routine",
      status: "Collected"
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSamples((prev) => [newSample, ...prev]);

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "New Test Order Placed",
        message: `Order ${orderId} created for ${orderData.patientName} (${sampleId}).`,
        time: "Just now",
        read: false,
        type: orderData.priority?.includes("STAT") ? "urgent" : "info"
      },
      ...prev
    ]);

    return newOrder;
  };

  // Update Sample Status in Sample Tracking Workflow
  const updateSampleStatus = (sampleId, newStatus) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === sampleId ? { ...s, status: newStatus } : s))
    );
  };

  // Save / Update Lab Results (Draft or Awaiting Verification)
  const saveLabResults = ({ orderId, parameterValues, interpretation, submitForVerification = false }) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    const firstTest = testCatalog.find((t) => t.id === order.testIds[0]) || testCatalog[0];
    const testRanges = referenceRanges.filter((r) => r.testId === firstTest.id && r.status === "Active");

    const evaluatedParams = testRanges.map((ref) => {
      const val = parameterValues[ref.parameterId] !== undefined ? parameterValues[ref.parameterId] : ((ref.min + ref.max) / 2).toFixed(1);
      return {
        id: ref.parameterId,
        name: ref.parameterName,
        value: val,
        unit: ref.unit,
        min: ref.min,
        max: ref.max,
        flag: evaluateFlag(val, ref)
      };
    });

    const newStatus = submitForVerification ? "Awaiting Verification" : "Processing";

    // Update order status
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    // Update sample status
    setSamples((prev) =>
      prev.map((s) => (s.orderId === orderId ? { ...s, status: submitForVerification ? "Processing" : "Processing" } : s))
    );

    return {
      orderId,
      status: newStatus,
      parameters: evaluatedParams,
      interpretation
    };
  };

  // Authorize & Verify Report (Authorized Reviewer / Pathologist only)
  const verifyAndReleaseReport = ({ orderId, parameterValues, interpretation, pathologistName }) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    const padNum = String(reports.length + 1).padStart(5, "0");
    const reportId = `RPT-2026-${padNum}`;
    const firstTest = testCatalog.find((t) => t.id === order.testIds[0]) || testCatalog[0];
    const testRanges = referenceRanges.filter((r) => r.testId === firstTest.id && r.status === "Active");

    const evaluatedParams = testRanges.map((ref) => {
      const val = parameterValues[ref.parameterId] !== undefined ? parameterValues[ref.parameterId] : ((ref.min + ref.max) / 2).toFixed(1);
      return {
        id: ref.parameterId,
        name: ref.parameterName,
        value: val,
        unit: ref.unit,
        min: ref.min,
        max: ref.max,
        flag: evaluateFlag(val, ref)
      };
    });

    const nowStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newReport = {
      id: reportId,
      orderId: order.id,
      sampleId: order.sampleId,
      patientId: order.patientId,
      patientName: order.patientName,
      age: order.age,
      gender: order.gender,
      referralDoctor: order.referralDoctor,
      testName: firstTest.name,
      department: firstTest.department,
      date: nowStr,
      status: "Verified",
      pathologist: pathologistName || currentUser.name,
      verificationDate: `${nowStr}, ${timeStr}`,
      interpretation: interpretation || "Parameters assessed on automated clinical analyzer. Quality verified and authenticated.",
      parameters: evaluatedParams
    };

    // Update order status to Verified
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Verified", reportId } : o))
    );

    // Update sample status to Completed
    setSamples((prev) =>
      prev.map((s) => (s.orderId === orderId ? { ...s, status: "Completed" } : s))
    );

    // Store report
    setReports((prev) => [newReport, ...prev]);

    // Push notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Report Verified & Released",
        message: `Report ${reportId} for ${order.patientName} was approved by ${pathologistName || currentUser.name}.`,
        time: "Just now",
        read: false,
        type: "success"
      },
      ...prev
    ]);

    return newReport;
  };

  // Add / Edit Reference Range
  const saveReferenceRange = (rangeData) => {
    if (rangeData.id) {
      // Edit existing
      setReferenceRanges((prev) =>
        prev.map((r) => (r.id === rangeData.id ? { ...r, ...rangeData } : r))
      );
    } else {
      // Add new
      const newRange = {
        ...rangeData,
        id: `ref-custom-${Date.now()}`,
        status: "Active"
      };
      setReferenceRanges((prev) => [...prev, newRange]);
    }
  };

  // Toggle Reference Range status
  const toggleReferenceRangeStatus = (rangeId) => {
    setReferenceRanges((prev) =>
      prev.map((r) =>
        r.id === rangeId ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r
      )
    );
  };

  // Add / Edit Test Master
  const saveTestMaster = (testData) => {
    if (testData.id) {
      setTestCatalog((prev) =>
        prev.map((t) => (t.id === testData.id ? { ...t, ...testData } : t))
      );
    } else {
      const newTest = {
        ...testData,
        id: `TEST-${Date.now()}`,
        status: "Active"
      };
      setTestCatalog((prev) => [...prev, newTest]);
    }
  };

  // Mark all notifications as read
  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Dashboard Stats
  const getStats = () => {
    const totalPatients = 1248 + (patients.length - 5);
    const todaySamples = 126 + (samples.length - 5);
    const pendingReports = orders.filter((o) => o.status !== "Verified").length + 13;
    const completedReports = reports.length + 105;

    return {
      totalPatients: totalPatients.toLocaleString(),
      todaySamples: todaySamples.toString(),
      pendingReports: pendingReports.toString(),
      completedReports: completedReports.toLocaleString()
    };
  };

  // Recent 5 Reports
  const getRecentReports = () => {
    const list = [];
    orders.slice(0, 5).forEach((ord) => {
      const matchingReport = reports.find((r) => r.orderId === ord.id);
      const test = testCatalog.find((t) => t.id === ord.testIds[0]);
      list.push({
        id: matchingReport ? matchingReport.id : ord.sampleId,
        patient: ord.patientName,
        patientId: ord.patientId,
        test: test ? test.name : "Diagnostic Panel",
        date: ord.date,
        status: ord.status, // Verified, Pending, Processing, Awaiting Verification
        reportId: matchingReport ? matchingReport.id : null,
        orderId: ord.id
      });
    });
    return list;
  };

  return (
    <LabContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        staffUsers,
        patients,
        orders,
        samples,
        reports,
        referenceRanges,
        testCatalog,
        notifications,
        reportTemplateSettings,
        setReportTemplateSettings,
        systemSettings,
        setSystemSettings,
        getReferenceRange,
        evaluateFlag,
        addPatient,
        createOrder,
        updateSampleStatus,
        saveLabResults,
        verifyAndReleaseReport,
        saveReferenceRange,
        toggleReferenceRangeStatus,
        saveTestMaster,
        markNotificationsAsRead,
        getStats,
        getRecentReports
      }}
    >
      {children}
    </LabContext.Provider>
  );
}

export function useLabContext() {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error("useLabContext must be used within a LabProvider");
  }
  return context;
}
