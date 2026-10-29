import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import SearchResults from "./pages/SearchResults";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/Navbar";

import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Tickets from "./pages/Tickets";

import TicketSearch from "./pages/TicketSearch";
import SeatSelection from "./pages/SeatSelection";
import PassengerDetails from "./pages/PassengerDetails";
import BookingSuccess from "./pages/BookingSuccess";


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/search"
          element={<TicketSearch />}
        />

        <Route
          path="/search-results"
          element={<SearchResults />}
        />


        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          }
        />


        <Route
          path="/seat-selection/:ticketId"
          element={
            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>
          }
        />


        <Route
          path="/passenger-details/:ticketId"
          element={
            <ProtectedRoute>
              <PassengerDetails />
            </ProtectedRoute>
          }
        />


        <Route
          path="/booking-success"
          element={
            <ProtectedRoute>
              <BookingSuccess />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;