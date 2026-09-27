import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";


export default function Settings() {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    current_password: "",
    new_username: "",
    new_password: "",
    confirm_password: "",
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ==========================================
  // UPDATE ADMIN ACCOUNT
  // ==========================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    // ------------------------------------------
    // Validate password confirmation
    // ------------------------------------------

    if (
      formData.new_password !==
      formData.confirm_password
    ) {

      setError("New passwords do not match.");

      return;
    }


    // ------------------------------------------
    // Validate password length
    // ------------------------------------------

    if (formData.new_password.length < 6) {

      setError(
        "New password must contain at least 6 characters."
      );

      return;
    }


    // ------------------------------------------
    // Check authentication token
    // ------------------------------------------

    const token = localStorage.getItem(
      "access_token"
    );


    if (!token) {

      setError(
        "Your session has expired. Please log in again."
      );

      return;
    }


    setLoading(true);


    try {

      const response = await api.put(
        "/auth/profile",
        {
          current_password:
            formData.current_password,

          new_username:
            formData.new_username,

          new_password:
            formData.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (response.data.success) {

        setSuccess(
          "Your username and password have been changed successfully."
        );


        // --------------------------------------
        // Remove old authentication information
        // --------------------------------------

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user"
        );


        // --------------------------------------
        // Clear form
        // --------------------------------------

        setFormData({
          current_password: "",
          new_username: "",
          new_password: "",
          confirm_password: "",
        });


        // --------------------------------------
        // Redirect to login
        // --------------------------------------

        setTimeout(() => {

          navigate("/login");

        }, 2000);

      } else {

        setError(
          response.data.message ||
          "Failed to update account."
        );

      }

    } catch (error) {

      console.error(
        "Account update error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Unable to connect to the parking server."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="min-h-screen bg-gray-950 text-white p-6">

      <div className="mx-auto max-w-3xl">


        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Account Settings
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your administrator username and
            password.
          </p>

        </div>


        {/* ======================================
            SETTINGS CARD
        ====================================== */}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl">


          <div className="mb-6">

            <h2 className="text-xl font-semibold">
              Administrator Account
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Update the credentials used to access
              the parking management system.
            </p>

          </div>


          {/* ====================================
              SUCCESS MESSAGE
          ==================================== */}

          {success && (

            <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">

              {success}

              <p className="mt-1 text-xs text-gray-400">
                Redirecting you to the login page...
              </p>

            </div>

          )}


          {/* ====================================
              ERROR MESSAGE
          ==================================== */}

          {error && (

            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">

              {error}

            </div>

          )}


          {/* ====================================
              FORM
          ==================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >


            {/* ----------------------------------
                CURRENT PASSWORD
            ---------------------------------- */}

            <div>

              <label
                htmlFor="current_password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Current Password
              </label>

              <input
                id="current_password"
                name="current_password"
                type="password"
                value={
                  formData.current_password
                }
                onChange={handleChange}
                placeholder="Enter your current password"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>


            {/* ----------------------------------
                NEW USERNAME
            ---------------------------------- */}

            <div>

              <label
                htmlFor="new_username"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                New Username
              </label>

              <input
                id="new_username"
                name="new_username"
                type="text"
                value={
                  formData.new_username
                }
                onChange={handleChange}
                placeholder="Enter your new username"
                required
                minLength={3}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>


            {/* ----------------------------------
                NEW PASSWORD
            ---------------------------------- */}

            <div>

              <label
                htmlFor="new_password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                New Password
              </label>

              <input
                id="new_password"
                name="new_password"
                type="password"
                value={
                  formData.new_password
                }
                onChange={handleChange}
                placeholder="Enter your new password"
                required
                minLength={6}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <p className="mt-2 text-xs text-gray-500">
                Password must contain at least 6 characters.
              </p>

            </div>


            {/* ----------------------------------
                CONFIRM PASSWORD
            ---------------------------------- */}

            <div>

              <label
                htmlFor="confirm_password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Confirm New Password
              </label>

              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={
                  formData.confirm_password
                }
                onChange={handleChange}
                placeholder="Confirm your new password"
                required
                minLength={6}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>


            {/* ==================================
                SAVE BUTTON
            ================================== */}

            <div className="border-t border-gray-800 pt-6">

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading
                  ? "Saving Changes..."
                  : "Save Changes"
                }

              </button>

            </div>

          </form>

        </div>


        {/* ======================================
            SECURITY INFORMATION
        ====================================== */}

        <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/50 p-5">

          <h3 className="font-semibold text-gray-200">
            Security
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            After changing your credentials, you will
            be logged out automatically. You must sign
            in again using your new username and
            password.
          </p>

        </div>

      </div>

    </div>

  );
}

