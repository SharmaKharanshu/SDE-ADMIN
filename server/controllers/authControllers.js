const { format, getDayOfYear } = require("date-fns");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");

const sequelize = require("../config/database");
const { Op } = require("sequelize");

const Admin = require("../models/admin");

const AdminNotification = require("../models/adminNotification");
const { StudentData, Attendance } = require("../models");

const test = (req, res) => {
  res.json("Test Working");
};

const loginUser = async (req, res) => {
  try {
    const { admin_id, password } = req.body;

    if (!admin_id || !password) {
      return res.json({
        error: "Enter the ADMIN ID and password",
      });
    }

    const user = await Admin.findOne({
      where: { admin_id },
    });

    if (!user) {
      return res.json({
        error: "User does not exist",
      });
    }

    if (user.password === password) {
      // Successful login
      res.send(user);
      console.log("Login Successful:", user);
    } else {
      // Incorrect password
      res.json({
        error: "ADMIN ID or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await StudentData.findAll();
    res.json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getid = async (req, res) => {
  try {
    const result = await StudentData.max("sde_id");
    let lastId = result;
    let numericPart = 0;

    if (lastId) {
      numericPart = parseInt(lastId.replace("SDE", ""));
    }
    numericPart++;

    let numericString = numericPart.toString().padStart(2, "0");
    let nextSDEId = "SDE" + numericString;
    res.json(nextSDEId);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const checkStudent = async (req, res) => {
  const id = req.body.id;

  try {
    const student = await StudentData.findOne({ where: { sde_id: id } });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeStudent = async (req, res) => {
  const sde_id = req.body.sde_id;
  const notificationMessage = `SDE ID - ${sde_id} is removed from SDE Group`;
  const currentTime = new Date();
  const formattedTime = format(currentTime, "dd-MM-yyyy hh:mm:ss aa");
  const status = "unread";

  const transaction = await sequelize.transaction();

  try {
    const result = await StudentData.destroy({
      where: { sde_id },
      transaction,
    });

    if (result === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    await AdminNotification.create(
      {
        alert: notificationMessage,
        time: formattedTime,
        status,
      },
      { transaction }
    );

    await transaction.commit();
    console.log("Student removed successfully");
    res.status(200).send("Student removed successfully");
  } catch (error) {
    await transaction.rollback();
    console.error("Error occurred while removing student:", error);
    res.status(500).json("Error occurred while removing student");
  }
};

const addStudent = async (req, res) => {
  const {
    sde_id,
    name,
    reg_no,
    dept,
    dobFormatted,
    gender,
    desig,
    contact,
    linkedin,
    leetcode,
    gfg,
    codechef,
    portfolio,
    email,
    password,
  } = req.body;
  const notificationMessage = `Student of SDE ID - ${sde_id} is added to SDE Group Successfully`;
  const currentTime = new Date();
  const formattedTime = format(currentTime, "dd-MM-yyyy hh:mm:ss aa");
  const status = "unread";

  const transaction = await sequelize.transaction();

  try {
    const newStudent = await StudentData.create(
      {
        sde_id,
        name,
        reg_no,
        dept,
        dob: dobFormatted,
        gender,
        desig,
        contact,
        linkedin,
        leetcode,
        gfg,
        codechef,
        portfolio,
        email,
        password,
      },
      { transaction }
    );

    const newNotification = await AdminNotification.create(
      {
        alert: notificationMessage,
        time: formattedTime,
        status,
      },
      { transaction }
    );

    await transaction.commit();
    res.json("Student added to DB successfully");
    console.log("Student added to DB successfully");
  } catch (error) {
    await transaction.rollback();
    console.error("Error occurred while adding record:", error);
    res.status(500).json("Error occurred while adding record");
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await AdminNotification.findAll();
    res.json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteNotifications = async (req, res) => {
  try {
    await AdminNotification.destroy({
      where: {},
    });

    res.json("Deleted Notifications Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const markAttendance = async (req, res) => {
  const { sde_id, name, date, time } = req.body;

  try {
    // Check if attendance is already marked for the given student and date
    const existingAttendance = await Attendance.findOne({
      where: {
        sde_id, // SDE18
        date, // 02-11-2024
      },
    });

    if (existingAttendance) {
      return res.json({
        error: "Attendance already marked for the student scanned",
      });
    }

    // If attendance is not already marked, create a new record
    await Attendance.create({
      sde_id,
      name,
      date,
      time,
    });

    console.log("Attendance Marked");
    return res.json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAttendance = async (req, res) => {
  const formattedDate = req.body.formattedDate;

  try {
    const results = await Attendance.findAll({
      where: {
        date: formattedDate,
      },
    });

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAbsent = async (req, res) => {
  const { formattedDate } = req.body;

  try {
    const absentStudents = await StudentData.findAll({
      include: [
        {
          model: Attendance,
          as: "Attendance",
          required: false,
          where: {
            date: formattedDate,
          },
          attributes: [],
        },
      ],
      where: {
        "$Attendance.sde_id$": null,
      },
    });

    res.json(absentStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  const { old_pass, new_pass, admin_id } = req.body;

  try {
    // Find the user by admin_id
    const user = await Admin.findOne({ where: { admin_id } });

    if (!user) {
      return res.json({
        error: "User does not exist",
      });
    }

    // Check if the old password matches
    if (user.password !== old_pass) {
      return res.json({
        error: "Old password does not match",
      });
    }

    // Update the password
    user.password = new_pass; // Set the new password
    await user.save(); // Save the changes to the database

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getCodechef = async () => {
  try {
    const results = await StudentData.findAll({
      attributes: ["codechef", "name", "dept"],
      where: {
        codechef: { [Op.ne]: null },
      },
    });
    return results.map((result) => result.get());
  } catch (err) {
    console.error("Error fetching student data:", err);
    throw err;
  }
};

const fetchCodechefData = async (usersData) => {
  try {
    const userDataPromises = usersData.map(async (userData) => {
      const username = userData.codechef;
      const response = await axios.get(
        `https://codechef-api.vercel.app/handle/${username}`
      );

      if (response.data.success) {
        const data = response.data;
        return {
          codechef: username,
          name: userData.name,
          dept: userData.dept,
          currentRating: data.currentRating,
          highestRating: data.highestRating,
          globalRank: data.globalRank,
          countryRank: data.countryRank,
          stars: data.stars,
        };
      } else {
        return {
          codechef: username,
          name: userData.name,
          dept: userData.dept,
          error: "No data found",
        };
      }
    });
    return Promise.all(userDataPromises);
  } catch (err) {
    throw new Error(`Error fetching data: ${err.message}`);
  }
};

const codechefapi = async (req, res) => {
  try {
    const usersData = await getCodechef();
    const codechefDataArray = await fetchCodechefData(usersData);
    console.log(codechefDataArray);
    res.status(200).send({ success: true, data: codechefDataArray });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};

const getCodeforces = async () => {
  try {
    const results = await StudentData.findAll({
      attributes: ["codeforces", "name", "dept"],
      where: {
        codeforces: { [Op.ne]: null },
      },
    });

    const data = results
      .filter((result) => result.codeforces && result.codeforces.trim() !== "")
      .map((result) => ({
        codeforces: result.codeforces,
        name: result.name,
        dept: result.dept,
      }));

    return data;
  } catch (err) {
    console.error("Error fetching student data:", err);
    throw err;
  }
};

const codeforcesapi = async (req, res) => {
  try {
    const students = await getCodeforces();
    const usernames = students.map((student) => student.codeforces).join(";");

    const response = await axios.get(
      `https://codeforces.com/api/user.info?handles=${usernames}&checkHistoricHandles=false`
    );
    const userData = response.data.result;

    const finalResponse = userData.map((data, index) => ({
      ...data,
      name: students[index].name,
      dept: students[index].dept,
    }));

    res.json(finalResponse);
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};
const leetcodeapi = async (req, res) => {
  try {
    const students = await getLeetcode();
    const fetchPromises = students.map((student) =>
      leetcodefetch(student.leetcode).then((singleRes) => {
        singleRes.name = student.name;
        singleRes.dept = student.dept;
        return singleRes;
      })
    );

    const response = await Promise.all(fetchPromises);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const leetcodefetch = async (username) => {
  const url = "https://leetcode.com/graphql";

  const headers = {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    cookies: "asdfads",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
  };

  const query = `
      query combinedQueries($username: String!) {
          matchedUser(username: $username) {
              submitStatsGlobal {
                  acSubmissionNum {
                      difficulty
                      count
                  }
              }
          }
          userContestRanking(username: $username) {
              attendedContestsCount
              rating
              globalRanking
              totalParticipants
              topPercentage
              badge {
                  name
              }
          }
      }
  `;

  const variables = {
    username: `${username}`,
  };

  const payload = {
    query: query,
    variables: variables,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      const json = await response.json();
      const matchedUser = json.data.matchedUser;
      const contest = json.data.userContestRanking;

      let total = 0;
      if (matchedUser) {
        const problemsSolved = matchedUser.submitStatsGlobal.acSubmissionNum;
        for (const pair of problemsSolved) {
          if (pair.difficulty === "All") {
            total = pair.count;
          }
        }
      }

      let contestCount = 0,
        rating = 0,
        globalRank = 0,
        topPercent = 0;
      if (contest) {
        contestCount = contest.attendedContestsCount;
        rating = contest.rating;
        globalRank = contest.globalRanking;
        topPercent = contest.topPercentage;
      }

      return {
        username: username,
        total: total,
        total_contests_count: contestCount,
        contest_rating: rating,
        global_rank: globalRank,
        top: topPercent,
      };
    } else if (response.status === 404) {
      return {};
    } else {
      throw new Error("Received a 403 Forbidden response");
    }
  } catch (error) {
    console.error(error);
    return {};
  }
};

module.exports = {
  test,
  loginUser,
  getStudents,
  getid,
  addStudent,
  checkStudent,
  removeStudent,
  getNotifications,
  deleteNotifications,
  markAttendance,
  getAttendance,
  getAbsent,
  changePassword,
  codechefapi,
  getCodeforces,
  codeforcesapi,
  leetcodeapi,
  leetcodefetch,
};
