const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudentData = sequelize.define(
  "StudentData",
  {
    sde_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dob: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    reg_no: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dept: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    desig: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    linkedin: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    leetcode: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    gfg: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    codechef: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    portfolio: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    codeforces: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    github: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    tableName: "student_data",
    timestamps: false,
  }
);

module.exports = StudentData;
