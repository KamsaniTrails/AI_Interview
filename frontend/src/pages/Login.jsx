import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

import "../styles/login.css";
import { API_BASE_URL } from "../apiConfig";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {

      setError("Please fill all fields");
      return;

    }

    try {

      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // store token
      localStorage.setItem("token", res.data.token);

      // store user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );
      console.log("LOGIN RESPONSE:", res.data);
      console.log("TOKEN AFTER SAVE:", localStorage.getItem("token"));
      alert(res.data.message);

      navigate("/");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="login-container">

      <div className="blob1"></div>
      <div className="blob2"></div>

      <motion.form
        className="login-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <h2 className="login-title">
          Login
        </h2>

        <div className="input-group">

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="login-input"
          />

        </div>

        <div className="input-group">

          <label>Password</label>

          <div className="password-wrapper">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="login-input password-input"
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              👁️
            </button>

          </div>

        </div>

        <div className="signup-text">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="signup-link"
          >
            Register
          </Link>

        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          className="login-btn"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
        >

          {loading ? (
            <div className="loader-wrapper">

              <span>Loading...</span>

              <div className="spinner"></div>

            </div>
          ) : (
            "LOGIN"
          )}

        </motion.button>

      </motion.form>

    </div>
  );
}
