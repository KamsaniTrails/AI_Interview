import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import "../styles/navbar.css";

export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  // check login
  const token = localStorage.getItem("token");

  // get user
  const user = JSON.parse(localStorage.getItem("user"));

  // logout
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  // active route
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-container">

      <div className="navbar">

        {/* Logo */}
        <h2 className="logo">
          AI<span className="logo-highlight">Mock</span>
        </h2>

        {/* Nav Links */}
        <div className="nav-links">

          {/* Home */}
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home

            {isActive("/") && (
              <motion.div
                layoutId="dot"
                className="active-dot"
              />
            )}
          </Link>

          {/* Logged In Navbar */}
          {token ? (
            <>

              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`nav-link ${
                  isActive("/dashboard") ? "active" : ""
                }`}
              >
                Dashboard

                {isActive("/dashboard") && (
                  <motion.div
                    layoutId="dot"
                    className="active-dot"
                  />
                )}
              </Link>

              {/* Start Interview */}
              <Link
                to="/interview"
                className={`nav-link ${
                  isActive("/interview") ? "active" : ""
                }`}
              >
                Start Interview

                {isActive("/interview") && (
                  <motion.div
                    layoutId="dot"
                    className="active-dot"
                  />
                )}
              </Link>

              {/* History */}
              <Link
                to="/history"
                className={`nav-link ${
                  isActive("/history") ? "active" : ""
                }`}
              >
                History

                {isActive("/history") && (
                  <motion.div
                    layoutId="dot"
                    className="active-dot"
                  />
                )}
              </Link>

              {/* Logout */}
              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </>
          ) : (
            <>

              {/* Login */}
              <Link
                to="/login"
                className={`nav-link ${
                  isActive("/login") ? "active" : ""
                }`}
              >
                Login

                {isActive("/login") && (
                  <motion.div
                    layoutId="dot"
                    className="active-dot"
                  />
                )}
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className={`nav-link ${
                  isActive("/register") ? "active" : ""
                }`}
              >
                Register

                {isActive("/register") && (
                  <motion.div
                    layoutId="dot"
                    className="active-dot"
                  />
                )}
              </Link>

            </>
          )}

        </div>

      </div>

    </nav>
  );
}