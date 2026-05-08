require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userMail,name){
    const subject="Welcome to Backend Ledger";
    const text=`Hello ${name}, \n\nThank you for registering at Backend Ledger.`

    const html=`<p>Hello ${name}</p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`

    await  sendEmail(userMail,subject,text,html);
}

async function sendTransactionMail(userMail, name, amount, toAccount) {
  const subject = "Transaction completed successfully";

  const text = `Dear ${name},

We’re pleased to inform you that your transaction has been completed successfully.

Transaction Details:
Amount: ₹${amount}
Recipient Account: ${toAccount}

If you did not authorize this transaction, please contact support immediately.

Best regards,
The Backend Ledger Team`;

  const html = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>We’re pleased to inform you that your transaction has been <strong>completed successfully</strong>.</p>

    <h3>Transaction Details:</h3>
    <ul>
      <li><strong>Amount:</strong> ₹${amount}</li>
      <li><strong>Recipient Account:</strong> ${toAccount}</li>
    </ul>

    <p>If you did not authorize this transaction, please contact support immediately.</p>

    <p>Best regards,<br><strong>The Backend Ledger Team</strong></p>
  `;

  await sendEmail(userMail, subject, text, html);
}

async function sendTransactionFailureMail(userMail, name, amount, toAccount, reason = "Transaction could not be processed") {
  const subject = "Transaction Failed";

  const text = `Dear ${name},

We regret to inform you that your transaction could not be completed.

Transaction Details:
Amount: ₹${amount}
Recipient Account: ${toAccount}
Reason: ${reason}

No amount has been deducted from your account. If you notice any discrepancy or did not initiate this request, please contact support immediately.

Best regards,
The Backend Ledger Team`;

  const html = `
    <p>Dear <strong>${name}</strong>,</p>

    <p>We regret to inform you that your transaction could <strong>not be completed</strong>.</p>

    <h3>Transaction Details:</h3>
    <ul>
      <li><strong>Amount:</strong> ₹${amount}</li>
      <li><strong>Recipient Account:</strong> ${toAccount}</li>
      <li><strong>Reason:</strong> ${reason}</li>
    </ul>

    <p><strong>No amount has been deducted</strong> from your account.</p>

    <p>If you notice any discrepancy or did not initiate this request, please contact support immediately.</p>

    <p>Best regards,<br><strong>The Backend Ledger Team</strong></p>
  `;

  await sendEmail(userMail, subject, text, html);
}

module.exports = {sendRegistrationEmail,sendTransactionMail,sendTransactionFailureMail};