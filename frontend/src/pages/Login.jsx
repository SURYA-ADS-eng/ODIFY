import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // shows specific error and register suggestion
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Client-side Gmail validation
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setErrorMsg("Email must be a @gmail.com address. If you don't have one, please register.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // store user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // redirect based on role
      const role = response.data.user.role;
      if (role === "Student") window.location.href = "/student";
      else if (role === "Faculty") window.location.href = "/faculty/dashboard";
      else if (role === "HoD") window.location.href = "/hod";
      else if (role === "Admin") window.location.href = "/adminDash";
      else window.location.href = "/"; // fallback

    } catch (err) {
      // show friendly msg + register link suggestion
      setErrorMsg("Invalid email or password. If you don't have an account, please register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {errorMsg && (
          <div style={styles.errorBox}>
            <span>{errorMsg}</span>
            <div style={{ marginTop: 8 }}>
              <a href="/register" style={styles.registerLink}>
                Create a new account
              </a>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Gmail Address (must end with @gmail.com)"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <a href="/register" style={styles.link}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "#e8f1ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "380px",
    padding: "35px",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 8px 25px rgba(0, 72, 135, 0.25)",
    border: "2px solid #d0e2ff",
  },

  title: {
    textAlign: "center",
    color: "#004a99",
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1.5px solid #9bbbe9",
    borderRadius: "6px",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#0059d4",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: "600",
    transition: "0.3s",
  },

  footer: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px",
  },

  link: {
    color: "#0059d4",
    fontWeight: "600",
    textDecoration: "none",
  },

  // Error box styling
  errorBox: {
    background: "#fff3f3",
    border: "1px solid #ffd2d2",
    color: "#b00020",
    padding: "10px 12px",
    borderRadius: "6px",
    marginBottom: "12px",
    fontWeight: 600,
    textAlign: "center",
  },

  registerLink: {
    color: "#0059d4",
    fontWeight: "700",
    textDecoration: "none",
  },
};
