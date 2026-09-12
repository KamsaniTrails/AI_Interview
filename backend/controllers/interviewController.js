// const pdfParse = require("pdf-parse");
// const Interview = require("../models/interview");
// const OpenAI = require("openai");

// // =========================
// // OPENROUTER CONFIG
// // =========================

// const openai = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1",
// });

// // =========================
// // START INTERVIEW
// // =========================

// const startInterview = async (req, res) => {
//   try {
//     console.log(
//       "========== START INTERVIEW =========="
//     );

//     // =========================
//     // BODY DATA
//     // =========================

//     const { experience } = req.body;

//     console.log(
//       "Experience:",
//       experience
//     );

//     // =========================
//     // VALIDATION
//     // =========================

//     if (!experience) {
//       return res.status(400).json({
//         success: false,
//         message: "Experience required",
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Resume required",
//       });
//     }

//     console.log("Resume Received");

//     // =========================
//     // PDF TEXT EXTRACTION
//     // =========================

//     const data =
//       await pdfParse(req.file.buffer);

//     let resumeText =
//       data.text || "";

//     resumeText =
//       resumeText.slice(0, 5000);

//     console.log("Resume Parsed");

//     // =========================
//     // AI PROMPT
//     // =========================

//     const prompt = `
// You are a senior technical interviewer.

// Analyze the candidate resume carefully.

// Generate 20 UNIQUE interview questions.

// The interview flow must feel realistic.

// QUESTION FLOW:

// 1-5:
// Basic questions

// 6-10:
// Intermediate questions

// 11-15:
// Project and scenario based questions

// 16-20:
// Advanced and optimization questions

// RULES:

// - Questions must be based ONLY on resume skills and projects
// - No generic questions
// - No repeated questions
// - Questions should become harder gradually
// - Output ONLY JSON array
// - No markdown
// - No explanation

// Example:
// [
//   "What is React?",
//   "Explain useEffect hook",
//   "How does JWT authentication work?"
// ]

// Candidate Experience:
// ${experience}

// Resume:
// ${resumeText}
// `;

//     // =========================
//     // OPENROUTER API CALL
//     // =========================

//     console.log(
//       "Calling OpenRouter..."
//     );

//     const completion =
//       await openai.chat.completions.create({
//         model:
//           "openai/gpt-3.5-turbo",

//         messages: [
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],

//         temperature: 0.7,
//       });

//     console.log(
//       "OpenRouter Success"
//     );

//     // =========================
//     // RAW RESPONSE
//     // =========================

//     const raw =
//       completion?.choices?.[0]
//         ?.message?.content || "";

//     console.log("RAW RESPONSE:");
//     console.log(raw);

//     // =========================
//     // PARSE QUESTIONS
//     // =========================

//     let questions = [];

//     try {
//       questions = JSON.parse(
//         raw
//           .replace(/```json/g, "")
//           .replace(/```/g, "")
//       );
//     } catch (err) {
//       console.log(
//         "JSON Parse Failed"
//       );

//       questions = raw
//         .split("\n")
//         .map((q) =>
//           q
//             .replace(
//               /^[0-9.-]\s*/,
//               ""
//             )
//             .trim()
//         )
//         .filter(Boolean);
//     }

//     // =========================
//     // VALIDATE QUESTIONS
//     // =========================

//     if (
//       !questions ||
//       questions.length === 0
//     ) {
//       return res.status(500).json({
//         success: false,
//         message:
//           "AI failed to generate questions",
//       });
//     }

//     console.log(
//       "Questions Generated"
//     );

//     // =========================
//     // FORMAT QUESTIONS
//     // =========================

//     const formattedQuestions =
//       Array.isArray(questions)
//         ? questions.map((q) =>
//             typeof q === "string"
//               ? q
//               : JSON.stringify(q)
//           )
//         : [];

//     // =========================
//     // SAVE DATABASE
//     // =========================

//     const savedInterview =
//       await Interview.create({
//         // userId: "guest-user",
//         userId: req.user.id,

//         experience,

//         resumeText,

//         questions:
//           formattedQuestions,

//         answers: [],

//         score: 0,

//         status: "pending",

//         createdAt: new Date(),
//       });

//     console.log(
//       "Interview Saved"
//     );

//     console.log(
//       "INTERVIEW ID:",
//       savedInterview._id
//     );

//     // =========================
//     // SUCCESS RESPONSE
//     // =========================

//     return res.status(200).json({
//       success: true,

//       sessionId:
//         savedInterview._id.toString(),

//       questions:
//         formattedQuestions,
//     });

//   } catch (err) {

//     console.log(
//       "========== ERROR =========="
//     );

//     console.log(err);

//     return res.status(500).json({
//       success: false,

//       message:
//         "Interview generation failed",

