const nodemailer = require("nodemailer");

async function sendMail(img, msg) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: false,
      service: "yahoo",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      debug: false,
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Your Attendance Bot 👻" <${process.env.EMAIL_USERNAME}>`, // sender address
      to: process.env.EMAIL_TO, // list of receivers
      subject: msg, // Subject line
      html: `<img src="data:image/png;base64, ${img}" />`, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    throw error;
  }
}

exports.sendMail = sendMail;
