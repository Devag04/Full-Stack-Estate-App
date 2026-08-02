axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Global auth handling: the API returns HTTP 401 only when the session cookie
// is missing/expired/invalid. In that case send the user to the login page for
// the current section (buyer/ or seller/). All other errors are left for the
// calling code to handle. login.html sits alongside each dashboard page, so a
// relative redirect works from any authenticated page.
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (!/login\.html$/.test(window.location.pathname)) {
                window.location.href = "login.html";
            }
        }
        return Promise.reject(error);
    }
);
