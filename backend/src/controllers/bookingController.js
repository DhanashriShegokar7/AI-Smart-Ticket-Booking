const Booking = require("../models/Booking");
const Ticket = require("../models/Ticket");

const createBooking = async (req, res) => {
  try {
    const {
      ticketId,
      passengerName,
      passengerAge,
      passengerGender,
      seatNumber,
    } = req.body;

    // Validate required fields
    if (
      !ticketId ||
      !passengerName ||
      !passengerAge ||
      !passengerGender ||
      !seatNumber
    ) {
      return res.status(400).json({
        message: "All booking details are required",
      });
    }

    // Find ticket
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // Find selected seat
    const seat = ticket.seats.find(
      (seat) => seat.seatNumber === seatNumber
    );

    if (!seat) {
      return res.status(404).json({
        message: "Seat not found",
      });
    }

    // Prevent double booking
    if (seat.isBooked) {
      return res.status(400).json({
        message: "This seat is already booked",
      });
    }

    // Get logged-in user
    const userId = req.user.userId;

    // Generate unique booking ID
    const bookingId =
      "BK" + Date.now();

    // Create booking
    const booking = await Booking.create({
      bookingId,
      user: userId,
      ticket: ticketId,
      passengerName,
      passengerAge,
      passengerGender,
      seatNumber,
      price: ticket.price,
    });

    // Mark seat as booked
    seat.isBooked = true;

    // Decrease available seats
    ticket.availableSeats =
      Math.max(0, ticket.availableSeats - 1);

    await ticket.save();

    res.status(201).json({
      message: "Booking confirmed successfully",
      booking,
    });

  } catch (error) {
    console.error(
      "Create booking error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await Booking.find({
      user: userId,
    })
      .populate("ticket")
      .sort({ createdAt: -1 });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error(
      "Get my bookings error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const userId = req.user.userId;

    // Find booking belonging to logged-in user
    const booking = await Booking.findOne({
      bookingId,
      user: userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Prevent cancelling already cancelled booking
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    // Find ticket
    const ticket = await Ticket.findById(
      booking.ticket
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // Find booked seat
    const seat = ticket.seats.find(
      (seat) =>
        seat.seatNumber === booking.seatNumber
    );

    if (seat) {
      seat.isBooked = false;
    }

    // Increase available seats
    ticket.availableSeats =
      Math.min(
        ticket.totalSeats,
        ticket.availableSeats + 1
      );

    await ticket.save();

    // Update booking status
    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });

  } catch (error) {
    console.error(
      "Cancel booking error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};