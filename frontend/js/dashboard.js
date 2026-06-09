// ================= AUTH CHECK =================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

// ================= GLOBAL VARIABLES =================

let moodChartInstance = null;

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

    if (sectionId === "chat") loadChatHistory();

    if (sectionId === "goals") loadGoals();
}

// ================= API HELPERS =================

async function apiGet(url) {

    const res = await fetch(
        "http://localhost:5000" + url,
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }
    );

    return res.json();
}

async function apiPost(url, data) {

    const res = await fetch(
        "http://localhost:5000" + url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(data)
        }
    );

    return res.json();
}

// ================= HOME =================

async function loadHome() {

    try {

        const res = await apiGet("/api/mood/today");

        const display =
            document.getElementById("streakDisplay");

        if (res.mood) {

            display.innerText =
                "Today's Mood: " +
                res.mood.dominantEmotion +
                " | Entries: " +
                res.mood.entryCount;

        } else {

            display.innerText =
                "No mood data for today.";
        }

    } catch (err) {

        console.error("Home error:", err);
    }
}

// ================= CHAT =================

async function sendMessage() {

    const messageInput =
        document.getElementById("message");

    const message =
        messageInput.value.trim();

    if (!message) return;

    const chatBox =
        document.getElementById("chatBox");

    chatBox.innerHTML += `
        <div class="user-message">
            ${message}
            <div class="time">
                ${new Date().toLocaleTimeString()}
            </div>
        </div>
    `;

    messageInput.value = "";

    chatBox.scrollTop =
        chatBox.scrollHeight;

    const typingId =
        "typing-" + Date.now();

    chatBox.innerHTML += `
        <div class="bot-message" id="${typingId}">
            <span class="typing">
                MindGuard is typing...
            </span>
        </div>
    `;

    const res =
        await apiPost("/api/chat", { message });

    document.getElementById(
        typingId
    ).innerHTML = `
        ${res.botReply}
        <div class="time">
            ${new Date().toLocaleTimeString()}
        </div>
    `;

    chatBox.scrollTop =
        chatBox.scrollHeight;
}

// ================= CHAT HISTORY =================

async function loadChatHistory() {

    try {

        const res =
            await apiGet("/api/chat/history");

        const chatBox =
            document.getElementById("chatBox");

        chatBox.innerHTML = "";

        res.chats.reverse().forEach(chat => {

            chatBox.innerHTML += `
                <div class="user-message">
                    ${chat.message}
                </div>

                <div class="bot-message">
                    ${chat.botReply}
                </div>
            `;
        });

    } catch (err) {

        console.error(
            "Chat history error:",
            err
        );
    }
}

// ================= MOOD =================

