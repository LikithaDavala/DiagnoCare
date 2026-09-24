import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LabProvider } from "./context/labContext";
import Header from "./Components/Header/header";
import Sidebar from "./Components/Sidebar/sidebar";
import LoginScreen from "./Pages/LoginScreen/loginScreen";
import Dashboard from "./Pages/Dashboard/dashboard";
import PatientRegistration from "./Pages/PatientRegistration/patientRegistration";
import TestOrderEntry from "./Pages/TestOrderEntry/testOrderEntry";
import SampleManagement from "./Pages/SampleManagement/sampleManagement";
import LabValueEntry from "./Pages/LabValueEntry/labValueEntry";
import ReportHistory from "./Pages/ReportHistory/reportHistory";
import TestMaster from "./Pages/TestMaster/testMaster";
import ReferenceRangeManagement from "./Pages/ReferenceRangeManagement/referenceRangeManagement";
import StaffManagement from "./Pages/StaffManagement/staffManagement";
import ReportTemplate from "./Pages/ReportTemplate/reportTemplate";
import Settings from "./Pages/Settings/settings";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LabProvider>
      <BrowserRouter>
        <div className="app-shell">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onCloseSidebar={() => setSidebarOpen(false)}
        />
        <Sidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Patients */}
            <Route path="/patients" element={<PatientRegistration />} />
            <Route path="/patient-registration" element={<PatientRegistration />} />
            
            {/* Test Orders */}
            <Route path="/test-orders" element={<TestOrderEntry />} />
            <Route path="/test-order-entry" element={<TestOrderEntry />} />
            
            {/* Samples */}
            <Route path="/samples" element={<SampleManagement />} />
            
            {/* Results / Result Entry */}
            <Route path="/results" element={<LabValueEntry />} />
            <Route path="/lab-value-entry" element={<LabValueEntry />} />
            
            {/* Reports */}
            <Route path="/reports" element={<ReportHistory />} />
            <Route path="/report-history" element={<ReportHistory />} />
            
            {/* Management & System */}
            <Route path="/test-master" element={<TestMaster />} />
            <Route path="/reference-ranges" element={<ReferenceRangeManagement />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/staff-management" element={<StaffManagement />} />
            <Route path="/report-templates" element={<ReportTemplate />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </LabProvider>
  );
}

export default App;