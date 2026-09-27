const API_URL = "http://127.0.0.1:5000/api";

export async function getDashboardStats() {
  const response = await fetch(`${API_URL}/dashboard`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard statistics");
  }

  return response.json();
}