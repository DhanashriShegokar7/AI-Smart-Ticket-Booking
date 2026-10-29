import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SeatSelection.css";

function SeatSelection() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tickets/${ticketId}`
        );

        setTicket(response.data.ticket);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
          "Failed to load ticket"
        );
      }
    };

    fetchTicket();
  }, [ticketId]);

  function handleSeatClick(seat) {
    if (seat.isBooked) {
      return;
    }

    setSelectedSeat(seat.seatNumber);
  }

  if (message) {
    return <h2>{message}</h2>;
  }

  if (!ticket) {
    return <h2>Loading seats...</h2>;
  }

  return (
    <div className="seat-page">

      <h1>Select Your Seat</h1>

      <div className="journey-info">
        <h2>{ticket.operator}</h2>

        <p>
          {ticket.source} → {ticket.destination}
        </p>

        <p>
          Price: ₹{ticket.price}
        </p>
      </div>

      <div className="seat-layout">

        <div className="driver">
          DRIVER
        </div>

        <div className="seats">

          {ticket.seats.map((seat) => (
            <button
              key={seat.seatNumber}
              className={`seat ${seat.isBooked
                  ? "booked"
                  : selectedSeat === seat.seatNumber
                    ? "selected"
                    : "available"
                }`}
              onClick={() => handleSeatClick(seat)}
              disabled={seat.isBooked}
            >
              {seat.seatNumber}
            </button>
          ))}

        </div>

      </div>

      <div className="seat-legend">

        <span>
          🟢 Available
        </span>

        <span>
          🔴 Booked
        </span>

        <span>
          🔵 Selected
        </span>

      </div>

      <div className="selection-summary">

        <p>
          Selected Seat:{" "}
          <strong>
            {selectedSeat || "None"}
          </strong>
        </p>
        <button
          disabled={!selectedSeat}
          onClick={() =>
            navigate(`/passenger-details/${ticketId}`, {
              state: {
                selectedSeat,
                ticket,
              },
            })
          }
        >
          Continue Booking
        </button>

      </div>

    </div>
  );
}

export default SeatSelection;