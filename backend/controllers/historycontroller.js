// const Interview = require("../models/interview");

// // ===============================
// // GET ALL INTERVIEWS
// // ===============================

// const getHistory = async (req, res) => {

//   try {

// const interviews = await Interview.find().sort({ createdAt: -1 });
// console.log(interviews);


//     res.status(200).json({
//       success: true,
//       interviews,
//     });

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });

//   }

// };

// // ===============================
// // GET SINGLE INTERVIEW
// // ===============================

// const getInterviewById = async (req, res) => {

//   try {

//     const interview = await Interview.findById(
//       req.params.id
//     );

//     if (!interview) {

//       return res.status(404).json({
//         success: false,
//         message: "Interview not found",
//       });

//     }

//     res.status(200).json({
//       success: true,
//       interview,
//     });

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });

//   }

// };

// module.exports = {
//   getHistory,
//   getInterviewById,
// };


const Interview = require("../models/interview");

// ===============================
// GET ALL INTERVIEWS
// ===============================

const getHistory = async (req, res) => {

  try {

    const interviews = await Interview.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      interviews,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// ===============================
// GET SINGLE INTERVIEW
// ===============================

const getInterviewById = async (req, res) => {

  try {

    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview) {

      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });

    }

    res.status(200).json({
      success: true,
      interview,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

module.exports = {
  getHistory,
  getInterviewById,
};
