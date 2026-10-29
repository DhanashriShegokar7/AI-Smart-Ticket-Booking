const express = require("express");
const router = express.Router();

const { createBooking,getMyBookings,cancelBooking, } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/my-bookings", authMiddleware, getMyBookings);
router.post("/", authMiddleware, createBooking);
router.put(
  "/cancel/:bookingId",
  authMiddleware,
  cancelBooking
);


module.exports = router;