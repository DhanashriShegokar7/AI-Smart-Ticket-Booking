import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  useEffect(() => {
    const updateAuthState = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener(
      "authChanged",
      updateAuthState
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        updateAuthState
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <Link to="/">
          AI Ticket Booking
        </Link>
      </div>

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/search">
          Search Tickets
        </Link>

        {token ? (
          <>
            <Link to="/tickets">
              My Tickets
            </Link>

            <Link to="/profile">
              Profile
            </Link>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;