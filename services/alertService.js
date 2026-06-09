const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 🚨 EMERGENCY ALERT EMAIL
const sendAlertEmail = async (to, userName, message) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: "🚨 MindGuard Emergency Alert",
            text: `
⚠ EMERGENCY ALERT

User ${userName} may be in distress.

Message:
${message}

Please check immediately.
            `
        });

        console.log("🚨 Alert email sent to:", to);

    } catch (error) {
        console.error("Alert Email Error:", error.message);
    }
};

// ⏰ GOAL REMINDER EMAIL
const sendReminderEmail = async (to, userName, goalTitle) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: "🎯 MindGuard Goal Reminder",
            html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 20px;
                background: #f8fafc;
                border-radius: 12px;
                border: 1px solid #e5e7eb;
            ">
                <h2 style="color:#2563eb;">
                    🎯 Goal Reminder
                </h2>

                <p>
                    Hello <strong>${userName}</strong>,
                </p>

                <p>
                    This is a gentle reminder about your goal:
                </p>

                <div style="
                    background:#ffffff;
                    padding:15px;
                    border-radius:10px;
                    border-left:5px solid #2563eb;
                    margin:15px 0;
                ">
                    <strong>${goalTitle}</strong>
                </div>

                <p>
                    Small consistent actions create big results.
                </p>

                <p>
                    Keep going — you're making progress every day 🌱
                </p>

                <hr>

                <p style="
                    color:gray;
                    font-size:12px;
                ">
                    Sent by MindGuard+
                </p>
            </div>
            `
        });

        console.log("⏰ Reminder email sent to:", to);

    } catch (error) {
        console.error("Reminder Email Error:", error.message);
    }
};

module.exports = {
    sendAlertEmail,
    sendReminderEmail
};