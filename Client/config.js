// Central client configuration — the ONLY place backend URLs live.
// Auto-selects the local backend when the page is opened on localhost,
// otherwise uses the deployed backend. Exposed on `window` so both classic
// scripts (api.js) and ES modules (dashboard.js, message.js) can read them.
const IS_LOCAL = ["localhost", "127.0.0.1"].includes(window.location.hostname);

// REST API base (used by axios) and Socket.IO endpoint.
// For a Vercel + Render setup, set BOTH deployed values to your Render service URL.
const API_BASE_URL = IS_LOCAL
    ? `http://${window.location.hostname}:7900`
    : "https://full-stack-estate-app-1.onrender.com";

const SOCKET_URL = IS_LOCAL
    ? `http://${window.location.hostname}:7900`
    : "https://full-stack-estate-app.onrender.com";

window.API_BASE_URL = API_BASE_URL;
window.SOCKET_URL = SOCKET_URL;
