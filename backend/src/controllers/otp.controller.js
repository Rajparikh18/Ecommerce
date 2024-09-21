import twilio from 'twilio';
import nodemailer from 'nodemailer';

// Twilio credentials from your Twilio Console
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio(accountSid, authToken);

// Nodemailer setup for email OTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Sender email
    pass: process.env.PASSWORD,  // App password (Google App Password if using Gmail)
  },
});

//generate otp


const generateRandomDigit = () => Math.floor(Math.random() * 10);

const generateOTP = () => {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += generateRandomDigit();
    }
    return otp;
};

// Send OTP via SMS
const sendOTPSMS = async (number, otp) => {
    try {
        await twilioClient.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: number,
        });
    } catch (error) {
        console.error(error);
    }
};

// Send OTP via Email
const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for Verification',
            text: `Your OTP is ${otp}`,
        });
    } catch (error) {
        console.error(error);
    }
};

export {generateOTP, sendOTPSMS, sendOTPEmail};