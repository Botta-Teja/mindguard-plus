const API_URL = "http://localhost:5000";

function getToken() {
    return localStorage.getItem("token");
}

function setToken(token) {
    localStorage.setItem("token", token);
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// Generic GET request
async function apiGet(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });
    return res.json();
}

// Generic POST request
async function apiPost(endpoint, body) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify(body)
    });
    return res.json();
}
