// ================= AUTH CHECK =================
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

// ================= SECTION SWITCHING =================
function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.style.display = "none";
    });

    document.getElementById(sectionId).style.display = "block";

    if (sectionId === "home") loadHome();
    if (sectionId === "profile") loadProfile();
    if (sectionId === "mood") loadMood();
}

// ================= HOME =================
async function loadHome() {
    try {
        const res = await apiGet("/api/mood/today");

        if (res.mood) {
            document.getElementById("streakDisplay").innerText =
                "Today's Mood: " + res.mood.dominantEmotion +
                " | Entries: " + res.mood.entryCount;
        } else {
            document.getElementById("streakDisplay").innerText =
                "No mood data for today.";
        }
    } catch (err) {
        console.error("Home load error:", err);
    }
}

// ================= CHAT =================
async function sendMessage() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();
    if (!message) return;

    const chatBox = document.getElementById("chatBox");

    // Add user message
    chatBox.innerHTML += `
        <div class="user-message">
            ${message}
            <div class="time">${new Date().toLocaleTimeString()}</div>
        </div>
    `;

    messageInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Add typing animation
    const typingId = "typing-" + Date.now();
    chatBox.innerHTML += `
        <div class="bot-message" id="${typingId}">
            <span class="typing">MindGuard is typing...</span>
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;

    const res = await apiPost("/api/chat", { message });

    // Replace typing with real reply
    document.getElementById(typingId).innerHTML = `
        ${res.botReply}
        <div class="time">${new Date().toLocaleTimeString()}</div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;
}
// ================= MOOD =================
async function loadMood() {
    try {
        const res = await apiGet("/api/mood/weekly");

        const moodDiv = document.getElementById("moodData");

        moodDiv.innerHTML = `
            <div class="mood-card">
                <p>Total Days Tracked: ${res.totalDaysTracked}</p>
                <p>Happy Days: ${res.happyDays}</p>
                <p>Sad Days: ${res.sadDays}</p>
                <p>Extreme Days: ${res.extremeDays}</p>
                <p>Neutral Days: ${res.neutralDays}</p>
            </div>
        `;
    } catch (err) {
        console.error("Mood load error:", err);
    }
}

// ================= WELLNESS =================
async function getJoke() {
    try {
        const res = await apiGet("/api/wellness/joke");
        document.getElementById("jokeOutput").innerText =
            res.joke.text;
    } catch (err) {
        console.error("Joke error:", err);
    }
}

async function getQuote() {
    try {
        const res = await apiGet("/api/wellness/quote");
        document.getElementById("quoteOutput").innerText =
            res.quote.text + " - " + res.quote.author;
    } catch (err) {
        console.error("Quote error:", err);
    }
}

// 🔥 Animated Breathing
async function startBreathing() {
    try {
        const res = await apiGet("/api/wellness/breathing");
        const circle = document.getElementById("breathCircle");

        const { inhale, hold, exhale } = res.session;

        circle.innerText = "Inhale";
        circle.style.transform = "scale(1.5)";

        setTimeout(() => {
            circle.innerText = "Hold";
        }, inhale * 1000);

        setTimeout(() => {
            circle.innerText = "Exhale";
            circle.style.transform = "scale(1)";
        }, (inhale + hold) * 1000);

        setTimeout(() => {
            circle.innerText = "Done ✔";
        }, (inhale + hold + exhale) * 1000);

    } catch (err) {
        console.error("Breathing error:", err);
    }
}

// ================= PROFILE =================
async function loadProfile() {
    try {
        const res = await apiGet("/profile"); 

        document.getElementById("profileName").innerText = res.user.name;
        document.getElementById("profileEmail").innerText = res.user.email;
        document.getElementById("profileStreak").innerText = res.user.moodStreak;

        const contactList = document.getElementById("contactList");
        contactList.innerHTML = "";

        res.user.emergencyContacts.forEach(contact => {
            contactList.innerHTML += `
                <p>👤 ${contact.name} - ${contact.email}</p>
            `;
        });

    } catch (err) {
        console.error("Profile load error:", err);
    }
}

// ⚠ IMPORTANT: Ensure this matches your backend route
async function addContact() {
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();

    if (!name || !email) return;

    try {
        await apiPost("/add-contact", { name, email });

        document.getElementById("contactName").value = "";
        document.getElementById("contactEmail").value = "";

        loadProfile();

    } catch (err) {
        console.error("Add contact error:", err);
    }
}

// ================= INITIAL LOAD =================
loadHome();
