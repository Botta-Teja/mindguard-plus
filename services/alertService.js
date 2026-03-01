const nodemailer = require("nodemailer");

const sendAlertEmail = async (toEmail, userName, userMessage) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: "🚨 MindGuard Alert: High Emotional Risk Detected",
            text: `
Hello,

This is an automated alert from MindGuard+.

${userName} has shown signs of emotional distress.

Recent message:
"${userMessage}"

Please reach out to them immediately and provide support.

This is not a medical diagnosis, but a precautionary alert.

- MindGuard+ System
            `
        };

        await transporter.sendMail(mailOptions);

        console.log("Alert email sent to:", toEmail);

    } catch (error) {
        console.error("Email sending failed:", error.message);
    }
};

module.exports = sendAlertEmail;
