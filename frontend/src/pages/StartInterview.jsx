import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/interview.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig";

export default function StartInterview() {
  // =========================
  // STEP CONTROL
  // =========================
  const [currentStep, setCurrentStep] = useState(1);

  // =========================
  // FILE + EXPERIENCE
  // =========================
const navigate = useNavigate();
const [resume, setResume] = useState(null);

const [experience, setExperience] =
  useState("");

// const [interviewId, setinterviewId] =
//   useState(null);

const [answers, setAnswers] =
  useState([]);

const [currentAnswer, setCurrentAnswer] =
  useState("");

const [finalScore, setFinalScore] =
  useState(null);
  // =========================
  // UI STATES
  // =========================
  const [isDragActive, setIsDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  // =========================
  // INTERVIEW STATES
  // =========================
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // =========================
  // AI FEEDBACK
  // =========================
  const [aiAnalysisFeedback, setAiAnalysisFeedback] = useState(
    "Camera and microphone initialized successfully."
  );

  // =========================
  // HARDWARE STATUS
  // =========================
  const [hardwareStatus, setHardwareStatus] = useState({
    camera: "Initializing",
    mic: "Initializing",
  });

  // =========================
  // REFERENCES
  // =========================
  const videoElementRef = useRef(null);
  const mediaStreamTrackRef = useRef(null);
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);

  // =========================
// TEXT TO SPEECH
// =========================
const speakQuestion = (text) => {

  if (!text) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 0.9;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
};
// =========================
// START SPEECH RECOGNITION
// =========================

const startSpeechRecognition = () => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported");
    return;
  }

  // Stop previous recognition if already running
  if (recognitionRef.current) {
    recognitionRef.current.stop();
    // recognitionRef.current = null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {

    let transcript = "";

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {
      transcript += event.results[i][0].transcript;
    }

    setCurrentAnswer(transcript);
  };

  recognition.onerror = (event) => {
    console.log("Speech Recognition Error:", event.error);
  };

  recognition.onend = () => {
    console.log("Speech Recognition Stopped");
      if (isRecordingRef.current) {
        recognition.start();
      }else{
        recognitionRef.current = null;
      }
  };

  // Save reference BEFORE starting
  recognitionRef.current = recognition;

  recognition.start();
};

  // =========================
  // CAMERA + TIMER
  // =========================
  useEffect(() => {
    let timerInterval;

    if (currentStep === 4) {
      startCameraAndMic();

      timerInterval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }

      stopMediaTracks();
    };
  }, [currentStep]);

  // =========================
  // START CAMERA
  // =========================
  const startCameraAndMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      mediaStreamTrackRef.current = stream;

      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
      }

      setHardwareStatus({
        camera: "Connected",
        mic: "Connected",
      });
    } catch (error) {
      console.log(error);

      setHardwareStatus({
        camera: "Blocked",
        mic: "Blocked",
      });

      setAiAnalysisFeedback(
        "❌ Camera or microphone permission denied."
      );
    }
  };

  // =========================
  // STOP MEDIA
  // =========================
  const stopMediaTracks = () => {
    if (mediaStreamTrackRef.current) {
      mediaStreamTrackRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }
  };


  // =========================
// SPEAK QUESTION AUTOMATICALLY
// =========================
useEffect(() => {

  if (
    currentStep === 4 &&
    generatedQuestions.length > 0 &&
    generatedQuestions[currentIdx]
  ) {

    speakQuestion(
      generatedQuestions[currentIdx]
    );

  }

}, [
  currentStep,
  currentIdx,
  generatedQuestions,
]);

  // =========================
  // DRAG EVENTS
  // =========================
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      e.type === "dragenter" ||
      e.type === "dragover"
    ) {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // =========================
  // DROP FILE
  // =========================
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      setResume(e.dataTransfer.files[0]);
      setCurrentStep(2);
    }
  };

  // =========================
  // FILE INPUT
  // =========================
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setResume(e.target.files[0]);
      setCurrentStep(2);
    }
  };



  // =========================
