const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Admin = sequelize.define(
  "Admin",
  {
    admin_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    desig: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    tableName: "admin_data",
    timestamps: false,
  }
);

module.exports = Admin;
