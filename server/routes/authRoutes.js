const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
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
} = require("../controllers/authControllers");

router.use(
  cors({
    // origin: 'https://sde-admin.vercel.app',
    origin: "http://localhost:3000",
    credentials: true,
  })
);

router.get("/", test);
router.post("/loginUser", loginUser);
router.get("/getStudents", getStudents);
router.get("/getid", getid);
router.post("/checkStudent", checkStudent);
router.get("/getNotifications", getNotifications);
router.post("/deleteNotifications", deleteNotifications);
router.post("/markAttendence", markAttendance);
router.post("/getAttendence", getAttendance);
router.post("/getAbsent", getAbsent);

module.exports = router;
