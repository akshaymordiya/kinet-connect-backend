const nodemailer = require('nodemailer');
const config = require('../config/config');
const { sendOtpTemplate } = require('../templates');

const transport = nodemailer.createTransport(config.email.smtp);

class EmailServices {
  constructor(){
    if(config.env === 'development'){
      transport
        .verify()
        .then(() => console.log("Connected to Email servers"))
        .catch(() => console.log("Unable to connect to email servers, Make sure you have configured the SMTP options"))
    } 
  }

  async sendEmail(to, subject, text, html){
    await transport.sendMail({
      to,
      from: config.email.from,
      subject,
      text,
      html
    })
  }
  
  sendOtpByEmail(to, otp){
    const template = sendOtpTemplate({ otp })
    const subject = 'Account Verification';
    this.sendEmail(
      to,
      subject,
      undefined,
      template
    )
  }
}

module.exports = new EmailServices();