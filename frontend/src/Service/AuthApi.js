
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

// Register
export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/api/auth/register`,
    userData
  );

  return response.data;
};

// Login
export const loginUser = async (credentials) => {
  const response = await axios.post(
    `${API_URL}/api/auth/login`,
    credentials
  );

  return response.data;
};

// Current logged-in user
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/api/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
