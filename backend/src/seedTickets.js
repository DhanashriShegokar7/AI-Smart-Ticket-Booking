const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Ticket = require("./models/Ticket");
const Booking = require("./models/Booking");

dotenv.config();

const generateSeats = (count) => {
  const seats = [];

  for (let i = 1; i <= count; i++) {
    seats.push({
      seatNumber: `A${i}`,
      isBooked: false,
    });
  }

  return seats;
};


const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};


const createTicket = ({
  operator,
  type,
  source,
  destination,
  travelDate,
  departureTime,
  arrivalTime,
  duration,
  price,
  totalSeats = 40,
}) => {
  return {
    operator,
    type,
    source,
    destination,
    travelDate,
    departureTime,
    arrivalTime,
    duration,
    price,
    totalSeats,
    availableSeats: totalSeats,
    seats: generateSeats(totalSeats),
  };
};


const seedTickets = async () => {
  try {

    const mongoUrl =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI;

    if (!mongoUrl) {
      throw new Error(
        "MongoDB connection string not found in .env"
      );
    }

    await mongoose.connect(mongoUrl);

    console.log("MongoDB connected successfully");


    // ==========================================
    // DELETE OLD TICKETS
    // ==========================================

    // DELETE OLD BOOKINGS
    await Booking.deleteMany({});

    console.log("Old bookings deleted");
 
    await Ticket.deleteMany({});

    console.log("Old tickets deleted");


    // ==========================================
    // START DATE
    // ==========================================

    const startDate = new Date("2026-08-23T00:00:00.000Z");


    const tickets = [];


    // ==========================================
    // TRAIN DATA
    // ==========================================

    const trains = [

      {
        operator: "Gitanjali Express",
        departureTime: "07:45",
        arrivalTime: "11:58",
        duration: "4 hours 13 minutes",
        price: 760,
      },

      {
        operator: "Maharashtra Express",
        departureTime: "10:45",
        arrivalTime: "15:48",
        duration: "5 hours 3 minutes",
        price: 520,
      },

      {
        operator: "SHM LTT Express",
        departureTime: "13:35",
        arrivalTime: "18:18",
        duration: "4 hours 43 minutes",
        price: 600,
      },

      {
        operator: "HWH CSMT Mail",
        departureTime: "14:00",
        arrivalTime: "18:58",
        duration: "4 hours 58 minutes",
        price: 580,
      },

      {
        operator: "Azad Hind Express",
        departureTime: "15:55",
        arrivalTime: "20:09",
        duration: "4 hours 14 minutes",
        price: 650,
      },

      {
        operator: "Vidarbha Express",
        departureTime: "17:00",
        arrivalTime: "21:23",
        duration: "4 hours 23 minutes",
        price: 700,
      },

      {
        operator: "Pune Garib Rath",
        departureTime: "18:00",
        arrivalTime: "22:23",
        duration: "4 hours 23 minutes",
        price: 450,
      },

      {
        operator: "HWH ADI Superfast",
        departureTime: "19:00",
        arrivalTime: "23:24",
        duration: "4 hours 24 minutes",
        price: 620,
      },

      {
        operator: "Sevagram Express",
        departureTime: "21:15",
        arrivalTime: "01:38",
        duration: "4 hours 23 minutes",
        price: 550,
      },

    ];


    // ==========================================
    // BUS DATA
    // ==========================================

    const buses = [

      {
        operator: "MSRTC Shivshahi",
        departureTime: "06:00",
        arrivalTime: "12:30",
        duration: "6 hours 30 minutes",
        price: 350,
      },

      {
        operator: "MSRTC Express",
        departureTime: "08:00",
        arrivalTime: "14:30",
        duration: "6 hours 30 minutes",
        price: 280,
      },

      {
        operator: "MSRTC Shivai",
        departureTime: "10:00",
        arrivalTime: "16:30",
        duration: "6 hours 30 minutes",
        price: 320,
      },

      {
        operator: "MSRTC Ordinary",
        departureTime: "13:00",
        arrivalTime: "19:45",
        duration: "6 hours 45 minutes",
        price: 220,
      },

      {
        operator: "MSRTC Shivshahi",
        departureTime: "16:00",
        arrivalTime: "22:30",
        duration: "6 hours 30 minutes",
        price: 350,
      },

      {
        operator: "MSRTC Express",
        departureTime: "20:00",
        arrivalTime: "02:30",
        duration: "6 hours 30 minutes",
        price: 300,
      },

    ];


    // ==========================================
    // ROUTES
    // ==========================================

    const trainRoutes = [

      {
        source: "Nagpur",
        destination: "Shegaon",
      },

      {
        source: "Nagpur",
        destination: "Akola",
      },

      {
        source: "Nagpur",
        destination: "Bhusawal",
      },

      {
        source: "Nagpur",
        destination: "Mumbai",
      },

      {
        source: "Nagpur",
        destination: "Pune",
      },

      {
        source: "Nagpur",
        destination: "Amravati",
      },

    ];


    const busRoutes = [

      {
        source: "Nagpur",
        destination: "Shegaon",
      },

      {
        source: "Nagpur",
        destination: "Amravati",
      },

      {
        source: "Nagpur",
        destination: "Akola",
      },

      {
        source: "Nagpur",
        destination: "Buldhana",
      },

      {
        source: "Nagpur",
        destination: "Wardha",
      },

      {
        source: "Nagpur",
        destination: "Chandrapur",
      },

    ];


    // ==========================================
    // CREATE MULTIPLE DATES
    // ==========================================

    for (let day = 0; day < 14; day++) {

      const travelDate = addDays(
        startDate,
        day
      );


      // ========================================
      // TRAIN TICKETS
      // ========================================

      for (const route of trainRoutes) {

        for (const train of trains) {

          tickets.push(
            createTicket({
              operator: train.operator,
              type: "train",
              source: route.source,
              destination: route.destination,
              travelDate,
              departureTime: train.departureTime,
              arrivalTime: train.arrivalTime,
              duration: train.duration,
              price: train.price,
              totalSeats: 60,
            })
          );

        }

      }


      // ========================================
      // BUS TICKETS
      // ========================================

      for (const route of busRoutes) {

        for (const bus of buses) {

          tickets.push(
            createTicket({
              operator: bus.operator,
              type: "bus",
              source: route.source,
              destination: route.destination,
              travelDate,
              departureTime: bus.departureTime,
              arrivalTime: bus.arrivalTime,
              duration: bus.duration,
              price: bus.price,
              totalSeats: 40,
            })
          );

        }

      }

    }


    // ==========================================
    // INSERT ALL TICKETS
    // ==========================================

    await Ticket.insertMany(tickets);


    console.log(
      `${tickets.length} tickets created successfully`
    );


    console.log(
      "Train tickets:",
      tickets.filter(
        (ticket) => ticket.type === "train"
      ).length
    );


    console.log(
      "Bus tickets:",
      tickets.filter(
        (ticket) => ticket.type === "bus"
      ).length
    );


    await mongoose.connection.close();

    console.log("MongoDB connection closed");

  } catch (error) {

    console.error(
      "Ticket seed error:",
      error.message
    );

    process.exit(1);
  }
};


seedTickets();