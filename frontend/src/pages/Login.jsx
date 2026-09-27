
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";


export default function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await api.post("/auth/login", {
        username,
        password,
      });


      if (response.data.success) {

        // Store JWT
        localStorage.setItem(
          "access_token",
          response.data.access_token
        );


        // Store user information
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );


        // Go to dashboard
        navigate("/dashboard");

      } else {

        setError(
          response.data.message || "Login failed."
        );

      }

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to connect to the parking server."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">

          {/* Logo / title */}

          <div className="text-center mb-8">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl">
              🚗
            </div>

            <h1 className="text-2xl font-bold text-white">
              Smart Parking
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Management System
            </p>

          </div>


          {/* Error */}

          {error && (

            <div className="mb-5 rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
              {error}
            </div>

          )}


          {/* Login form */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Username */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter username"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />

            </div>


            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter password"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />

            </div>


            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading
                ? "Signing in..."
                : "Sign In"
              }

            </button>

          </form>


          <div className="mt-6 text-center text-xs text-gray-500">
            Smart Parking Management System
          </div>

        </div>

      </div>

    </div>
  );
}

