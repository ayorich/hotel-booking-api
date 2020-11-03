/* eslint-disable */
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

const {
  NODE_ENV,
  EMAIL_FROM,
  MAIL_HOST,
  HOST_USERNAME,
  HOST_PASSWORD
} = process.env

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Ayodele Kayode <${EMAIL_FROM}>`;
  }

  newTransport() {
    if (NODE_ENV === 'production') {
      // ZOHO
      return nodemailer.createTransport({
        service: MAIL_HOST,
        secure: true,
        auth: {
          user: HOST_USERNAME,
          pass: HOST_PASSWORD
        }
      })
    }
    return nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "85ee7fdf36847d",
        pass: "90c70b20f6e692"
      }
    })
  }

  async send(template, subject) {
    // send the actual email
    // 1. RENDER HTML FOR EMAIL BASE ON PUG TEMPLATE
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });
    // 2.define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)

    };

    // 3.CREATE A TRANSPORT AND SEND EMAIL
    await this.newTransport().sendMail(mailOptions)



  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to hotel booking api app!');
  }
  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)')
  }
};


