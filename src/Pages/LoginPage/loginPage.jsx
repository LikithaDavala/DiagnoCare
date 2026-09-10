import { useState } from "react";
import { Link } from "react-router-dom";
import "./loginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="login-container">
            <div className="login-visual" role="img" aria-label="Doctor speaking with a patient">
                <div className="visual-content">
                    <p className="visual-label">DIAGNOCARE</p>
                    <h2>Your health deserves thoughtful care.</h2>
                    <p>Manage your appointments, records, and care journey in one place.</p>
                </div>
            </div>
            <form className="login-form">
                <h1>Welcome Back</h1>
                <h2>Please login to your account</h2>
                <div className="form-group">
                    <label htmlFor="email">Email/UsserName</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email or username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="form-options">
                        <label className="remember-option" htmlFor="remember">
                            <input type="checkbox" id="remember" />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="forgot-password-link">
                            Forgot Password?
                        </Link>
                    </div>
                </div>
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/">Sign Up</Link></p>
            </form>
        </div>
    );
}
export default LoginPage;