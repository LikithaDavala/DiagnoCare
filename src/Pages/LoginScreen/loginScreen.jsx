import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLabContext } from "../../context/labContext";
import "./loginScreen.css";

function LoginScreen() {
  const navigate = useNavigate();
  const { staffUsers, setCurrentUser } = useLabContext();
  const [email, setEmail] = useState("admin@diagnocare.org");
  const [password, setPassword] = useState("••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default sign-in to Dr. Admin
    navigate("/dashboard");
  };

  const handleQuickLoginAs = (staff) => {
    setEmail(staff.email);
    setCurrentUser({
      id: staff.id,
      name: staff.name,
      role: staff.role,
      title: staff.title,
      email: staff.email,
      avatar: staff.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    });
    navigate("/dashboard");
  };

  return (
    <div className="login-portal-wrapper">
      <div className="login-box-card">
        {/* Branding header */}
        <div className="login-brand-header">
          <div className="login-brand-icon">LD</div>
          <h2>LAB DIAGNOSTICS</h2>
          <p className="login-tagline">Clinical Laboratory & Diagnostic Information System</p>
        </div>

        <form className="login-form-inner" onSubmit={handleSubmit}>
          <div className="welcome-block">
            <h3>Welcome Back</h3>
            <p>Enter your authorized clinical credentials to access your workspace.</p>
          </div>

          <div className="input-field-group">
            <label htmlFor="userEmail">Email / Username</label>
            <input
              type="text"
              id="userEmail"
              placeholder="e.g. admin@diagnocare.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-field-group">
            <label htmlFor="userPassword">Password</label>
            <input
              type="password"
              id="userPassword"
              placeholder="Enter your security password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-aux-row">
            <label className="remember-box">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember my session
            </label>
            <Link to="/forgot-password" onClick={(e) => { e.preventDefault(); alert("Please contact IT Helpdesk (ext 104) to reset medical credentials."); }} className="link-forgot">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn-portal-login">
            Login to Lab Diagnostics &rarr;
          </button>
        </form>

        {/* Demo Fast Login Switcher */}
        <div className="demo-credentials-card">
          <span className="demo-kicker">Quick Demo Roles (1-Click Login):</span>
          <div className="demo-buttons-list">
            {staffUsers.map((staff) => (
              <button
                key={staff.id}
                type="button"
                className="btn-demo-role"
                onClick={() => handleQuickLoginAs(staff)}
              >
                <span className="demo-role-name">{staff.name}</span>
                <span className="demo-role-tag">{staff.role}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="login-footer-security">
          <span>🔒 256-Bit Encrypted Healthcare LIS Connection</span>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;