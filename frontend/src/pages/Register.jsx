import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

import "../styles/register.css";
import { API_BASE_URL } from "../apiConfig";

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/users/register`,
        {
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      alert(res.data.message);

      navigate("/login");

    } catch (err) {

      setError(
        err.response?.data?.message || "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="register-container">

      <div className="register-blob1"></div>
      <div className="register-blob2"></div>

      <motion.form
        className="register-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
      >

        <h2 className="register-title">
          Register
        </h2>

        <div className="register-input-group">

          <label>Username</label>

          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            className="register-input"
          />

        </div>

        <div className="register-input-group">

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="register-input"
          />

        </div>

        <div className="register-input-group">

          <label>Password</label>

          <div className="register-password-wrapper">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="register-input register-password-input"
            />

            <button
              type="button"
              className="register-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </button>

          </div>

        </div>

        <div className="register-input-group">

          <label>Confirm Password</label>

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="register-input"
          />

        </div>

        <div className="register-login-text">

          Already have an account?{" "}

          <Link
            to="/login"
            className="register-login-link"
          >
            Login
          </Link>

        </div>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          className="register-btn"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
        >

          {loading ? (
            <div className="register-loader-wrapper">

              <span>Creating...</span>

              <div className="register-spinner"></div>

            </div>
          ) : (
            "REGISTER"
          )}

        </motion.button>

      </motion.form>

    </div>
  );
}