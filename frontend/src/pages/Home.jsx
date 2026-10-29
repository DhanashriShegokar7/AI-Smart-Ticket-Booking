import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="home">

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-badge">
            ✨ AI-Powered Travel Booking
          </span>

          <h1>
            Book Your Journey
            <span> Smarter</span>
          </h1>

          <p>
            Search, compare and book tickets with
            the power of AI.
          </p>

          <div className="hero-buttons">

            <Link
              to="/search"
              className="primary-btn"
            >
              Search Tickets
            </Link>

            <Link
              to={token ? "/search" : "/register"}
              className="secondary-btn"
            >
              {token ? "Start Booking" : "Get Started"}
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features-section">

        <div className="section-heading">

          <span>WHY CHOOSE US</span>

          <h2>
            Everything You Need for
            <br />
            a Smarter Journey
          </h2>

        </div>


        <div className="features">

          <div className="feature-card">

            <div className="feature-icon">
              🔍
            </div>

            <h3>
              Smart Search
            </h3>

            <p>
              Find trains and buses across
              multiple routes and travel dates.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🤖
            </div>

            <h3>
              AI Recommendations
            </h3>

            <p>
              Let AI analyze available tickets
              and recommend the best option.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🎫
            </div>

            <h3>
              Digital Tickets
            </h3>

            <p>
              Book your journey and get your
              digital ticket with QR code.
            </p>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="how-it-works">

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            Your Journey in 4 Simple Steps
          </h2>

          <p>
            From searching to boarding,
            everything is simple and smart.
          </p>

        </div>


        <div className="steps-container">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              🔍
            </div>

            <h3>
              Search
            </h3>

            <p>
              Enter your source, destination,
              date and travel type.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              🤖
            </div>

            <h3>
              AI Recommendation
            </h3>

            <p>
              AI analyzes available tickets
              and suggests the best option.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              💺
            </div>

            <h3>
              Select Seat
            </h3>

            <p>
              Choose your preferred available
              seat and enter passenger details.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <div className="step-number">
              04
            </div>

            <div className="step-icon">
              🎫
            </div>

            <h3>
              Get Ticket
            </h3>

            <p>
              Confirm your booking and receive
              your digital QR ticket.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="home-cta">

        <div>

          <h2>
            Ready to Plan Your Journey?
          </h2>

          <p>
            Let AI help you find the right ticket.
          </p>

        </div>

        <Link
          to="/search"
          className="cta-button"
        >
          Explore Tickets →
        </Link>

      </section>


    </div>
  );
}

export default Home;