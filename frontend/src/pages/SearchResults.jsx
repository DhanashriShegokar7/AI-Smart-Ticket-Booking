import "./SearchResults.css";

function SearchResults() {
  const tickets = [
    {
      id: 1,
      name: "Maharashtra Express",
      type: "Train",
      departure: "06:00 PM",
      arrival: "06:00 AM",
      duration: "12h",
      price: 1200,
    },
    {
      id: 2,
      name: "Vidarbha Express",
      type: "Train",
      departure: "05:00 PM",
      arrival: "07:00 AM",
      duration: "14h",
      price: 900,
    },
    {
      id: 3,
      name: "Nagpur-Mumbai Express",
      type: "Train",
      departure: "07:00 PM",
      arrival: "06:00 AM",
      duration: "11h",
      price: 1450,
    },
  ];

  return (
    <div className="results-page">

      <h1>Available Tickets</h1>

      <p>Showing available options for your journey.</p>

      <div className="tickets-container">

        {tickets.map((ticket) => (
          <div className="ticket-card" key={ticket.id}>

            <div>
              <h2>{ticket.name}</h2>
              <p>{ticket.type}</p>
            </div>

            <div className="ticket-time">
              <div>
                <strong>{ticket.departure}</strong>
                <span>Departure</span>
              </div>

              <div>
                <strong>{ticket.duration}</strong>
                <span>Duration</span>
              </div>

              <div>
                <strong>{ticket.arrival}</strong>
                <span>Arrival</span>
              </div>
            </div>

            <div className="ticket-bottom">

              <h3>₹{ticket.price}</h3>

              <button>
                Select
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default SearchResults;