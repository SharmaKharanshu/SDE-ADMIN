const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudentNotification = sequelize.define(
  "StudentNotification",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    alert: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    sde_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    tableName: "student_notifications",
    timestamps: false,
  }
);

module.exports = StudentNotification;
