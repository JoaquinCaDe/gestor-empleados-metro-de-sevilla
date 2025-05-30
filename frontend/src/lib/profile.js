import { getAuthHeaders } from './auth';

// API Base URL - Change it according to your environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
export async function getUserProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener perfil de usuario');
    }

    return data.user;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
}

/**
 * Get all users (admin only)
 * @returns {Promise<Array>} List of all users
 */
export async function getAllUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/all`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener lista de usuarios');
    }

    return data.users;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

/**
 * Update user profile
 * @param {string} userId - User ID to update
 * @param {Object} userData - User data to update
 * @param {string} [userData.name] - User's name
 * @param {string} [userData.email] - User's email
 * @param {string} [userData.dne] - User's employee number
 * @param {string} [userData.role] - User's role (admin only)
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUser(userId, userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/update/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar usuario');
    }

    return data.user;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

/**
 * Update user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Update response
 */
export async function updatePassword(currentPassword, newPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar contraseña');
    }

    return data;
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    throw error;
  }
}

/**
 * Deactivate user account (admin only)
 * @param {string} userId - User ID to deactivate
 * @returns {Promise<Object>} Deactivation response
 */
export async function deactivateUser(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/deactivate/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al desactivar usuario');
    }

    return data;
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    throw error;
  }
}