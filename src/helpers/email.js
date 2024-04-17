import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config()
// creating nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    auth: {
        user: process.env.EMAIL_FROM, // generated ethereal user
        pass: process.env.SMTP_KEY, // generated ethereal password (SHORT MESSAGE TRANSFER PROTOCOL)
    },
});

// SendEmail function
export const sendEmail = async (to, subject, message) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text: message,
        html: 
        `<body>
            <h2>${subject}</h2>
            <p>${message}!</p>
            <b>Fragrance Hub Management.</b>
        </body>`
    }
    console.log(`Error sending email to ${to}`);
    try {
        await transporter.sendMail(mailOptions)
    } 
    catch (err) {
        console.log("Error sending email: " + err.message);
    }
}

// sendEmail using the transporter
