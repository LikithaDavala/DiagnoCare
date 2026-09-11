import { NavLink } from "react-router-dom";
import "./dashboard.css";

const recentReports = [
  ["RPT-1048", "Ananya Rao", "Complete Blood Count", "11 Sep 2026", "Completed"],
  ["RPT-1047", "Daniel Thomas", "Lipid Profile", "11 Sep 2026", "Pending"],
  ["RPT-1046", "Meera Nair", "Liver Function Test", "10 Sep 2026", "Completed"],
  ["RPT-1045", "Arjun Kapoor", "Thyroid Profile", "10 Sep 2026", "Pending"],
  ["RPT-1044", "Sofia Joseph", "Blood Glucose", "09 Sep 2026", "Completed"],
];

function Dashboard() {
  const cards = [["Total patients", "1,248", "P", "blue"], ["Total samples", "3,642", "S", "cyan"], ["Pending reports", "86", "!", "amber"], ["Completed reports", "3,556", "✓", "green"]];
  return <section className="dashboard-page">
    <div className="dashboard-heading"><div><p className="module-kicker">DiagnoCare workspace</p><h1>Good morning, Doctor</h1><p className="dashboard-subtitle">Here is today&apos;s laboratory overview.</p></div><div className="dashboard-date">11 September 2026</div></div>
    <div className="summary-grid">{cards.map(([label, value, icon, tone]) => <article className="summary-card" key={label}><div className={`summary-icon ${tone}`}>{icon}</div><div><p>{label}</p><strong>{value}</strong></div></article>)}</div>
    <section className="reports-panel"><div className="reports-header"><div><h2>Recent reports</h2><p>Latest patient reports and their current status.</p></div><NavLink className="view-all-link" to="/report-history">View all <span aria-hidden="true">&#8594;</span></NavLink></div><div className="reports-table-wrap"><table className="reports-table"><thead><tr><th>Report ID</th><th>Patient</th><th>Test</th><th>Date</th><th>Status</th></tr></thead><tbody>{recentReports.map(([id, patient, test, date, status]) => <tr key={id}><td className="report-id">{id}</td><td>{patient}</td><td>{test}</td><td>{date}</td><td><span className={`report-status ${status.toLowerCase()}`}>{status}</span></td></tr>)}</tbody></table></div></section>
  </section>;
}
export default Dashboard;
