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

module.exports = {
  test,
  loginUser,
  getStudents,
  getid,
  checkStudent,
  getNotifications,
  deleteNotifications,
  markAttendance,
  getAttendance,
  getAbsent,
};
