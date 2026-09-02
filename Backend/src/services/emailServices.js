const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});
console.log("success")

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    console.log("Before sending email");

    const info = await transporter.sendMail({
      from: `"Placement Tracker" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line 
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegisterEmail(userEmail , name) {
    const subject = "Wellcome to Placement Tracker !";
    const text = `Hello ${name} \n\n Thank You for Registering at Placement Tracker.
    we're excited to have you on board! \n\n Best regard, \n the Placement Tracker team`;
    const html = `<p>hello ${name} </p><p> Thank You for Registering at Placement Tracker 
    We're Excited to Have You on Board </p> <p>Best regards ,<br> Placement Tracker Team</p>`;

    await sendEmail(userEmail ,subject , text, html);
}


module.exports ={ sendRegisterEmail };