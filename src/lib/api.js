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
const EVENTS_BASE = import.meta.env.VITE_EVENTS_API_BASE_URL || '';
const AUTH_BASE   = import.meta.env.VITE_AUTH_API_BASE_URL   || '';
const VENUES_BASE = import.meta.env.VITE_VENUES_API_BASE_URL || '';

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
//Timeouts and retries can be adjusted in createClient calls above added only for debugging. 
const api = { authApi, eventsApi, setToken, getToken };
export default api;
