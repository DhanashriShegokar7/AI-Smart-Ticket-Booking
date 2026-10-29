import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // ==========================================
  // SEND OTP
  // ==========================================

  async function handleSendOtp(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/send-login-otp",
        formData
      );

      console.log(
        "Send OTP Response:",
        response.data
      );

      setOtpSent(true);

      setMessage(
        "OTP sent successfully. Check your email."
      );

    } catch (error) {

      console.error(
        "Send OTP Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to send OTP"
      );

    } finally {
      setLoading(false);
    }
  }


  // ==========================================
  // VERIFY OTP
  // ==========================================

  async function handleVerifyOtp(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-login-otp",
        {
          email: formData.email,
          otp: otp,
        }
      );

      console.log(
        "Verify OTP Response:",
        response.data
      );


      // Save JWT
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Tell Navbar that login state changed
      window.dispatchEvent(new Event("authChanged"));


      // Save user information
      if (response.data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );

      }


      setMessage(
        "Login successful!"
      );


      // Go to home page
      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {

      console.error(
        "Verify OTP Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Invalid or expired OTP"
      );

    } finally {
      setLoading(false);
    }
  }


  // ==========================================
  // CHANGE EMAIL / PASSWORD
  // ==========================================

  function handleChangeCredentials() {

    setOtpSent(false);

    setOtp("");

    setMessage("");

  }


  return (
    <div className="login-page">

      <div className="login-container">

        <h1>Login</h1>

        <p>
          Login to your account
        </p>


        {/* ================================= */}
        {/* EMAIL + PASSWORD FORM */}
        {/* ================================= */}

        {!otpSent && (

          <form
            onSubmit={handleSendOtp}
          >

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>


            <button
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Sending OTP..."
                : "Send OTP"}

            </button>

          </form>

        )}


        {/* ================================= */}
        {/* OTP FORM */}
        {/* ================================= */}

        {otpSent && (

          <form
            onSubmit={handleVerifyOtp}
          >

            <div className="otp-info">

              <p>
                OTP has been sent to
              </p>

              <strong>
                {formData.email}
              </strong>

            </div>


            <div className="form-group">

              <label>
                Enter OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(event) => {

                  const value =
                    event.target.value
                      .replace(/\D/g, "");

                  setOtp(value);

                }}
                required
              />

            </div>


            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6
              }
            >

              {loading
                ? "Verifying..."
                : "Verify OTP & Login"}

            </button>


            <button
              type="button"
              className="change-login-button"
              onClick={
                handleChangeCredentials
              }
            >

              Change Email / Password

            </button>

          </form>

        )}


        {/* ================================= */}
        {/* MESSAGE */}
        {/* ================================= */}

        {message && (

          <p className="login-message">

            {message}

          </p>

        )}

      </div>

    </div>
  );
}

export default Login;