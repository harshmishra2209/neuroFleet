import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="DRIVER">Driver</option>
          <option value="CUSTOMER">Customer</option>
        </select>

        <button className="primary-btn" onClick={handleRegister}>
          Register
        </button>

        <p className="auth-switch">
          Already have an account?
          <span onClick={() => navigate("/login")}> Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;