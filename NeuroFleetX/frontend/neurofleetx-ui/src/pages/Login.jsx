import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const extractRoleFromToken = (decoded) => {
    // Case 1: role field directly present
    if (decoded.role) {
      return decoded.role;
    }

    // Case 2: authorities array (Spring Security default)
    if (decoded.authorities && decoded.authorities.length > 0) {
      return decoded.authorities[0].replace("ROLE_", "");
    }

    // Case 3: roles array
    if (decoded.roles && decoded.roles.length > 0) {
      return decoded.roles[0].replace("ROLE_", "");
    }

    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const token = response.data;

      // Store token
      localStorage.setItem("token", token);

      // Decode JWT
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);

      // Extract role safely
      const role = extractRoleFromToken(decoded);

      if (!role) {
        throw new Error("Role not found in token");
      }

      // Store clean role
      localStorage.setItem("role", role);

      // Navigate to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="auth-switch">
          Don’t have an account?
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;