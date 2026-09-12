const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getHistory,
  getInterviewById,
} = require("../controllers/historycontroller");

router.get(
  "/",
  authMiddleware,
  getHistory
);

router.get(
  "/:id",
  authMiddleware,
  getInterviewById,
);

module.exports = router;