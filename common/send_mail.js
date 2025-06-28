// const nodemailer = require('nodemailer');


// // password for startupsphare@workmail.com : "7ZE7NXUG6SVZP3MN7KMQ"

// // for generating the OTP
// function generateOTP(length) {
//     let otp = '';
//     for (let i = 0; i < length; i++) {
//         otp += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
//     }
//     return otp;
// }

// // Create a transporter object using your SMTP server details
// const transporter = nodemailer.createTransport({

//     host: 'smtp.mail.com', // Use your SMTP service provider (e.g., Gmail, Outlook)
//     // port: 465,
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'startupsphare@workmail.com', // Your email address
//         pass: "7Q2YBHQXAHOPYB2PR3BX", // Your email password
//     },
//         // service:'Gmail',
//         // auth: {
//         //     user: 'abdulrahaman.techlead@gmail.com', // Your email address
//         //     pass: 'uaag yynq bnrk wkwm', // Your email password
//         // },
// });

// // Generate a random OTP
// const otp = generateOTP(length = 6);
// console.log(otp);

// // Define the email content
// const mailOptions = {
//     from: 'startupsphare@workmail.com',
//     to: 'startupsphare@workmail.com', // The recipient's email address
//     subject: 'Your OTP Code',
//     text: `Your OTP code is: ${otp}`,
// };

// // Send the email
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.error('Error sending email:', error.message, error.name);
//     } else {
//         console.log('Email sent:', info.response);
//     }
// });



// sendMail=(mailOptions)=>{
//     // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error.message, error.name);
//         } else {
//             console.log('Email sent:', info.response);
//         }
//     });
// }




const nodemailer = require('nodemailer');
const mailConfig = require('../config/mailConfig')
class EmailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: mailConfig.email, // Your email address
                pass: mailConfig.email_pass, // Your email password
            },
        });
    }

    sendEmail(email, username, otp) {

        const emailBody = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>Password Reset OTP</title>
                        </head>
                        <body>
                          <h3>Hello ${username.toUpperCase()},</h3>

                          <p>You have requested to reset your password for StartupSphare.</p>

                          <p>Your OTP (One-Time Password) for password reset is: <strong>${otp}</strong></p>

                          <p>This OTP is valid for a limited time, 10 minutes. If you did not request this password reset, please ignore this email.</p>

                          <p>Thank you for using StartupSphare!</p>

                          <p>Best regards,<br>StartupSphare Team</p>
                        </body>
                        </html>
                        `;

        const mailOptions = {
            from: mailConfig.email_from,
            to: email,
            subject: 'Password Reset OTP',
            html: emailBody,
        };


        return new Promise((resolve, reject) => {
            // Send the email
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info.response);
                }
            });
        });
    }
}

module.exports = EmailSender;





