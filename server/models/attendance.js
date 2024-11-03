const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    sde_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    tableName: "attendance",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["sde_id", "date"],
      },
    ],
  }
);

module.exports = Attendance;
