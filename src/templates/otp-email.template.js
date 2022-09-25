const config = require('../config/config');

module.exports = (payload) => {
  return `
      <!doctype html>
      <html lang="en-US">
          <head>
              <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
              <title>Verify user account</title>
              <meta name="description" content="Kinet-connect verify account">
              <style type="text/css">
                  a:hover {text-decoration: underline !important;}
              </style>
          </head>
          <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
              <!--100% body table-->
              <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                  style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                  <tr>
                      <td>
                          <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                              align="center" cellpadding="0" cellspacing="0">
                              <tr>
                                  <td style="height:80px;">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td style="height:20px;">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td>
                                      <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                          style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                          <tr>
                                              <td style="height:40px;">&nbsp;</td>
                                          </tr>
                                          <tr>
                                              <td style="padding:0 35px;">
                                                  <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                    Verify your new Kinet Connect account
                                                  </h1>
                                                  <span
                                                      style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                  <p style="color:#455056; font-size:16px;line-height:24px; margin:0;">
                                                  To verify your email address, please use the following One Time Password 
                                                  </p>
                                                  <p style="background:transparent; font-weight:500; margin:30px 0; color:#000; text-transform:uppercase; font-size:18px;padding:10px 24px;display:inline-block;border-radius:15px; border: 2px solid #ccc">
                                                    ${payload.otp}
                                                  </p>
                                                  <p style="color:#455056; font-size:14px;line-height:20px; margin:0; text-align: justify; text-justify: inter-word;">
                                                  Do not share this OTP with anyone. Kinet takes your account security very seriously. Kinet support will never ask you to disclose or verify your Account's password, OTP, credit card, or banking account number. If you receive a suspicious email with a link to update your account information, do not click on the link—instead, report the email to Kinet for investigation.
                                                  </p>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td style="height:40px;">&nbsp;</td>
                                          </tr>
                                      </table>
                                  </td>
                              <tr>
                                  <td style="height:20px;">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td style="text-align:center;">
                                      <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>${config.website}</strong></p>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="height:80px;">&nbsp;</td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
              <!--/100% body table-->
          </body>
      </html>
  `;
};
