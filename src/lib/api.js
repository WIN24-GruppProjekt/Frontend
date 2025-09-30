import {createClient} from "./http";
 // Simple in-memory token storage 
 // In a real app, consider more secure storage
let _token = null;

export function setToken(token){ // Sets the current auth token
    _token = token;
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
}

export function getToken(){ // Retrieves the current auth token
    if (_token) return _token;
    const saved = localStorage.getItem('authToken');
    if (saved) _token = saved;
    return _token;
}
// Environment variables for API base URLs. Add the const you want to add to the api if leter are developped.
const EVENTS_BASE        = import.meta.env.VITE_EVENTS_API_BASE_URL        || ''
const AUTH_BASE          = import.meta.env.VITE_AUTH_API_BASE_URL          || ''
const VENUES_BASE        = import.meta.env.VITE_VENUES_API_BASE_URL        || ''
const BOOKINGS_BASE      = import.meta.env.VITE_BOOKINGS_API_BASE_URL      || ''
const NOTIFICATIONS_BASE = import.meta.env.VITE_NOTIFICATIONS_API_BASE_URL || ''

export const authApi = createClient({ // Wrapper for auth API calls
    baseUrl: AUTH_BASE, // Base URL for the auth API
    getToken, // Function to get the current auth token
    unwrapResult: false,
    timeout: 30000,
    retries: 1, // Automatically return the 'result' field from responses
});
export const eventsApi = createClient({ // Wrapper for auth API calls
    baseUrl: EVENTS_BASE, // Base URL for the events API
    unwrapResult: true, // Automatically return the 'result' field from responses
});
export const venuesApi = createClient({ // Wrapper for auth API calls
    baseUrl: VENUES_BASE, // Base URL for the auth API
    unwrapResult: true, // Automatically return the 'result' field from responses
});
export const bookingsApi = createClient({
  baseUrl: BOOKINGS_BASE,
  getToken,
  unwrapResult: true,
})
export const notificationsApi = createClient({
  baseUrl: NOTIFICATIONS_BASE,
  getToken,            
  unwrapResult: true,
})


//JWT parsing utility
const ROLE_CLAIM_KEYS = [
  'role',
  'roles',
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
]

export function getRolesFromToken() {
  const token = getToken()
  if (!token) return []
  const claims = parseJwt(token) || {}
  for (const key of ROLE_CLAIM_KEYS) {
    const raw = claims[key]
    if (!raw) continue
    if (Array.isArray(raw)) return raw.map(String)
    return [String(raw)]
  }
  return []
}

export function parseJwt(token) {
  try {
    const base64 = token.split('.')[1]
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch { return null }
}

export function getUserIdFromToken() {
  const token = getToken()
  if (!token) return ''
  const claims = parseJwt(token) || {}
  // justera efter dina claims (sub/nameid/uid)
  return claims.sub || claims.nameid || claims.uid || ''
}
// --- Helpers for specific API endpoints ---

// EventService
export const Events = {
  list:   (opts)                      => eventsApi.get('/api/Events', opts),
  get:    (id, opts)                  => eventsApi.get(`/api/Events/${id}`, opts),
  create: (body)                      => eventsApi.post('/api/Events', body),
  update: (id, body)                  => eventsApi.put(`/api/Events/${id}`, body),
  remove: (id)                        => eventsApi.delete(`/api/Events/${id}`),
  upcoming:  (opts)                   => eventsApi.get('/api/Events/upcoming', opts),
  byDateRange: (fromIso, toIso, opts) => eventsApi.get('/api/Events/date-range', { ...opts, params: { from: fromIso, to: toIso } }),
}

// Venue/LocationService

export const Venues = {
  locations: {
    list:   (opts)      => venuesApi.get('/api/Locations', opts),
    get:    (id, opts)  => venuesApi.get(`/api/Locations/${id}`, opts),
    create: (body)      => venuesApi.post('/api/Locations', body),
    update: (id, body)  => venuesApi.put(`/api/Locations/${id}`, body),
    remove: (id)        => venuesApi.delete(`/api/Locations/${id}`),
  },
  rooms: {
    list:       (opts)         => venuesApi.get('/api/LocationRooms', opts),
    get:        (id, opts)     => venuesApi.get(`/api/LocationRooms/${id}`, opts),
    create:     (body)         => venuesApi.post('/api/LocationRooms', body),
    update:     (id, body)     => venuesApi.put(`/api/LocationRooms/${id}`, body),
    remove:     (id)           => venuesApi.delete(`/api/LocationRooms/${id}`),
    byLocation: (locationId, opts) =>
      venuesApi.get(`/api/LocationRooms/${locationId}/rooms`, opts), // enligt din lista
  },
}

// BookingService
export const Bookings = {
  create:        (body)                => bookingsApi.post('/api/Bookings', body),
  byUser:        (userId, opts)        => bookingsApi.get(`/api/Bookings/user/${userId}`, opts),
  deleteByUser:  (userId)              => bookingsApi.delete(`/api/Bookings/user/${userId}`),
  participants:  (eventId, opts)       => bookingsApi.get(`/api/Bookings/event/${eventId}/participants`, opts),
  delete:        (bookingId)           => bookingsApi.delete(`/api/Bookings/${bookingId}`),
  deleteByEvent: (eventId)             => bookingsApi.delete(`/api/Bookings/event/${eventId}`),
}

// NotificationService
export const Notifications = {
  bookingEmailConfirmation: (body) => notificationsApi.post('/api/BookingEmail/confirmation', body),
}

// --- Bundle and export all API utilities --- 
const api = {
  authApi, eventsApi, venuesApi, bookingsApi, notificationsApi,
  Events, Venues, Bookings, Notifications,
  setToken, getToken, parseJwt, getUserIdFromToken,
  getRolesFromToken,
}
export default api;
