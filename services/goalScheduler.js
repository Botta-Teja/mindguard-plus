const cron = require("node-cron");
const Goal = require("../models/Goal");
const { sendReminderEmail } = require("./alertService");
const sendSMS = require("./smsService");

cron.schedule("* * * * *", async () => {

    const now = new Date();

    const currentTime = now.toTimeString().slice(0, 5);
    const today = now.toISOString().split("T")[0];

    console.log("⏰ Checking goals:", currentTime);

    try {

        const goals = await Goal.find({
            time: currentTime,
            date: today,
            completed: false
        }).populate("user");

        for (let goal of goals) {

            // 📧 EMAIL
          console.log("User Email:", goal.user.email);
          console.log("User Name:", goal.user.name);

await sendReminderEmail(
    goal.user.email,
    goal.user.name,
    goal.title
);
            
            

            console.log("✅ Reminder sent:", goal.title);
        }

    } catch (error) {
        console.error("Scheduler Error:", error.message);
    }

});