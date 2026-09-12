const mongoose =
  require("mongoose");

const interviewSchema =
  new mongoose.Schema({

    userId: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
      required: true,
    },

    questions: {
      type: [String],
      default: [],
    },

    expectedAnswers: {
      type: [String],
      default: [],
    },

    answers: {
      type: Array,
      default: [],
    },

    score: {
      type: Number,
      default: 0,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    totalCorrect: {
      type: Number,
      default: 0,
    },

    totalPartiallyCorrect: {
      type: Number,
      default: 0,
    },

    totalIncorrect: {
      type: Number,
      default: 0,
    },

    performance: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },

    completedAt: {
      type: Date,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports =
  mongoose.model(
    "Interview",
    interviewSchema
  );