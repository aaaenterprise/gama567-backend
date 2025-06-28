const axios = require('axios')
const dotenv = require('dotenv');


dotenv.config();
const sendOTP2 = async (opt, phoneNumber) => {
    const apiKey = process.env.OTP_KEY;  // API key from environment variables
    const senderId = process.env.SENDER_ID;      // Sender ID from environment variables
    const messageId = process.env.MESSAGE_ID;    // Message ID from environment variables
    const url = 'https://www.fast2sms.com/dev/bulkV2';
  
    // Check if all necessary environment variables are present
    if (!apiKey || !senderId || !messageId) {
      console.error('Missing required environment variables.');
      return;
    }
  
    const params = new URLSearchParams({
      authorization: apiKey,
      sender_id: senderId,
      message: messageId,
      variables_values: opt,
      route: 'dlt',
      numbers: phoneNumber,  // Single mobile number
    });
  
    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'cache-control': 'no-cache',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('SMS sent successfully:', data);
      } else {
        console.error('Error sending SMS:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
};
const sendOTP = async (opt, phoneNumber) => {
    try {
        const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
            params: {
                authorization: process.env.API_KEY,
                variables_values: opt,
                route: 'otp',
                numbers: phoneNumber
            },
            headers: {
                'cache-control': 'no-cache'
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
};
module.exports = {
    sendOTP
}
// Example usage
// const otp = '5599';
// const phoneNumber = '8934983769';
// sendOTP(otp, phoneNumber);