async function loadMood() {

    try {

        const res =
            await apiGet("/api/mood/weekly");

        const ctx =
            document.getElementById("moodChart");

        if (moodChartInstance) {
            moodChartInstance.destroy();
        }

        moodChartInstance = new Chart(
            ctx,
            {
                type: "bar",

                data: {
                    labels: [
                        "Happy",
                        "Sad",
                        "Neutral",
                        "Distress"
                    ],

                    datasets: [
                        {
                            label:
                                "Mood Report (Last 7 Days)",

                            data: [
                                res.happyDays,
                                res.sadDays,
                                res.neutralDays,
                                res.extremeDays
                            ],

                            backgroundColor: [
                                "#4CAF50",
                                "#E53935",
                                "#FFC107",
                                "#8E24AA"
                            ],

                            borderRadius: 8
                        }
                    ]
                },

                options: {
                    responsive: true,

                    scales: {
                        y: {
                            beginAtZero: true,

                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            }
        );

    } catch (err) {

        console.error("Mood error:", err);
    }
}

// ================= WELLNESS =================

async function getJoke() {

    const res =
        await apiGet("/api/wellness/joke");

    document.getElementById(
        "jokeOutput"
    ).innerText = res.joke.text;
}

async function getQuote() {

    const res =
        await apiGet("/api/wellness/quote");

    document.getElementById(
        "quoteOutput"
    ).innerText =
        res.quote.text +
        " - " +
        res.quote.author;
}

// ================= BREATHING =================

function startBreathing() {

    const circle =
        document.getElementById(
            "breathCircle"
        );

    const steps = [
        "Inhale",
        "Hold",
        "Exhale"
    ];

    let i = 0;

    const interval =
        setInterval(() => {

            circle.innerText =
                steps[i];

            if (steps[i] === "Inhale")
                circle.style.transform =
                    "scale(1.5)";
            else
                circle.style.transform =
                    "scale(1)";

            i++;

            if (i >= steps.length) {

                clearInterval(interval);

                circle.innerText =
                    "Relax";
            }

        }, 4000);
}

// ================= GOALS =================

async function addGoal() {

    const title =
        document.getElementById(
            "goalTitle"
        ).value;

    const description =
        document.getElementById(
            "goalDescription"
        ).value;

    const date =
        document.getElementById(
            "goalDate"
        ).value;

    const time =
        document.getElementById(
            "goalTime"
        ).value;

    if (!title || !date || !time) {

        alert(
            "Please fill all required fields"
        );

        return;
    }

    await apiPost("/api/goals", {
        title,
        description,
        date,
        time
    });

    document.getElementById(
        "goalTitle"
    ).value = "";

    document.getElementById(
        "goalDescription"
    ).value = "";

    document.getElementById(
        "goalDate"
    ).value = "";

    document.getElementById(
        "goalTime"
    ).value = "";

    loadGoals();
}

async function loadGoals() {

    try {

        const res = await apiGet("/api/goals");

        const goalList =
            document.getElementById("goalList");

        const totalGoals =
            document.getElementById("totalGoals");

        const completedGoals =
            document.getElementById("completedGoals");

        const pendingGoals =
            document.getElementById("pendingGoals");

        goalList.innerHTML = "";

        const goals =
            res.goals.reverse();

        totalGoals.innerText =
            goals.length;

        completedGoals.innerText =
            goals.filter(g => g.completed).length;

        pendingGoals.innerText =
            goals.filter(g => !g.completed).length;

        goals.forEach(goal => {

            goalList.innerHTML += `
                <div class="goal-card">

                    <h3>${goal.title}</h3>

                    <p>
                        ${goal.description || ""}
                    </p>

                    <p>📅 ${goal.date}</p>

                    <p>⏰ ${goal.time}</p>

                    <p class="${
                        goal.completed
                        ? "completed-status"
                        : "pending-status"
                    }">

                        ${
                            goal.completed
                            ? "✅ Completed"
                            : "⏳ Pending"
                        }

                    </p>

                    ${
                        !goal.completed
                        ?
                        `
                        <button
                            onclick="completeGoal('${goal._id}')">
                            Complete Goal
                        </button>
                        `
                        :
                        ""
                    }

                    <button
                        onclick="deleteGoal('${goal._id}')">

                        Delete
                    </button>

                </div>
            `;
        });

    } catch (err) {

        console.error(
            "Goal error:",
            err
        );
    }
}

async function completeGoal(id) {

    try {

        await fetch(
            "http://localhost:5000/api/goals/" + id,
            {
                method: "PUT",

                headers: {
                    Authorization:
                        "Bearer " + token
                }
            }
        );

        loadGoals();

    } catch (err) {

        console.error(err);
    }
}

async function deleteGoal(id) {
console.log("Delete ID:", id);
    if (!confirm("Delete this goal?"))
        return;

    try {

        const res = await fetch(
            "http://localhost:5000/api/goals/" + id,
            {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        const data = await res.json();

        console.log(data);

        await loadGoals();

    } catch (err) {

        console.error(
            "Delete Error:",
            err
        );
    }
}
// ================= PROFILE =================

async function loadProfile() {

    try {

        const res =
            await apiGet("/profile");

        document.getElementById(
            "profileName"
        ).innerText =
            res.user.name;

        document.getElementById(
            "profileEmail"
        ).innerText =
            res.user.email;

        document.getElementById(
            "profileStreak"
        ).innerText =
            res.user.moodStreak;

        const contactList =
            document.getElementById(
                "contactList"
            );

        contactList.innerHTML = "";

        res.user.emergencyContacts
            .forEach(contact => {

            contactList.innerHTML += `
                <p>
                    👤 ${contact.name}
                    -
                    ${contact.email}
                </p>
            `;
        });

    } catch (err) {

        console.error(
            "Profile error:",
            err
        );
    }
}

// ================= ADD CONTACT =================

async function addContact() {

    const name =
        document.getElementById(
            "contactName"
        ).value.trim();

    const email =
        document.getElementById(
            "contactEmail"
        ).value.trim();

    if (!name || !email)
        return;

    await apiPost(
        "/add-contact",
        { name, email }
    );

    document.getElementById(
        "contactName"
    ).value = "";

    document.getElementById(
        "contactEmail"
    ).value = "";

    loadProfile();
}

// ================= LOGOUT =================

function logout() {

    localStorage.removeItem(
        "token"
    );

    window.location.href =
        "index.html";
}

// ================= INITIAL LOAD =================

showSection("home");