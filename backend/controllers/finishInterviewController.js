const Interview = require("../models/interview");
const OpenAI = require("openai");

// =============================
// OPENROUTER CONFIG
// =============================
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// =============================
// FINISH INTERVIEW
// =============================
const finishInterview = async (req, res) => {
  try {
    console.log("========== FINISH INTERVIEW ==========");

    // =============================
    // BODY DATA
    // =============================
    const { answers } = req.body;

    console.log("ANSWERS RECEIVED COUNT:", answers ? answers.length : 0);

    // =============================
    // VALIDATION
    // =============================
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers array required",
      });
    }

    // =============================
    // FIND LATEST PENDING INTERVIEW
    // =============================
    const interview = await Interview.findOne({
      userId: req.user.id,
      status: "pending",
    }).sort({ createdAt: -1 });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const totalQuestions = interview.questions.length;
    const finalEvaluatedList = new Array(totalQuestions);
    const itemsToEvaluateWithAI = [];

    // Pre-process answers
    for (let i = 0; i < totalQuestions; i++) {
      const q = interview.questions[i];
      const expected = (interview.expectedAnswers && interview.expectedAnswers[i]) || "";

      // Find user answer
      const userAnswerObj = answers.find(a => a.question === q);
      const userAnswerText = userAnswerObj ? (userAnswerObj.answer || "").trim() : "";

      if (!userAnswerText || userAnswerText === "No Answer" || userAnswerText.toLowerCase() === "no answer") {
        finalEvaluatedList[i] = {
          question: q,
          answer: "No Answer",
          expectedAnswer: expected,
          evaluation: "Incorrect",
          score: 0,
          feedback: "No answer was provided."
        };
      } else {
        itemsToEvaluateWithAI.push({
          index: i,
          question: q,
          expectedAnswer: expected,
          userAnswer: userAnswerText
        });
      }
    }

    // Evaluate answers with AI if there are any answered questions
    if (itemsToEvaluateWithAI.length > 0) {
      try {
        const evalPrompt = `
You are an expert technical interviewer evaluating a candidate's answers.
Compare each candidate answer with the corresponding expected answer (if expected answer is empty, evaluate the candidate's answer based on how correct it is for the question).

Evaluate each answer based on accuracy, completeness, and correctness.
For each, provide:
1. Classification: "Correct", "Partially Correct", or "Incorrect"
2. Feedback: A concise feedback comment (1-2 sentences) highlighting what was good or what was missing.
3. Score: An integer score from 0 to 10. (0 for Incorrect, 1-9 for Partially Correct, 10 for fully Correct).

Input Data:
${JSON.stringify(itemsToEvaluateWithAI.map(item => ({
  index: item.index,
  question: item.question,
  expectedAnswer: item.expectedAnswer,
  userAnswer: item.userAnswer
})), null, 2)}

Rules:
- You must evaluate every question in the input list.
- Return ONLY a JSON array containing the evaluations, with objects containing "index", "evaluation", "feedback", and "score".
- Do NOT wrap in markdown code blocks (like \`\`\`json) or include any explanations outside the JSON array.
- The output JSON array must have exactly the same length as the input list.
`;

        const completion = await openai.chat.completions.create({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: evalPrompt,
            },
          ],
          temperature: 0.2,
        });

        const rawResult = completion?.choices?.[0]?.message?.content || "";
        console.log("AI EVALUATION RAW RESULT:", rawResult);

        let parsedEvals = [];
        try {
          const cleanJson = rawResult
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          parsedEvals = JSON.parse(cleanJson);
        } catch (e) {
          console.error("Failed to parse AI evaluation JSON:", e);
        }

        itemsToEvaluateWithAI.forEach((item) => {
          const found = Array.isArray(parsedEvals) ? parsedEvals.find(e => e.index === item.index) : null;
          if (found) {
            let evaluationStr = "Partially Correct";
            let scoreVal = 5;
            let feedbackStr = "Answer evaluated.";

            // Handle flat or nested property shapes
            if (typeof found.evaluation === 'string') {
              evaluationStr = found.evaluation;
            } else if (found.evaluation && typeof found.evaluation.classification === 'string') {
              evaluationStr = found.evaluation.classification;
            } else if (typeof found.classification === 'string') {
              evaluationStr = found.classification;
            }

            if (typeof found.score === 'number') {
              scoreVal = found.score;
            } else if (found.evaluation && typeof found.evaluation.score === 'number') {
              scoreVal = found.evaluation.score;
            }

            if (typeof found.feedback === 'string') {
              feedbackStr = found.feedback;
            } else if (found.evaluation && typeof found.evaluation.feedback === 'string') {
              feedbackStr = found.evaluation.feedback;
            }

            // Standardize classification format
            if (evaluationStr && typeof evaluationStr === 'string') {
              const lower = evaluationStr.toLowerCase();
              if (lower.includes('correct') && !lower.includes('partially') && !lower.includes('in')) {
                evaluationStr = "Correct";
              } else if (lower.includes('partial')) {
                evaluationStr = "Partially Correct";
              } else {
                evaluationStr = "Incorrect";
              }
            }

            finalEvaluatedList[item.index] = {
              question: item.question,
              answer: item.userAnswer,
              expectedAnswer: item.expectedAnswer,
              evaluation: evaluationStr,
              score: scoreVal,
              feedback: feedbackStr
            };
          } else {
            finalEvaluatedList[item.index] = {
              question: item.question,
              answer: item.userAnswer,
              expectedAnswer: item.expectedAnswer,
              evaluation: "Partially Correct",
              score: 5,
              feedback: "Answer evaluated with fallback score."
            };
          }
        });
      } catch (err) {
        console.error("OpenRouter API call failed in evaluation:", err);
        // Fallback for all AI items
        itemsToEvaluateWithAI.forEach((item) => {
          finalEvaluatedList[item.index] = {
            question: item.question,
            answer: item.userAnswer,
            expectedAnswer: item.expectedAnswer,
            evaluation: "Partially Correct",
            score: 5,
            feedback: "Evaluation failed due to server error. Standard fallback score applied."
          };
        });
      }
    }

    // Double check that all indices are populated
    for (let i = 0; i < totalQuestions; i++) {
      if (!finalEvaluatedList[i]) {
        finalEvaluatedList[i] = {
          question: interview.questions[i],
          answer: "No Answer",
          expectedAnswer: (interview.expectedAnswers && interview.expectedAnswers[i]) || "",
          evaluation: "Incorrect",
          score: 0,
          feedback: "No answer was provided."
        };
      }
    }

    // Stats calculations
    let totalCorrect = 0;
    let totalPartiallyCorrect = 0;
    let totalIncorrect = 0;
    let overallScore = 0;

    finalEvaluatedList.forEach((item) => {
      overallScore += item.score || 0;
      if (item.evaluation === "Correct") {
        totalCorrect++;
      } else if (item.evaluation === "Partially Correct") {
        totalPartiallyCorrect++;
      } else {
        totalIncorrect++;
      }
    });

    const percentage = Math.round((overallScore / (totalQuestions * 10)) * 100);

    // Performance rating message
    let performance = "";
    if (percentage >= 90) {
      performance = "Excellent Performance";
    } else if (percentage >= 75) {
      performance = "Very Good Performance";
    } else if (percentage >= 60) {
      performance = "Good Performance";
    } else if (percentage >= 40) {
      performance = "Average Performance";
    } else {
      performance = "Needs Improvement";
    }

    // Update Database
    interview.answers = finalEvaluatedList;
    interview.score = percentage; // Compatibility score
    interview.overallScore = overallScore;
    interview.percentage = percentage;
    interview.totalCorrect = totalCorrect;
    interview.totalPartiallyCorrect = totalPartiallyCorrect;
    interview.totalIncorrect = totalIncorrect;
    interview.status = "completed";
    interview.performance = performance;
    interview.completedAt = new Date();

    await interview.save();

    console.log("Interview Updated Successfully with AI evaluation stats.");

    return res.status(200).json({
      success: true,
      message: "Interview completed successfully",
      score: percentage,
      performance,
      totalQuestions,
      answeredQuestions: itemsToEvaluateWithAI.length,
      interview,
    });

  } catch (err) {
    console.log("========== FINISH ERROR ==========");
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to finish interview",
      error: err.message,
    });
  }
};

module.exports = {
  finishInterview,
};