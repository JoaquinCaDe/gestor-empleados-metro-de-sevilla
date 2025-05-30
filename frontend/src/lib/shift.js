import { getAuthHeaders } from './auth';

// API Base URL - Change it according to your environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Create a new shift
 * @param {Object} shiftData - Shift data to create
 * @param {string} shiftData.start - Start time (ISO date string)
 * @param {string} shiftData.end - End time (ISO date string)
 * @param {string} shiftData.title - Shift title
 * @param {string} shiftData.type - Shift type (morning, afternoon, night)
 * @param {string} shiftData.employee - Employee ID assigned to shift
 * @returns {Promise<Object>} Created shift data
 */
export async function createShift(shiftData) {
  try {
    const response = await fetch(`${API_BASE_URL}/shifts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(shiftData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear turno');
    }

    return data.shift;
  } catch (error) {
    console.error('Error al crear turno:', error);
    throw error;
  }
}

/**
 * Get all shifts with optional filters
 * @param {Object} [filters] - Optional filters
 * @param {string} [filters.startDate] - Filter by start date (ISO string)
 * @param {string} [filters.endDate] - Filter by end date (ISO string)
 * @param {string} [filters.employee] - Filter by employee ID
 * @param {string} [filters.type] - Filter by shift type (morning, afternoon, night)
 * @returns {Promise<Array>} List of shifts
 */
export async function getAllShifts(filters = {}) {
  try {
    // Build query params
    const queryParams = new URLSearchParams();

    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.employee) queryParams.append('employee', filters.employee);
    if (filters.type) queryParams.append('type', filters.type);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_BASE_URL}/shifts${query}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener turnos');
    }

    return data.shifts;
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    throw error;
  }
}

/**
 * Get shift by ID
 * @param {string} shiftId - Shift ID to retrieve
 * @returns {Promise<Object>} Shift data
 */
export async function getShiftById(shiftId) {
  try {
    const response = await fetch(`${API_BASE_URL}/shifts/${shiftId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener turno');
    }

    return data.shift;
  } catch (error) {
    console.error('Error al obtener turno:', error);
    throw error;
  }
}

/**
 * Get shifts by employee ID
 * @param {string} employeeId - Employee ID
 * @param {Object} [filters] - Optional filters
 * @param {string} [filters.startDate] - Filter by start date (ISO string)
 * @param {string} [filters.endDate] - Filter by end date (ISO string)
 * @param {string} [filters.type] - Filter by shift type
 * @returns {Promise<Array>} List of employee shifts
 */
export async function getShiftsByEmployee(employeeId, filters = {}) {
  try {
    // Build query params
    const queryParams = new URLSearchParams();

    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.type) queryParams.append('type', filters.type);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_BASE_URL}/shifts/employee/${employeeId}${query}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener turnos del empleado');
    }

    return data.shifts;
  } catch (error) {
    console.error('Error al obtener turnos del empleado:', error);
    throw error;
  }
}

/**
 * Update shift
 * @param {string} shiftId - Shift ID to update
 * @param {Object} shiftData - Shift data to update
 * @param {string} [shiftData.start] - Start time (ISO date string)
 * @param {string} [shiftData.end] - End time (ISO date string)
 * @param {string} [shiftData.title] - Shift title
 * @param {string} [shiftData.type] - Shift type (morning, afternoon, night)
 * @param {string} [shiftData.employee] - Employee ID assigned to shift
 * @returns {Promise<Object>} Updated shift data
 */
export async function updateShift(shiftId, shiftData) {
  try {
    const response = await fetch(`${API_BASE_URL}/shifts/${shiftId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(shiftData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar turno');
    }

    return data.shift;
  } catch (error) {
    console.error('Error al actualizar turno:', error);
    throw error;
  }
}

/**
 * Delete shift
 * @param {string} shiftId - Shift ID to delete
 * @returns {Promise<Object>} Deletion response
 */
export async function deleteShift(shiftId) {
  try {
    const response = await fetch(`${API_BASE_URL}/shifts/${shiftId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar turno');
    }

    return data;
  } catch (error) {
    console.error('Error al eliminar turno:', error);
    throw error;
  }
}

/**
 * Format shift data from the backend to the frontend calendar format
 * @param {Array} shifts - Shifts from backend API
 * @returns {Object} Formatted shifts object for calendar components
 */
export function formatShiftsForCalendar(shifts) {
  const formattedShifts = {};

  shifts.forEach(shift => {
    // Format date as YYYY-MM-DD for calendar key
    const startDate = new Date(shift.start);
    const dateKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;

    // Format start and end times as HH:MM
    const startTime = startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    const endDate = new Date(shift.end);
    const endTime = endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Get employee names
    const employees = shift.employee ?
      (Array.isArray(shift.employee) ?
        shift.employee.map(emp => emp.name || emp) :
        [shift.employee.name || shift.employee]) :
      [];

    // Create formatted shift
    formattedShifts[dateKey] = {
      id: shift._id,
      start: startTime,
      end: endTime,
      title: shift.title,
      type: shift.type,
      employees: employees
    };
  });

  return formattedShifts;
}