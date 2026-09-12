import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/interviewDetails.css";
import { API_BASE_URL } from "../apiConfig";

export default function InterviewDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/history/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data && res.data.interview) {
          setInterview(res.data.interview);
        } else {
          setError("Interview not found");
        }
      } catch (err) {
        console.log("FETCH INTERVIEW ERROR:", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load interview details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  // =========================
  // SAFE ANSWER EXTRACTOR
  // answers is stored as:
  //   [{ question: "...", answer: "..." }, ...]
  // But older / pending records may have it as
  //   []  or  ["raw string answer", ...]
  // This handles both shapes safely.
  // =========================
  const getAnswerForQuestion = (index) => {

    if (
      !interview ||
      !Array.isArray(interview.answers) ||
      interview.answers.length === 0
    ) {
      return "No Answer";
    }

    const item = interview.answers[index];

    if (item === undefined || item === null) {
      return "No Answer";
    }

    // Object form: { question, answer }
    if (typeof item === "object") {
      if (
        typeof item.answer === "string" &&
        item.answer.trim().length > 0
      ) {
        return item.answer;
      }
      return "No Answer";
    }

    // String form
    if (typeof item === "string") {
      return item.trim().length > 0 ? item : "No Answer";
    }

    return "No Answer";
  };

  if (loading) {
    return (
      <div className="details-loading">
        <h2>Loading interview details...</h2>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="details-error">
        <h2>{error || "Interview not found"}</h2>
        <button
          onClick={() => navigate("/history")}
          className="back-btn"
        >
          ← Back to History
        </button>
      </div>
    );
  }

  const questions = Array.isArray(interview.questions)
    ? interview.questions
    : [];

  const status = interview.status || "pending";

  // Calculate total score dynamically from the answers array
  let calculatedTotalScore = 0;
  const maxPossibleScore = questions.length * 10;
  if (interview.answers && Array.isArray(interview.answers)) {
    interview.answers.forEach((ans) => {
      if (ans && typeof ans.score === 'number') {
        calculatedTotalScore += ans.score;
      }
    });
  }

  return (
    <div className="details-container">

      <button
        onClick={() => navigate("/history")}
        className="back-btn"
      >
        ← Back to History
      </button>

      <h2 className="details-title">Interview Details</h2>

      <div className="details-summary-card">
        <h3 className="item-experience">
          <strong>Experience :</strong> {interview.experience || "N/A"}
        </h3>
        <h3 className="item-score">
          <strong>Percentage :</strong> {interview.score || 0}%
        </h3>
        <h3 className="item-total-score">
          <strong>Total Score :</strong> {calculatedTotalScore} / {maxPossibleScore} ({interview.score || 0}%)
        </h3>
        <h3 className="item-status">
          <strong>Status :</strong> {status.toUpperCase()}
        </h3>
        {interview.performance && (
          <h3 className="item-performance">
            <strong>Performance :</strong> {interview.performance}
          </h3>
        )}
        <p className="time-meta">
          <strong>Created :</strong> {new Date(interview.createdAt).toLocaleString()}
        </p>
        {interview.completedAt && (
          <p className="time-meta">
            <strong>Completed :</strong> {new Date(interview.completedAt).toLocaleString()}
          </p>
        )}
      </div>

      <hr />

      <h3 className="qna-section-title">Questions & Answers</h3>

      {questions.length === 0 ? (
        <p className="no-questions">No questions were generated for this interview.</p>
      ) : (
        questions.map((q, index) => {

          const answerText = getAnswerForQuestion(index);
          const answerObj = status === "completed" && Array.isArray(interview.answers) ? interview.answers[index] : null;

          return (
            <div
              key={index}
              className={`question-card ${status !== "completed" ? "pending-card" : ""}`}
            >

              <div className="question-card-header">
                <b className="question-number">
                  Question {index + 1}
                </b>
                {answerObj && (
                  <span className={`evaluation-badge ${answerObj.evaluation.toLowerCase().replace(" ", "-")}`}>
                    {answerObj.evaluation} ({answerObj.score !== undefined ? answerObj.score : 0}/10)
                  </span>
                )}
              </div>

              <p className="question-prompt">
                {q}
              </p>

              <b className="candidate-answer-label">
                Candidate Answer
              </b>

              <p className={`candidate-answer-text ${answerText === "No Answer" ? "no-answer" : ""}`}>
                {answerText}
              </p>

              {answerObj && (
                <>
                  <b className="expected-answer-label">Expected Answer</b>
                  <p className="expected-answer-text">
                    {answerObj.expectedAnswer || "N/A"}
                  </p>

                  <b className="feedback-label">Feedback</b>
                  <p className="feedback-text">
                    {answerObj.feedback || "No feedback generated."}
                  </p>
                </>
              )}

            </div>
          );
        })
      )}

    </div>
  );

}
