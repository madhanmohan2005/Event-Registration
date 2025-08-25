// Azure Function: Send confirmation email
const nodemailer = require("nodemailer");

module.exports = async function (context, req) {
  try {
    const { name, email, event } = req.body;

    if (!name || !email || !event) {
      context.res = {
        status: 400,
        body: { error: "Missing required fields" },
      };
      return;
    }

    // Configure mail transporter (use your SMTP credentials)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,   // e.g., "smtp.gmail.com"
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // your email
        pass: process.env.SMTP_PASS, // your app password
      },
    });

    const mailOptions = {
      from: `"Event Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Event Registration Confirmation",
      text: `Hello ${name},\n\nThank you for registering for ${event}!\nWe look forward to seeing you.\n\nBest Regards,\nEvent Team`,
      html: `<p>Hello <b>${name}</b>,</p>
             <p>Thank you for registering for <b>${event}</b>!</p>
             <p>We look forward to seeing you.</p>
             <br>
             <p>Best Regards,<br/>Event Team</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    context.res = {
      status: 200,
      body: { message: "Confirmation email sent successfully" },
    };
  } catch (err) {
    context.log.error("Email sending failed:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to send confirmation email" },
    };
  }
};
