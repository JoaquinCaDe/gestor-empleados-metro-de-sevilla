
// API Base URL - Change it according to your environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Register a new user
 * @param {Object} userData - User data to register
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password * @param {string} userData.name - Full name
 * @param {string} [userData.dne] - Employee number (required for employees)
 * @returns {Promise<Object>} Registration response
 */
export async function register(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }

    return data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
}

/**
 * Login user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} Login response with token
 */
export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en inicio de sesión');
    }

    // Guardar token en localStorage para usar en futuras solicitudes
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

/**
 * Logout user - Removes token from localStorage
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

/**
 * Get current logged in user
 * @returns {Object|null} User object or null if not logged in
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Get authentication token
 * @returns {string|null} JWT token or null
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Helper function to get authentication headers
 * @returns {Object} Headers object with Authorization token
 */
export function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}