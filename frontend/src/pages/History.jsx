import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/history.css";
import { API_BASE_URL } from "../apiConfig";

export default function History() {

  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("HISTORY RESPONSE:", response.data);

      const allInterviews = response.data.interviews || [];

      // Only show completed interviews in history
      // (pending / cancelled have no answers to review)
      const completedInterviews = allInterviews.filter(
        (item) => item.status === "completed"
      );

      setHistory(completedInterviews);

    } catch (err) {

      console.log("HISTORY FETCH ERROR:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load interview history"
      );

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) {

    return (
      <div className="history-loading">
        <h2>Loading Interview History...</h2>
      </div>
    );

  }

  if (error) {
    return (
      <div className="history-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button
          className="view-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (

    <div className="history-container">

      <div className="history-header">

        <h1>
          Interview History
        </h1>

        <p>
          Review all your previous interview sessions.
        </p>

      </div>

      {

        history.length === 0 ?

        (

          <div className="empty-history">

            <h2>
              No Interviews Found
            </h2>

            <p>
              Complete an interview to see your history.
            </p>

          </div>

        )

        :

        (

          <div className="history-grid">

            {

              history.map((item) => (

                <div
                  className="history-card"
                  key={item._id}
                >

                  <div className="card-top">

                    <h2>
                      {item.experience}
                    </h2>

                    <span className="status">
                      {item.status}
                    </span>

                  </div>

                  <div className="card-body">

                    <p>

                      <strong>
                        Score :
                      </strong>

                      {" "}
                      {item.score}%

                    </p>

                    <p>

                      <strong>
                        Total Score :
                      </strong>

                      {" "}
                      {item.overallScore !== undefined ? item.overallScore : Math.round((item.score / 100) * (item.questions.length * 10))} / {item.questions.length * 10}

                    </p>

                    <p>

                      <strong>
                        Questions :
                      </strong>

                      {" "}
                      {item.questions.length}

                    </p>

                    <p>

                      <strong>
                        Date :
                      </strong>

                      {" "}

                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}

                    </p>

                    {(item.totalCorrect !== undefined || item.totalPartiallyCorrect !== undefined || item.totalIncorrect !== undefined) && (
                      <p style={{ marginTop: '8px', display: 'flex', gap: '6px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--success)', background: 'var(--success-glow)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(5, 150, 105, 0.1)', fontWeight: 600 }}>
                          ✓ {item.totalCorrect || 0}
                        </span>
                        <span style={{ color: 'var(--warning)', background: 'var(--warning-glow)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(217, 119, 6, 0.1)', fontWeight: 600 }}>
                          ~ {item.totalPartiallyCorrect || 0}
                        </span>
                        <span style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.1)', fontWeight: 600 }}>
                          ✗ {item.totalIncorrect || 0}
                        </span>
                      </p>
                    )}

                  </div>
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/history/${item._id}`)}
                  >
                    View Details
                  </button>

                </div>

              ))

            }

          </div>

        )

      }

    </div>

  );

}