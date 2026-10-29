import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Profile Response:", response.data);

        setUser(response.data.user);
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.message ||
            "Unable to load profile"
        );
      });
  }, []);

  if (message) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>{message}</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-container">

        <div className="profile-header">

          <div className="profile-avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <h1>My Profile</h1>

            <p>
              Manage your account information
            </p>
          </div>

        </div>


        <div className="profile-card">

          <h2>Account Information</h2>


          <div className="profile-info">

            <div className="profile-item">
              <span>Name</span>

              <strong>
                {user.name || "Not available"}
              </strong>
            </div>


            <div className="profile-item">
              <span>Email</span>

              <strong>
                {user.email || "Not available"}
              </strong>
            </div>


            <div className="profile-item">
              <span>Account Type</span>

              <strong className="role-badge">
                {user.role || "user"}
              </strong>
            </div>


            <div className="profile-item">
              <span>User ID</span>

              <strong className="user-id">
                {user.userId || user.id}
              </strong>
            </div>

          </div>

        </div>


        <div className="profile-card profile-about">

          <h2>About Your Account</h2>

          <p>
            Your account is used to search tickets,
            book seats, manage bookings and receive
            AI-powered ticket recommendations.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Profile;