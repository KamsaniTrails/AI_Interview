import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/liveinterview.css";

export default function LiveInterview() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract configuration parameters from setup stepper wizard triggers safely
  const config = location.state?.interviewConfig || { experience: "Mid-Senior", resumeName: "Attached_Profile.pdf" };

  // Core Functional System Component React States
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiAnalysisFeedback, setAiAnalysisFeedback] = useState("AI core is waiting for your spoken answer parameter inputs...");

  // 1. Core Dynamic Evaluation Pipeline - Mocks targeted custom profile background prompt parsers
  useEffect(() => {
    setIsAiProcessing(true);
    
    // Simulating instant neural text vector extraction delay matching resume settings context
    const tokenDelayTimer = setTimeout(() => {
      const generatedAiSchema = [
        `[AI Targeted Prompt]: Reviewing your professional experience tier parameters inside "${config.resumeName}". Direct architecture mapping question: Design a scalable caching framework node infrastructure handling heavy payload spikes for ${config.experience} tier environments.`,
        `[AI Targeted Prompt]: Based on the engineering skill matrices specified in your CV profile fields, how do you handle asynchronous memory leaks and lifecycle optimization routines across distributed frontend modules?`,
        `[AI Targeted Prompt]: Your attached documentation showcases deep project deployment histories. Detail an end-to-end telemetry pipeline configuration logic using standard cloud cluster filters.`
      ];
      
      setQuestions(generatedAiSchema);
      setIsAiProcessing(false);
    }, 1200);

    // Continuous Live Tracking Clock Stopwatch Loops
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(tokenDelayTimer);
      clearInterval(interval);
    };
  }, [config]);

  // Dynamic Audio Voice Processing Simulator With Custom Feedback Updates
  const toggleAudioCapture = () => {
    const nextState = !isRecording;
    setIsRecording(nextState);

    if (nextState) {
      setAiAnalysisFeedback("AI core agent is streaming live audio waves... Speech-to-text parsers parsing keywords...");
    } else {
      setAiAnalysisFeedback("Processing vocal signals... Analyzing syntax arrays, latency distribution, and semantic keyword metrics...");
    }
  };

  const advanceNextQuestionBlock = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setAiAnalysisFeedback("AI core has calibrated fresh prompt targets. Press the microphone record icon to evaluate data lines.");
    } else {
      console.log("Evaluation complete. Syncing database record state logs...");
      navigate("/history");
    }
  };

  // Dynamic Time Formatter Utility
  const formatTimeToken = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  return (
    <div className="live-session-viewport">
      {/* Top Application Navigation Information Stream bar */}
      <header className="live-session-top-meta">
        <div className="meta-left-tags">
          <span className="live-pulse-indicator"></span>
          <span className="bold-session-label">AI DYNAMIC ASSESSMENT INTERVIEW</span>
          <div className="vertical-spacer"></div>
          <p className="loaded-resume-badge">Active CV Profile Node: 📄 {config.resumeName || "Uploaded_Context_CV.pdf"}</p>
        </div>
        <div className="meta-right-clock">
          <span className="clock-icon">⏱</span> {formatTimeToken(timer)}
        </div>
      </header>

      {/* Main Structural Asymmetrical Core Content Split Panel Areas Grid Layout */}
      <div className="live-workspace-grid">
        
        {/* Left Grid Area: Central Active Evaluation Prompt Framework Block */}
        <main className="live-question-canvas-card">
          <div className="question-stage-header">
            <span className="question-index-token">AI EVALUATION MODULE {currentIdx + 1} OF {questions.length || 3}</span>
            <div className="difficulty-tier-badge">AI Calibration Level: {config.experience || "Mid-Senior"}</div>
          </div>

          {isAiProcessing ? (
            <div className="ai-processing-loader-wrapper">
              <div className="sonar-pulse-ring"></div>
              <h2 className="loading-text-glow">AI Core is parsing document node trees...</h2>
            </div>
          ) : (
            <h2 className="active-question-prompt-text">
              {questions[currentIdx]}
            </h2>
          )}

          {/* Interactive Voice Processing Input Interface Matrix Canvas Block */}
          <div className="voice-processing-console-zone">
            <div className={`audio-waveform-container ${isRecording ? "recording-active-wave" : ""}`}>
              <div className="wave-bar bar-1"></div>
              <div className="wave-bar bar-2"></div>
              <div className="wave-bar bar-3"></div>
              <div className="wave-bar bar-4"></div>
              <div className="wave-bar bar-5"></div>
            </div>

            <p className="voice-status-feedback-msg">{aiAnalysisFeedback}</p>

            <div className="control-action-buttons-row">
              <button 
                className={`mic-toggle-action-btn ${isRecording ? "btn-red-pulse" : "btn-primary-indigo"}`} 
                onClick={toggleAudioCapture}
                disabled={isAiProcessing}
              >
                {isRecording ? "⏹ Mute Recording Feed" : "🎤 Open Microphone Input Channel"}
              </button>

              <button className="next-step-advance-btn" onClick={advanceNextQuestionBlock} disabled={isAiProcessing}>
                {currentIdx === questions.length - 1 ? "Finish and Analyze Session 🏁" : "Save and Next Question →"}
              </button>
            </div>
          </div>
        </main>

        {/* Right Grid Area: Continuous Live AI Hints and Insights Telemetry Widgets Column */}
        <aside className="live-system-telemetry-sidebar">
          <div className="sidebar-widget-box panel-shadow">
            <h3>AI Vector Telemetry</h3>
            <p className="sidebar-widget-explanation">Real-time dynamic parsing channels currently analyzing user telemetry parameters.</p>
            
            <ul className="telemetry-checklists-tree">
              <li className="active-marker">✓ Resume Token Verification: 100%</li>
              <li className={isAiProcessing ? "pending-marker" : "active-marker"}>
                {isAiProcessing ? "⏱ Generating Questions..." : "✓ Custom Target Grid Mapping: Ready"}
              </li>
              <li className={isRecording ? "active-marker" : "pending-marker"}>
                {isRecording ? "✓ Speech Capture Matrix: Active" : "⏱ Audio Input Track: Idle"}
              </li>
            </ul>
          </div>

          <div className="sidebar-widget-box advice-box">
            <h4>🧠 AI Context Guideline</h4>
            <p>Our algorithms track structural architecture patterns based directly on your document metrics inputs. Mention specific scaling solutions, tools, and technical constraints to hit peak accuracy scores.</p>
          </div>
        </aside>

      </div>
    </div>
  );
}