//       error: err.message,
//     });
//   }
// };



// // =========================
// // FINISH INTERVIEW
// // =========================

// const finishInterview = async (req, res) => {

//   try {

//     console.log(
//       "========== FINISH INTERVIEW =========="
//     );

//     console.log("BODY:", req.body);

//     const {
//       answers,
//       score,
//     } = req.body;

//     const savedInterview =
//       await Interview.create({

//         userId: req.user.id,

//         experience: "Junior",

//         questions: [],

//         answers:
//           answers || [],

//         score:
//           score || 0,

//         status:
//           "completed",

//         createdAt:
//           new Date(),
//       });

//     console.log(
//       "FINAL INTERVIEW SAVED"
//     );

//     return res.status(200).json({

//       success: true,

//       message:
//         "Interview saved successfully",

//       interview:
//         savedInterview,
//     });

//   } catch (err) {

//     console.log(
//       "SAVE ERROR:",
//       err
//     );

//     return res.status(500).json({

//       success: false,

//       message:
//         "Failed to save interview",

//       error:
//         err.message,
//     });
//   }
// };

// module.exports = {
//   finishInterview,
// };
// // =========================
// // EXPORT
// // =========================

// module.exports = {
//   startInterview,
//   finishInterview,
// };




const pdfParse = require("pdf-parse");
const Interview = require("../models/interview");
const OpenAI = require("openai");

// =========================
// DEFAULT FALLBACK QUESTIONS (20 items)
// =========================
const defaultQuestions = [
  {
    question: "What is your approach to system architecture and designing scalable APIs?",
    expectedAnswer: "Focus on separation of concerns, choosing appropriate protocols (REST, GraphQL, gRPC), database indexing, caching strategies, and load balancing."
  },
  {
    question: "How do you handle error logging and monitoring in a production application?",
    expectedAnswer: "Use centralized logging solutions like Winston, ELK stack, Datadog, or Sentry, and implement structured error handler middleware."
  },
  {
    question: "Describe how you optimize database query performance for large datasets.",
    expectedAnswer: "Optimize indexes, analyze execution plans (EXPLAIN), avoid N+1 query patterns, use caching (Redis), and normalization/denormalization as appropriate."
  },
  {
    question: "What is the difference between SQL and NoSQL databases, and when would you use each?",
    expectedAnswer: "SQL databases are relational, structured, and ACID-compliant. NoSQL databases are non-relational, flexible, and horizontally scalable. Use SQL for complex transactions and NoSQL for rapid scaling and flexible schemas."
  },
  {
    question: "How do you ensure security in a web application (e.g., authentication, authorization)?",
    expectedAnswer: "Implement JWT or session-based authentication, hashing passwords using bcrypt, HTTPS, CORS policies, sanitizing inputs, and utilizing role-based access control (RBAC)."
  },
  {
    question: "Explain the concept of Event Loop in Node.js.",
    expectedAnswer: "The event loop allows Node.js to perform non-blocking I/O operations by offloading tasks to the system kernel whenever possible, managing execution phases (timers, poll, check)."
  },
  {
    question: "How do you implement CI/CD pipelines for your projects?",
    expectedAnswer: "Use tools like GitHub Actions, GitLab CI, or Jenkins to run linting, automated tests, building assets, and deploying to staging/production on merge/push."
  },
  {
    question: "Explain the difference between synchronous and asynchronous code execution.",
    expectedAnswer: "Synchronous execution runs sequentially, blocking further commands until current finishes. Asynchronous execution runs non-blocking tasks that complete later using callbacks, promises, or async/await."
  },
  {
    question: "How do you manage states in a complex frontend React application?",
    expectedAnswer: "Use context API, Redux/Toolkit, Zustand, or Recoil for global state, and local useState/useReducer hooks for component-specific state."
  },
  {
    question: "What are the core principles of RESTful API design?",
    expectedAnswer: "Statelessness, client-server architecture, cacheability, uniform interface, layered system, and using standard HTTP verbs/status codes."
  },
  {
    question: "What is Git rebase and how does it differ from Git merge?",
    expectedAnswer: "Git merge combines changes preserving history structure, while Git rebase moves the base of a branch to a new commit, creating a clean linear project history."
  },
  {
    question: "What is the purpose of CORS in web development?",
    expectedAnswer: "Cross-Origin Resource Sharing is a browser security mechanism that restricts resources on a webpage from being requested from another domain outside the domain from which the resource originated."
  },
  {
    question: "What is lazy loading and how is it achieved in modern frontend frameworks?",
    expectedAnswer: "Lazy loading delays loading of non-critical resources at page load time. In React, it's done using React.lazy() and Suspense."
  },
  {
    question: "How do you optimize static asset loading in a production frontend application?",
    expectedAnswer: "Use bundling/minification (Vite, Webpack), image optimization, code-splitting, CDN delivery, and proper cache-control headers."
  },
  {
    question: "What is the difference between localStorage, sessionStorage, and cookies?",
    expectedAnswer: "localStorage stores data with no expiration. sessionStorage stores data until session ends. Cookies store data sent with requests and can have set expiration times."
  },
  {
    question: "How does the virtual DOM work in React?",
    expectedAnswer: "React maintains a virtual representation of the UI. When state changes, a new virtual DOM is created, compared (diffed) with the old one, and only the differences are updated in the real DOM."
  },
  {
    question: "Explain the concept of Middleware in Express.js.",
    expectedAnswer: "Middleware functions have access to the request and response objects, and the next middleware function in the application's request-response cycle."
  },
  {
    question: "What is a deadlock in concurrent programming?",
    expectedAnswer: "A situation where two or more processes are blocked forever, each waiting for resources held by the other."
  },
  {
    question: "What are the advantages of using TypeScript over JavaScript?",
    expectedAnswer: "TypeScript provides static type checking, better IDE autocompletion, enhanced code readability, and helps catch errors during development before runtime."
  },
  {
    question: "What are Web Sockets and when should they be used?",
    expectedAnswer: "WebSockets provide full-duplex communication channels over a single TCP connection. Use them for real-time applications like chat or live data feeds."
  }
];

