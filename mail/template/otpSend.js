function generateOtpEmailTemplate(email, otp) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>CoSkill OTP Verification</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f4f4f4;
            padding: 0;
            margin: 0;
          }
          .container {
            max-width: 500px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            color: #256137;
          }
          .otp-box {
            margin: 30px auto;
            background-color: #256137;
            color: #ffffff;
            padding: 15px 25px;
            font-size: 24px;
            font-weight: bold;
            width: fit-content;
            border-radius: 8px;
            letter-spacing: 3px;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #777;
            text-align: center;
          }
          .highlight {
            color: #256137;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="header">Welcome to <span class="highlight">CoSkill</span> 👋</h2>
          <p>Hey <strong>${email}</strong>,</p>
          <p>Thanks for joining <strong>CoSkill</strong> — a platform where people exchange skills and grow together!</p>
          <p>Use the following OTP to verify your email:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
          <div class="footer">
            If you didn’t request this, you can safely ignore this email.<br/>
            &copy; ${new Date().getFullYear()} CoSkill. All rights reserved.
          </div>
        </div>
      </body>
    </html>
    `;
  }
  


  module.exports = generateOtpEmailTemplate;