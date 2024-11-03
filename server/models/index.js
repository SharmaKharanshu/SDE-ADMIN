const StudentData = require("./student");
const Attendance = require("./attendance");

StudentData.hasMany(Attendance, { foreignKey: "sde_id", as: "Attendance" });
Attendance.belongsTo(StudentData, { foreignKey: "sde_id", as: "Student" });

module.exports = { StudentData, Attendance };
