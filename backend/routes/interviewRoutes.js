// const express = require("express");

// const multer = require("multer");

// const {
//   startInterview,
// } = require(
//   "../controllers/interviewController"
// );

// const {
//   finishInterview,
// } = require(
//   "../controllers/finishInterviewController"
// );

// const router = express.Router();

// // =========================
// // MULTER CONFIG
// // =========================

// const upload = multer({
//   storage: multer.memoryStorage(),
// });

// // =========================
// // START INTERVIEW
// // =========================

// router.post(
//   "/start",
//   upload.single("resume"),
//   startInterview
// );

// // =========================
// // FINISH INTERVIEW
// // =========================

// router.put(
//   // "/:sessionId",
//   "/finish",
//   finishInterview
// );

// // =========================
// // EXPORT
// // =========================

// module.exports = router;


const express = require("express");
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");

const {
  startInterview,
} = require("../controllers/interviewController");

const {
  finishInterview,
} = require("../controllers/finishInterviewController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// =========================
// START INTERVIEW
// =========================

router.post(
  "/start",
  authMiddleware,
  upload.single("resume"),
  startInterview
);

// =========================
// FINISH INTERVIEW
// =========================

router.put(
  "/finish",
  authMiddleware,
  finishInterview
);

module.exports = router;