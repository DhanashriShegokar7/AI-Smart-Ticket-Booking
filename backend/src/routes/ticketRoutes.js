const express = require("express");

const {
  createTicket,
  getTickets,
  searchTickets,
  generateSeats,
  getTicketById,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/search", searchTickets);
router.put("/:id/generate-seats", generateSeats);
router.get("/:id", getTicketById);

module.exports = router;