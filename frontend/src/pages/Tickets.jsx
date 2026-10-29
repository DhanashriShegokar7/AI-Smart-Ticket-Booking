import { useEffect, useState } from "react";
import axios from "axios";
import "./Tickets.css";

function Tickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(response.data.bookings);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this ticket?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setMessage("");

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/bookings/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchBookings();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to cancel ticket"
      );
    }
  };

  if (loading) {
    return (
      <div className="tickets-page">
        <h2>Loading tickets...</h2>
      </div>
    );
  }

  return (
    <div className="tickets-page">

      <div className="tickets-container">

        <h1>My Tickets</h1>

        {message && (
          <p className="tickets-message">
            {message}
          </p>
        )}

        {!message && bookings.length === 0 && (
          <div className="no-tickets">
            <h2>No bookings found</h2>

            <p>
              You have not booked any tickets yet.
            </p>
          </div>
        )}

        <div className="tickets-list">

          {bookings.map((booking) => (

            <div
              className="ticket-card"
              key={booking._id}
            >

              <div className="ticket-header">

                <div>
                  <h2>
                    {booking.ticket?.operator}
                  </h2>

                  <p>
                    {booking.ticket?.source} →{" "}
                    {booking.ticket?.destination}
                  </p>
                </div>

                <span
                  className={`ticket-status ${booking.status}`}
                >
                  {booking.status}
                </span>

              </div>

              <div className="ticket-details">

                <div>
                  <span>Booking ID</span>
                  <strong>
                    {booking.bookingId}
                  </strong>
                </div>

                <div>
                  <span>Passenger</span>
                  <strong>
                    {booking.passengerName}
                  </strong>
                </div>

                <div>
                  <span>Seat</span>
                  <strong>
                    {booking.seatNumber}
                  </strong>
                </div>

                <div>
                  <span>Price</span>
                  <strong>
                    ₹{booking.price}
                  </strong>
                </div>

              </div>

              {booking.status === "confirmed" && (
                <button
                  className="cancel-button"
                  onClick={() =>
                    handleCancel(booking.bookingId)
                  }
                >
                  Cancel Ticket
                </button>
              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Tickets;