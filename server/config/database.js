const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("sde", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
