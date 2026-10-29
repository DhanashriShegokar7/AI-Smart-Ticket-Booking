import { useState } from "react";
import axios from "axios";
import "./TicketSearch.css";
import { Link } from "react-router-dom";

function TicketSearch() {
    const [formData, setFormData] = useState({
        source: "",
        destination: "",
        travelDate: "",
        type: "",
    });

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [aiRecommendation, setAiRecommendation] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    async function handleSearch(event) {
        event.preventDefault();

        try {
            setLoading(true);
            setMessage("");
            setTickets([]);
            setAiRecommendation("");

            const params = {};

            if (formData.source) {
                params.source = formData.source;
            }

            if (formData.destination) {
                params.destination = formData.destination;
            }

            if (formData.travelDate) {
                params.travelDate = formData.travelDate;
            }

            if (formData.type) {
                params.type = formData.type;
            }

            // Search tickets
            const response = await axios.get(
                "http://localhost:5000/api/tickets/search",
                {
                    params,
                }
            );

            const foundTickets = response.data.tickets;

            setTickets(foundTickets);

            if (foundTickets.length === 0) {
                setMessage("No tickets found.");
                return;
            }

            // Get AI recommendation
            try {
                const aiResponse = await axios.post(
                    "http://localhost:5000/api/ai/recommend",
                    {
                        source: formData.source,
                        destination: formData.destination,
                        travelDate: formData.travelDate,
                        tickets: foundTickets,
                    }
                );

                console.log(
                    "AI RECOMMENDATION:",
                    aiResponse.data.recommendation
                );

                setAiRecommendation(
                    aiResponse.data.recommendation
                );

            } catch (aiError) {
                console.error(
                    "AI recommendation error:",
                    aiError.message
                );

                setAiRecommendation(
                    "AI recommendation is currently unavailable."
                );
            }

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to search tickets"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="ticket-search-page">

            <div className="search-container">

                <h1>Search Tickets</h1>

                <form onSubmit={handleSearch}>

                    <div className="search-field">

                        <label>From</label>

                        <input
                            type="text"
                            name="source"
                            placeholder="Enter source"
                            value={formData.source}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="search-field">

                        <label>To</label>

                        <input
                            type="text"
                            name="destination"
                            placeholder="Enter destination"
                            value={formData.destination}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="search-field">

                        <label>Date</label>

                        <input
                            type="date"
                            name="travelDate"
                            value={formData.travelDate}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="search-field">

                        <label>Type</label>

                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="">
                                All
                            </option>

                            <option value="bus">
                                Bus
                            </option>

                            <option value="train">
                                Train
                            </option>

                        </select>

                    </div>


                    <button type="submit">
                        Search Tickets
                    </button>

                </form>

            </div>


            {loading && (
                <p className="search-message">
                    Searching tickets and getting AI recommendation...
                </p>
            )}


            {message && !loading && (
                <p className="search-message">
                    {message}
                </p>
            )}


            {/* AI RECOMMENDATION */}

            {aiRecommendation && (
                <div className="ai-recommendation">

                    <div className="ai-title">
                        <span className="ai-icon">
                            🤖
                        </span>

                        <div>
                            <h2>
                                AI Recommended Ticket
                            </h2>

                            <p>
                                Smart recommendation based on your search
                            </p>
                        </div>
                    </div>


                    <div className="ai-content">

                        {aiRecommendation}

                    </div>

                </div>
            )}


            {/* SEARCH RESULTS */}

            <div className="search-results">

                {tickets.map((ticket) => (

                    <div
                        className="search-ticket-card"
                        key={ticket._id}
                    >

                        <div className="ticket-card-header">

                            <div>

                                <h2>
                                    {ticket.operator}
                                </h2>

                                <p className="route">
                                    {ticket.source} →{" "}
                                    {ticket.destination}
                                </p>

                            </div>

                            <span
                                className={`ticket-type ${ticket.type}`}
                            >
                                {ticket.type}
                            </span>

                        </div>


                        <div className="ticket-info">

                            <div>
                                <span>Departure</span>
                                <strong>
                                    {ticket.departureTime}
                                </strong>
                            </div>


                            <div>
                                <span>Arrival</span>
                                <strong>
                                    {ticket.arrivalTime}
                                </strong>
                            </div>


                            <div>
                                <span>Duration</span>
                                <strong>
                                    {ticket.duration}
                                </strong>
                            </div>


                            <div>
                                <span>Price</span>
                                <strong>
                                    ₹{ticket.price}
                                </strong>
                            </div>


                            <div>
                                <span>Available Seats</span>
                                <strong>
                                    {ticket.availableSeats}
                                </strong>
                            </div>

                        </div>


                        <Link
                            to={`/seat-selection/${ticket._id}`}
                            className="select-button"
                        >
                            Select Seat
                        </Link>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default TicketSearch;