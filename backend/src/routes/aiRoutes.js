const express = require("express");

const {
  recommendTicket,
} = require("../controllers/aiController");

const router = express.Router();

router.post(
  "/recommend",
  recommendTicket
);

module.exports = router;