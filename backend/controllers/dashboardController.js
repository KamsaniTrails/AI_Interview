const Interview =
  require("../models/interview");

// =========================
// GET DASHBOARD DATA
// =========================

const getDashboardData =
  async (req, res) => {

    try {

      // =====================
      // GET ALL INTERVIEWS
      // =====================

      const allInterviews =
        await Interview.find({
          userId: req.user.id,
        })
          .sort({ createdAt: -1 });

      // =====================
      // ONLY COMPLETED COUNT
      // =====================

      const interviews = allInterviews.filter(
        (item) => item.status === "completed"
      );

      // =====================
      // TOTAL INTERVIEWS
      // =====================

      const totalInterviews =
        interviews.length;

      // =====================
      // AVG SCORE
      // =====================
      // AVG SCORE & ANSWERS STATS
      // =====================

      let avgScore = 0;
      let totalCorrect = 0;
      let totalPartiallyCorrect = 0;
      let totalIncorrect = 0;

      if (totalInterviews > 0) {

        const totalScore =
          interviews.reduce(
            (acc, item) =>
              acc + (item.score || 0),
            0
          );

        avgScore = Math.round(
          totalScore / totalInterviews
        );

        interviews.forEach((item) => {
          totalCorrect += item.totalCorrect || 0;
          totalPartiallyCorrect += item.totalPartiallyCorrect || 0;
          totalIncorrect += item.totalIncorrect || 0;
        });
      }

      // =====================
      // BEST SCORE
      // =====================

      let bestScore = 0;

      if (totalInterviews > 0) {

        bestScore = Math.max(
          ...interviews.map(
            (item) =>
              item.score || 0
          )
        );
      }

      // =====================
      // RESPONSE
      // =====================

      return res.status(200).json({

        success: true,

        stats: {
          totalInterviews,
          avgScore,
          bestScore,
          totalCorrect,
          totalPartiallyCorrect,
          totalIncorrect,
        },

        interviews,

      });

    } catch (err) {

      console.log(err);

      return res.status(500).json({

        success: false,

        message:
          "Dashboard fetch failed",

      });
    }
  };

module.exports = {
  getDashboardData,
};