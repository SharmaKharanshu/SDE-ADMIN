const express = require("express");
const router = express.Router();
const cors = require("cors");
const { test } = require("../controllers/authControllers");

router.use(
  cors({
    // origin: 'https://sde-admin.vercel.app',
    origin: "http://localhost:3000",
    credentials: true,
  })
);

router.get("/", test);

module.exports = router;