// GENERATE QUESTIONS
// =========================
const selectExperienceTier = async (tier) => {
  try {

    // STEP SETUP
    setExperience(tier);
    setCurrentStep(3);
    setIsGenerating(true);

    // VALIDATE RESUME
    if (!resume) {
      alert("Please upload resume");
      setCurrentStep(1);
      setIsGenerating(false);
      return;
    }

    // FORM DATA
    const formData = new FormData();

    formData.append("resume", resume);
    formData.append("experience", tier);

    // TOKEN
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);
    console.log("RESUME:", resume);
    console.log("EXPERIENCE:", tier);

    // API CALL
    const response = await axios.post(
      `${API_BASE_URL}/api/interview/start`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",

          // token unte only add cheyyi
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      }
    );

    console.log("BACKEND RESPONSE:", response.data);

    // QUESTIONS CHECK
    if (
      !response.data ||
      !response.data.questions
    ) {
      throw new Error(
        "Questions not received from backend"
      );
    }


// SAVE QUESTIONS
setGeneratedQuestions(
  response.data.questions
);

console.log(
  "FULL RESPONSE:",
  response.data
);

    // MOVE TO STEP 4
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(4);
    }, 2000);

  } catch (error) {

    console.log("FULL ERROR:", error);

    console.log(
      "ERROR RESPONSE:",
      error?.response
    );

    console.log(
      "ERROR DATA:",
      error?.response?.data
    );

    const status =
      error?.response?.status || "UNKNOWN";

    const backendMessage =
      error?.response?.data?.message;

    const backendError =
      error?.response?.data?.error;

    const finalMessage = `
STATUS: ${status}

MESSAGE:
${backendMessage || "Unknown backend error"}

ERROR:
${backendError || error.message}
`;

    alert(finalMessage);

    setCurrentStep(2);
    setIsGenerating(false);
  }
};

const stopSpeechRecognition = () => {
  isRecordingRef.current = false;
  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }

};