// =========================
// OPENROUTER CONFIG
// =========================

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// =========================
// START INTERVIEW
// =========================

const startInterview = async (req, res) => {

  try {

    console.log("========== START INTERVIEW ==========");

    const { experience } = req.body;

    if (!experience) {
      return res.status(400).json({
        success: false,
        message: "Experience required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume required",
      });
    }

    // =========================
    // PDF PARSE
    // =========================

    const data = await pdfParse(req.file.buffer);

    let resumeText = data.text || "";

    resumeText = resumeText.slice(0, 5000);

    // =========================
    // PROMPT
    // =========================

    const prompt = `
You are a senior technical interviewer.

Analyze the candidate resume carefully.

Generate exactly 20 UNIQUE interview questions, along with a detailed expected answer for each question.

Rules:
- Based only on resume.
- No repeated questions.
- Return ONLY a JSON array of objects with keys "question" and "expectedAnswer". No other keys or wrappers.
- Do NOT wrap in markdown code blocks (like \`\`\`json) or include extra explanation.

Candidate Experience:
${experience}

Resume:
${resumeText}
`;

    // =========================
    // OPENROUTER
    // =========================

    const completion =
      await openai.chat.completions.create({

        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,

      });

    const raw =
      completion?.choices?.[0]?.message?.content || "";

    let questions = [];
    let expectedAnswers = [];

    try {

      const cleanJson = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsedData = JSON.parse(cleanJson);
      if (Array.isArray(parsedData)) {
        questions = parsedData.map((item) => (item.question || "").trim()).filter(Boolean);
        expectedAnswers = parsedData.map((item) => (item.expectedAnswer || "").trim());
      }

    } catch {

      const splitLines = raw
        .split("\n")
        .map((q) => q.replace(/^[0-9.-]\s*/, "").trim())
        .filter(Boolean);

      if (splitLines.length > 0) {
        questions = splitLines;
        expectedAnswers = questions.map(() => "");
      }

    }

    // Strictly enforce exactly 20 questions
    if (questions.length < 20) {
      const needed = 20 - questions.length;
      for (let i = 0; i < needed; i++) {
        const fallback = defaultQuestions[i % defaultQuestions.length];
        questions.push(fallback.question);
        expectedAnswers.push(fallback.expectedAnswer);
      }
    } else if (questions.length > 20) {
      questions = questions.slice(0, 20);
      expectedAnswers = expectedAnswers.slice(0, 20);
    }

    if (!questions.length) {

      return res.status(500).json({
        success: false,
        message: "AI failed to generate questions",
      });

    }

    // =========================
// CANCEL OLD PENDING INTERVIEWS
// =========================

await Interview.updateMany(
  {
    userId: req.user.id,
    status: "pending",
  },
  {
    status: "cancelled",
    completedAt: new Date(),
  }
);

    // =========================
    // SAVE INTERVIEW
    // =========================

    const interview = await Interview.create({

      userId: req.user.id,

      experience,

      resumeText,

      questions,

      expectedAnswers,

      answers: [],

      score: 0,

      status: "pending",

      createdAt: new Date(),

    });

    return res.status(200).json({

      success: true,

      sessionId: interview._id,

      questions,

    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({

      success: false,

      message: "Interview generation failed",

      error: err.message,

    });

  }

};

// =========================
// EXPORT
// =========================

module.exports = {
  startInterview,
};