const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AdminNotification = sequelize.define(
  "AdminNotification",
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
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "admin_notifications",
    timestamps: false,
  }
);

module.exports = AdminNotification;
