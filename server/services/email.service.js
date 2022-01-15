const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

function EmailService({
  emailAccount: {
    user,
    pass
  },
  host,
}) {
  const emailsPath = path.join(__dirname, '..', '..', 'views', 'email');
  const newUserEmail = fs.readFileSync(path.join(emailsPath, 'new-user.ejs')).toString("utf-8")

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false,
    }
  });

  this.sendEmail = function({
    receiptEmail,
    subject,
    plain,
    html,
  }) {
    return transporter.sendMail({
      to: receiptEmail,
      text: plain,
      from: user,
      subject,
      html,
    });
  }

  this.sendRegisterEmail = function({
    username,
    email,
  }) {
    return this.sendEmail({
      receiptEmail: email,
      subject: 'Andrion New Account',
      plain: `You just registered on Andrion with the username ${username}, starting today, ${new Date().toUTCString()}`,
      html: ejs.render(newUserEmail, {host, username, email, 'token': 'undefined'})
    });
  }
}

module.exports = {
  EmailService
};