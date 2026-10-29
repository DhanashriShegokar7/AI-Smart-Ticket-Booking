import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSuccess.css";
import { QRCodeCanvas } from "qrcode.react";

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;
  const ticket = location.state?.ticket;

  if (!booking) {
    return (
      <div className="booking-success-page">
        <div className="success-container">
          <h2>Booking details not found</h2>

          <button onClick={() => navigate("/search")}>
            Search Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-success-page">

      <div className="success-container">

        <div className="success-icon">
          ✓
        </div>

        <h1>Booking Confirmed!</h1>

        <p className="success-text">
          Your ticket has been booked successfully.
        </p>

        <div className="qr-section">

          <h2>Ticket QR Code</h2>

          <QRCodeCanvas
            value={JSON.stringify({
              bookingId: booking.bookingId,
              passengerName: booking.passengerName,
              seatNumber: booking.seatNumber,
              price: booking.price,
              status: booking.status,
            })}
            size={180}
          />

          <p>Scan this QR code to view booking details</p>

        </div>
        <div className="booking-card">

          <h2>
            {ticket?.operator || "Ticket"}
          </h2>

          <p>
            {ticket?.source} → {ticket?.destination}
          </p>

          <hr />

          <div className="booking-detail">
            <span>Booking ID</span>
            <strong>{booking.bookingId}</strong>
          </div>

          <div className="booking-detail">
            <span>Passenger</span>
            <strong>{booking.passengerName}</strong>
          </div>

          <div className="booking-detail">
            <span>Age</span>
            <strong>{booking.passengerAge}</strong>
          </div>

          <div className="booking-detail">
            <span>Gender</span>
            <strong>{booking.passengerGender}</strong>
          </div>

          <div className="booking-detail">
            <span>Seat</span>
            <strong>{booking.seatNumber}</strong>
          </div>

          <div className="booking-detail">
            <span>Price</span>
            <strong>₹{booking.price}</strong>
          </div>

          <div className="booking-detail">
            <span>Status</span>
            <strong className="confirmed">
              {booking.status}
            </strong>
          </div>

        </div>

        <div className="success-actions">

          <button
            onClick={() => navigate("/tickets")}
          >
            My Tickets
          </button>

          <button
            onClick={() => navigate("/search")}
          >
            Search More Tickets
          </button>

        </div>

      </div>

    </div>
  );
}

export default BookingSuccess;