const toggleAudioCapture = () => {

    const nextState = !isRecording;

    if (nextState) {

        setIsRecording(true);
        isRecordingRef.current = true;
        if (!recognitionRef.current) {
          startSpeechRecognition();
        }
        setAiAnalysisFeedback(
            "🎤 Listening... Please answer the question."
        );

    } else {

        setIsRecording(false);
        isRecordingRef.current = false;
        stopSpeechRecognition();
        setAiAnalysisFeedback(
            "✅ Recording stopped. Click Next Question to save your answer."
        );
    }
};

      // =========================
      // NEXT QUESTION
      // =========================
  const advanceNextQuestionBlock = async () => {
  // Stop recording if it is still active
  if (isRecording) {
    stopSpeechRecognition();
    setIsRecording(false);
    isRecordingRef.current = false;
  }

  const answerObj = {
    question: generatedQuestions[currentIdx],
    answer: currentAnswer.trim() || "No Answer",
  };

  // =========================
  // NEXT QUESTION
  // =========================
  if (currentIdx < generatedQuestions.length - 1) {

    setAnswers((prev) => [...prev, answerObj]);

    setCurrentAnswer("");

    setCurrentIdx((prev) => prev + 1);

    setAiAnalysisFeedback(
      "Next AI question loaded."
    );

    return;
  }

  // =========================
  // FINISH INTERVIEW
  // =========================
  try {

    // stopMediaTracks();
    // stopSpeechRecognition();
    stopSpeechRecognition();
    recognitionRef.current = null;
    stopMediaTracks();
    window.speechSynthesis.cancel();

    const finalAnswers = [...answers, answerObj];

    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_BASE_URL}/api/interview/finish`,
      {
        answers: finalAnswers,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("INTERVIEW SAVED:", response.data);

    alert(
      `🎉 Interview Completed!\n\nScore: ${response.data.score}%`
    );

    setTimeout(() => {
      // window.location.href = "/dashboard";
      navigate("/dashboard");
    }, 1500);

  } catch (err) {

    console.log("SAVE ERROR:", err);

    console.log(err?.response?.data);

    alert("Interview completed but saving failed");
  }
};



      // =========================
      // Stop Button
      // =========================

  const stopInterview = () => {
    const confirmStop = window.confirm(
        "Are you sure you want to stop the interview?"
    );

    if (!confirmStop) return;
    setIsRecording(false);
    isRecordingRef.current = false;
    stopSpeechRecognition();
    recognitionRef.current = null;
    stopMediaTracks();
    window.speechSynthesis.cancel();
    setTimer(0);
    alert("Interview stopped.");

    // window.location.href = "/dashboard";
    navigate("/dashboard");
};

  // =========================
  // TIMER FORMAT
  // =========================
  const formatTimeToken = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;

    return `${mins
      .toString()
      .padStart(2, "0")}:${remaining
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={`wizard-master-viewport ${
        currentStep === 4
          ? "dark-theme-immersion"
          : ""
      }`}
    >
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      {currentStep < 4 && (
        <div className="stepper-header-bar">
          {[
            {
              step: 1,
              label: "Upload Resume",
            },
            {
              step: 2,
              label: "Select Experience",
            },
            {
              step: 3,
              label: "AI Question Extraction",
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`step-node ${
                currentStep >= item.step
                  ? "active-node"
                  : ""
              } ${
                currentStep === item.step
                  ? "current-node"
                  : ""
              }`}
            >
              <div className="node-circle">
                {item.step}
              </div>

              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}

      <div className="workspace-dynamic-canvas">
        {/* ========================= */}
        {/* STEP 1 */}
        {/* ========================= */}

        {currentStep === 1 && (
          <div className="wizard-pane-card animation-fade">
            <h2>Upload Your Resume</h2>

            <p>
              Upload resume to generate AI interview
              questions.
            </p>

            <div
              className={`drag-drop-zone ${
                isDragActive
                  ? "drag-active"
                  : ""
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="ghost-file-input"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />

              <span className="pane-icon">
                📄
              </span>

              <h3>
                Drag & Drop Resume Here
              </h3>

              <p>
                PDF and DOCX supported
              </p>

              <button className="native-browse-btn">
                Browse Files
              </button>
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* STEP 2 */}
        {/* ========================= */}

        {currentStep === 2 && (
          <div className="wizard-pane-card animation-fade">
            <h2>
              Select Experience Level
            </h2>

            <p>
              Choose your experience level.
            </p>

            <div className="experience-grid-matrix">
              {[
                {
                  title: "Junior Track",
                  range: "0 - 2 Years",
                  code: "Junior",
                },
                {
                  title: "Mid-Senior Level",
                  range: "3 - 5 Years",
                  code: "Mid-Senior",
                },
                {
                  title:
                    "Lead / Staff Architect",
                  range: "5+ Years",
                  code: "Principal",
                },
              ].map((tier) => (
                <button
                  key={tier.code}
                  className="tier-selection-card"
                  onClick={() =>
                    selectExperienceTier(
                      tier.code
                    )
                  }
                >
                  <span className="tier-badge">
                    LVL
                  </span>

                  <h3>{tier.title}</h3>

                  <p>{tier.range}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* STEP 3 */}
        {/* ========================= */}

        {currentStep === 3 &&
          isGenerating && (
            <div className="wizard-pane-card text-center animation-fade">
              <div className="radar-sonar-spinner"></div>

              <h2>
                Generating AI Questions...
              </h2>

              <p>
                AI is analyzing your
                resume.
              </p>

              <div className="dynamic-processing-console-log">
                <p className="log-line animate-log-1">
                  › Extracting resume
                  data...
                </p>

                <p className="log-line animate-log-2">
                  › Preparing{" "}
                  {experience} level
                  questions...
                </p>
              </div>
            </div>
          )}

        {/* ========================= */}
        {/* STEP 4 */}
        {/* ========================= */}

        {currentStep === 4 && (
          <div className="live-session-viewport-inner animation-fade">
            {/* TOP HEADER */}

            <header className="live-session-top-meta">
              <div className="meta-left-tags">
                <span className="live-pulse-indicator"></span>

                <span className="bold-session-label">
                  LIVE AI INTERVIEW
                </span>

                <div className="vertical-spacer"></div>

                <p className="loaded-resume-badge">
                  📄 {resume?.name}
                </p>
              </div>

              <div className="meta-right-clock">
                ⏱ {formatTimeToken(timer)}
              </div>
            </header>

            {/* GRID */}

            <div className="live-workspace-grid">
              {/* QUESTIONS */}

              <main className="live-question-canvas-card">
                <div className="question-stage-header">
                  <span className="question-index-token">
                    QUESTION{" "}
                    {currentIdx + 1} OF{" "}
                    {
                      generatedQuestions.length
                    }
                  </span>

                  <div className="difficulty-tier-badge">
                    {experience}
                  </div>
                </div>

                <h2 className="active-question-prompt-text">
                  {
                    generatedQuestions[
                      currentIdx
                    ]
                  }
                </h2>

                {/* AUDIO */}

                <div className="voice-processing-console-zone">
                  <div
                    className={`audio-waveform-container ${
                      isRecording
                        ? "recording-active-wave"
                        : ""
                    }`}
                  >
                    <div className="wave-bar bar-1"></div>
                    <div className="wave-bar bar-2"></div>
                    <div className="wave-bar bar-3"></div>
                    <div className="wave-bar bar-4"></div>
                    <div className="wave-bar bar-5"></div>
                  </div>

                  <p className="voice-status-feedback-msg">
                    {aiAnalysisFeedback}
                  </p>
                  <textarea
                    placeholder="Type your answer here..."
                    value={currentAnswer}
                    onChange={(e) =>
                      setCurrentAnswer(e.target.value)
                    }
                    className="answer-textarea"
                    rows={10}
                    style={{
                      minHeight: "240px",
                      width: "100%",
                      resize: "vertical",
                      fontSize: "16px",
                      padding: "15px"
                    }}
                  />

                  {/* BUTTONS */}

                  {/* <div className="control-action-buttons-row">
                    <button
                      className={`mic-toggle-action-btn ${
                        isRecording
                          ? "btn-red-pulse"
                          : "btn-primary-indigo"
                      }`}
                      onClick={
                        toggleAudioCapture
                      }
                      disabled={
                        hardwareStatus.mic !==
                        "Connected"
                      }
                    >
                      {isRecording
                        ? "⏹ Stop Recording"
                        : "🎤 Start Recording"}
                    </button>

                    <button
                      className="next-step-advance-btn"
                      onClick={
                        advanceNextQuestionBlock
                      }
                    >
                      {currentIdx ===
                      generatedQuestions.length -
                        1
                        ? "Finish Interview 🏁"
                        : "Next Question →"}
                    </button>
                  </div> */}
                  <div className="control-action-buttons-row">
                  <button
                    className={`mic-toggle-action-btn ${
                      isRecording
                        ? "btn-red-pulse"
                        : "btn-primary-indigo"
                    }`}
                    onClick={toggleAudioCapture}
                    disabled={hardwareStatus.mic !== "Connected"}
                  >
                    {isRecording
                      ? "⏹ Stop Recording"
                      : "🎤 Start Recording"}
                  </button>

                  <button
                    className="next-step-advance-btn"
                    onClick={advanceNextQuestionBlock}
                  >
                    {currentIdx === generatedQuestions.length - 1
                      ? "🏁 Finish Interview"
                      : "➡ Next Question"}
                  </button>

                  <button
                    className="stop-interview-btn"
                    onClick={stopInterview}
                  >
                    🛑 Stop Interview
                  </button>

                </div>
                </div>
              </main>

              {/* SIDEBAR */}

              <aside className="live-system-telemetry-sidebar">
                <div className="live-camera-preview-container">
                  <video
                    ref={videoElementRef}
                    autoPlay
                    playsInline
                    muted
                    className="embedded-hardware-video-frame"
                  />

                  <div className="camera-overlay-badge">
                    LIVE CAMERA
                  </div>
                </div>

                <div className="sidebar-widget-box">
                  <h3>
                    Hardware Status
                  </h3>

                  <ul className="telemetry-checklists-tree">
                    <li
                      className={
                        hardwareStatus.camera ===
                        "Connected"
                          ? "active-marker"
                          : "error-marker"
                      }
                    >
                      ✓ Webcam Connected
                    </li>

                    <li
                      className={
                        hardwareStatus.mic ===
                        "Connected"
                          ? "active-marker"
                          : "error-marker"
                      }
                    >
                      ✓ Microphone Connected
                    </li>

                    <li
                      className={
                        isRecording
                          ? "active-marker"
                          : "pending-marker"
                      }
                    >
                      {isRecording
                        ? "✓ Recording Active"
                        : "⏱ Recording Idle"}
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




