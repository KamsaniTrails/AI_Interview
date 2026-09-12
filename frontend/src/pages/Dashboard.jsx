import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";
import { API_BASE_URL } from "../apiConfig";

export default function Dashboard() {

  const navigate = useNavigate();

  // =========================
  // USER
  // =========================

  const [user, setUser] = useState({
    name: "Candidate",
  });

  // =========================
  // DASHBOARD STATS
  // =========================

  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    bestScore: 0,
    totalCorrect: 0,
    totalPartiallyCorrect: 0,
    totalIncorrect: 0,
  });

  // =========================
  // INTERVIEW HISTORY
  // =========================

  const [recentInterviews, setRecentInterviews] =
    useState([]);

  // =========================
  // LOADING
  // =========================

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      try {

        setUser(JSON.parse(storedUser));

      } catch (err) {

        console.log(err);
      }
    }

    fetchDashboardData();

  }, []);

  // =========================
  // FETCH DASHBOARD
  // =========================

  const fetchDashboardData = async () => {

    try {

      const token =
        localStorage.getItem("token");

      // =========================
      // API CALL
      // =========================

      const response =
        await axios.get(
          `${API_BASE_URL}/api/dashboard`,
          {
            headers: {
              ...(token && {
                Authorization: `Bearer ${token}`,
              }),
            },
          }
        );

      // console.log(
      //   "DASHBOARD DATA:",
      //   response.data
      // );
      console.log("DASHBOARD DATA:", response.data);
console.log("STATS:", response.data.stats);
console.log("INTERVIEWS:", response.data.interviews);


      setRecentInterviews(response.data.interviews || []);

setStats(response.data.stats || {
  totalInterviews: 0,
  avgScore: 0,
  bestScore: 0,
  totalCorrect: 0,
  totalPartiallyCorrect: 0,
  totalIncorrect: 0,
});

    } catch (error) {

      console.log(
        "Dashboard Fetch Error:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // LOADING UI
  // =========================

  if (loading) {

    return (
      <div className="dashboard-loader">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <header className="dashboard-header">

        <div className="header-greeting">

          <h1>
            Welcome back,{" "}
            {user?.name || "Candidate"} 🚀
          </h1>

          <p>
            Your AI Interview Dashboard is
            ready.
          </p>

        </div>

        <div className="live-status-badge">

          <span className="pulse-dot"></span>

          System Status: Online

        </div>

      </header>

      {/* ========================= */}
      {/* MAIN GRID */}
      {/* ========================= */}

      <div className="dashboard-main-grid">

        {/* ========================= */}
        {/* LEFT CONTENT */}
        {/* ========================= */}

        <div className="dashboard-left-content">

          {/* ========================= */}
          {/* STATS */}
          {/* ========================= */}

          <section className="dashboard-stats">

            {/* TOTAL */}

            <div className="stat-card">

              <div className="stat-icon-wrapper blue">
                📊
              </div>

              <div className="stat-data-block">

                <h2>
                  {stats.totalInterviews}
                </h2>

                <p>
                  Interviews Completed
                </p>

              </div>

            </div>

            {/* AVG */}

            <div className="stat-card">

              <div className="stat-icon-wrapper orange">
                🎯
              </div>

              <div className="stat-data-block">

                <h2>
                  {stats.avgScore}%
                </h2>

                <p>
                  Average Score
                </p>

              </div>

            </div>

            {/* BEST */}

            <div className="stat-card">

              <div className="stat-icon-wrapper green">
                👑
              </div>

              <div className="stat-data-block">

                <h2>
                  {stats.bestScore}%
                </h2>

                <p>
                  Best Score
                </p>

              </div>

            </div>

          </section>

          {/* ========================= */}
          {/* EMPTY STATE */}
          {/* ========================= */}

          {stats.totalInterviews === 0 ? (

            <div className="empty-state-card">

              <h3>
                No Interviews Yet
              </h3>

              <p>
                Start your first AI interview
                and track your performance.
              </p>

              <button
                className="primary-inline-btn"
                onClick={() =>
                  navigate("/interview")
                }
              >
                Start Interview
              </button>

            </div>

          ) : (

            <div className="analytics-progress-card">

              <h3>
                Performance Tracker
              </h3>

              <p>
                Keep improving your interview
                skills daily.
              </p>

              <div className="progress-bar-container">

                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${stats.avgScore}%`,
                  }}
                ></div>

              </div>

              {stats.totalInterviews > 0 && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                    AI Answer Evaluation Breakdown
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '80px', background: 'var(--bg-surface)', padding: '0.75rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>{stats.totalCorrect || 0}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '0.25rem', letterSpacing: '0.05em' }}>CORRECT</div>
                    </div>
                    <div style={{ flex: 1, minWidth: '80px', background: 'var(--bg-surface)', padding: '0.75rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--warning)' }}>{stats.totalPartiallyCorrect || 0}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '0.25rem', letterSpacing: '0.05em' }}>PARTIAL</div>
                    </div>
                    <div style={{ flex: 1, minWidth: '80px', background: 'var(--bg-surface)', padding: '0.75rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444' }}>{stats.totalIncorrect || 0}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '0.25rem', letterSpacing: '0.05em' }}>INCORRECT</div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          )}

          {/* ========================= */}
          {/* ACTIONS */}
          {/* ========================= */}

          <h4 className="section-title-label">
            Quick Actions
          </h4>

          <section className="dashboard-actions">

            {/* START */}

            <button
              className="action-card"
              onClick={() =>
                navigate("/interview")
              }
            >

              <span className="action-icon">
                🎤
              </span>

              <h3>
                Start AI Interview
              </h3>

              <p>
                Generate skill-based AI
                interview questions.
              </p>

            </button>

            {/* HISTORY */}

            <button
              className="action-card"
              onClick={() =>
                navigate("/history")
              }
            >

              <span className="action-icon">
                📈
              </span>

              <h3>
                Interview History
              </h3>

              <p>
                Review previous interview
                sessions and scores.
              </p>

            </button>

          </section>

          {/* ========================= */}
          {/* RECENT INTERVIEWS */}
          {/* ========================= */}

          {recentInterviews.length > 0 && (

            <div className="recent-interviews-card">

              <h3>
                Recent Interviews
              </h3>

              <div className="recent-list">

                {recentInterviews
                  .slice(0, 5)
                  .map((item, index) => (

                    <div
                      className="recent-item"
                      key={index}
                    >

                      <div>

                        <h4>
                          {item.experience}
                        </h4>

                        <p>
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </p>

                        {(item.totalCorrect !== undefined || item.totalPartiallyCorrect !== undefined || item.totalIncorrect !== undefined) && (
                          <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: 'bold' }}>
                            <span style={{ color: 'var(--success)', background: 'var(--success-glow)', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid rgba(5, 150, 105, 0.1)' }}>
                              ✓ {item.totalCorrect || 0}
                            </span>
                            <span style={{ color: 'var(--warning)', background: 'var(--warning-glow)', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid rgba(217, 119, 6, 0.1)' }}>
                              ~ {item.totalPartiallyCorrect || 0}
                            </span>
                            <span style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                              ✗ {item.totalIncorrect || 0}
                            </span>
                          </div>
                        )}

                      </div>

                      <div className="score-badge">

                        {item.score || 0}%

                      </div>

                    </div>

                  ))}

              </div>

            </div>

          )}

        </div>

        {/* ========================= */}
        {/* SIDEBAR */}
        {/* ========================= */}

        <div className="dashboard-sidebar-panels">

          <div className="sidebar-widget-card">

            <h3>
              Recommended Topics
            </h3>

            <ul className="tracks-list">

              <li>
                <strong>• React:</strong>
                Hooks & Lifecycle
              </li>

              <li>
                <strong>• Node.js:</strong>
                Authentication APIs
              </li>

              <li>
                <strong>• MongoDB:</strong>
                Aggregation & Indexing
              </li>

              <li>
                <strong>• System Design:</strong>
                Scalable Architecture
              </li>

            </ul>

          </div>

        </div>

      </div>

    </div>
  );
}