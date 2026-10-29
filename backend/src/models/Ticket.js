const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        operator: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ["bus", "train"],
            required: true,
        },

        source: {
            type: String,
            required: true,
            trim: true,
        },

        destination: {
            type: String,
            required: true,
            trim: true,
        },

        travelDate: {
            type: Date,
            required: true,
        },

        departureTime: {
            type: String,
            required: true,
        },

        arrivalTime: {
            type: String,
            required: true,
        },

        duration: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        totalSeats: {
            type: Number,
            required: true,
            min: 1,
        },


        availableSeats: {
            type: Number,
            required: true,
            min: 0,
        },
        seats: [
            {
                seatNumber: {
                    type: String,
                    required: true,
                },
                isBooked: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;