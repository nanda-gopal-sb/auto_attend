const nodemailer = require("nodemailer");
const secrets = require("../db-helpers/const-local.js");
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	secure: true,
	auth: {
		user: "nandagopal.nsb@gmail.com",
		pass: secrets.emailKey,
	},
});

function generateLoginDetailsTemplate(login_details) {
	return `
    <body>
      <div>
        <h2>Welcome to Our Platform!</h2>
        <p>Here are your initial login credentials:</p>
        <div>
          <strong>Username:</strong> ${login_details.username} <br>
          <strong>Password:</strong> ${login_details.password} <br>
        </div>
        <p>Thank you!</p>
      </div>
    </body>
    </html>
  `;
}

async function sendEmail(email, transporter, html) {
	const info = await transporter.sendMail({
		from: "nandagopal.nsb@gmail.com", // sender address
		to: email, // list of receivers
		subject: "The Login Details",
		html: html,
	});
	console.log("Message sent: %s", info.messageId);
}

module.exports = {
	sendEmail,
	generateLoginDetailsTemplate,
	transporter,
};