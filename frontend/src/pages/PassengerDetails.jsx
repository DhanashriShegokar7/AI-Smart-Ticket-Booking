import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./PassengerDetails.css";

function PassengerDetails() {
  const { ticketId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const selectedSeat = location.state?.selectedSeat;
  const ticket = location.state?.ticket;

  const [formData, setFormData] = useState({
    passengerName: "",
    passengerAge: "",
    passengerGender: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleBooking(event) {
    event.preventDefault();

    if (!selectedSeat) {
      setMessage("Please select a seat first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          ticketId,
          passengerName: formData.passengerName,
          passengerAge: Number(formData.passengerAge),
          passengerGender: formData.passengerGender,
          seatNumber: selectedSeat,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/booking-success", {
        state: {
          booking: response.data.booking,
          ticket,
        },
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="passenger-page">

      <div className="passenger-container">

        <h1>Passenger Details</h1>

        {ticket && (
          <div className="booking-info">

            <h2>{ticket.operator}</h2>

            <p>
              {ticket.source} → {ticket.destination}
            </p>

            <p>
              Selected Seat:{" "}
              <strong>{selectedSeat}</strong>
            </p>

            <p>
              Price: ₹{ticket.price}
            </p>

          </div>
        )}

        <form onSubmit={handleBooking}>

          <div className="form-field">

            <label>
              Passenger Name
            </label>

            <input
              type="text"
              name="passengerName"
              placeholder="Enter passenger name"
              value={formData.passengerName}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-field">

            <label>
              Age
            </label>

            <input
              type="number"
              name="passengerAge"
              placeholder="Enter age"
              min="1"
              max="120"
              value={formData.passengerAge}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-field">

            <label>
              Gender
            </label>

            <select
              name="passengerGender"
              value={formData.passengerGender}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>

          </div>

          {message && (
            <p className="booking-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Booking..."
              : "Confirm Booking"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default PassengerDetails;