const Ticket = require("../models/Ticket");

const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error.message);

    res.status(500).json({
      message: "Failed to create ticket",
    });
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({
      travelDate: 1,
      departureTime: 1,
    });

    res.status(200).json({
      tickets,
    });
  } catch (error) {
    console.error("Get tickets error:", error.message);

    res.status(500).json({
      message: "Failed to fetch tickets",
    });
  }
};

const searchTickets = async (req, res) => {
  try {
    const {
      source,
      destination,
      travelDate,
      type,
    } = req.query;

    const filter = {};
    if (source) {
      filter.source = {
        $regex: source,
        $options: "i",
      };
    }

    if (destination) {
      filter.destination = {
        $regex: destination,
        $options: "i",
      };
    }

    if (type) {
      filter.type = type.toLowerCase();
    }

    if (travelDate) {
      const startDate = new Date(
        `${travelDate}T00:00:00.000Z`
      );

      const endDate = new Date(
        `${travelDate}T23:59:59.999Z`
      );

      filter.travelDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const tickets = await Ticket.find(filter).sort({
      departureTime: 1,
    });

    res.status(200).json({
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Search tickets error:", error.message);

    res.status(500).json({
      message: "Failed to search tickets",
    });
  }
};

const generateSeats = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const seats = [];

    for (let i = 1; i <= ticket.totalSeats; i++) {
      seats.push({
        seatNumber: `A${i}`,
        isBooked: false,
      });
    }

    ticket.seats = seats;
    ticket.availableSeats = ticket.totalSeats;

    await ticket.save();

    res.status(200).json({
      message: "Seats generated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Generate seats error:", error.message);

    res.status(500).json({
      message: "Failed to generate seats",
    });
  }
};

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      ticket,
    });
  } catch (error) {
    console.error("Get ticket error:", error.message);

    res.status(500).json({
      message: "Failed to fetch ticket",
    });
  }
};

module.exports = {
  createTicket,
  getTickets,
  searchTickets,
  generateSeats,
  getTicketById,
};