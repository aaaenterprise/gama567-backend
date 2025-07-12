// const axios = require('axios')
// const dotenv = require('dotenv');


// dotenv.config();
// const sendOTP2 = async (opt, phoneNumber) => {
//     const apiKey = process.env.OTP_KEY;  // API key from environment variables
//     const senderId = process.env.SENDER_ID;      // Sender ID from environment variables
//     const messageId = process.env.MESSAGE_ID;    // Message ID from environment variables
//     const url = 'https://www.fast2sms.com/dev/bulkV2';
  
//     // Check if all necessary environment variables are present
//     if (!apiKey || !senderId || !messageId) {
//       console.error('Missing required environment variables.');
//       return;
//     }
  
//     const params = new URLSearchParams({
//       authorization: apiKey,
//       sender_id: senderId,
//       message: messageId,
//       variables_values: opt,
//       route: 'dlt',
//       numbers: phoneNumber,  // Single mobile number
//     });
  
//     try {
//       const response = await fetch(`${url}?${params.toString()}`, {
//         method: 'GET',
//         headers: {
//           'cache-control': 'no-cache',
//         },
//       });
  
//       if (response.ok) {
//         const data = await response.json();
//         console.log('SMS sent successfully:', data);
//       } else {
//         console.error('Error sending SMS:', response.status, await response.text());
//       }
//     } catch (error) {
//       console.error('Error sending SMS:', error);
//     }
// };
// const sendOTP = async (opt, phoneNumber) => {
//     try {
//         const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
//             params: {
//                 authorization: process.env.API_KEY,
//                 variables_values: opt,
//                 route: 'otp',
//                 numbers: phoneNumber
//             },
//             headers: {
//                 'cache-control': 'no-cache'
//             }
//         });
//         console.log(response.data);
//     } catch (error) {
//         console.error('Error sending OTP:', error);
//     }
// };

const axios = require('axios');
const FormData = require('form-data');

/**
 * Sends an OTP SMS to the specified mobile number
 * @param {string} otp - The OTP code to send
 * @param {string} mobileNumber - The mobile number to send SMS to
 * @returns {Promise} - Promise that resolves with the API response
 */
async function sendOTP(otp, mobileNumber) {
  try {
    let data = new FormData();
    data.append('sender_id', 'PTPSMS');
    data.append('message', `Hi Your User OTP is: ${otp} Thank you ! ARK SERVICE PTPSMS`);
    data.append('mobile_no', mobileNumber);
    data.append('dlt_template_id', '1207168605001414924');

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://sms.jaipursmshub.in/api_v2/message/send',
      headers: {
        'Authorization': 'Bearer cwSu9zr9AAKv6_-qr858CbB_oVXK987qnqu-TENEcWYOhgItgmfVc0pjKPnGlSu8',
        ...data.getHeaders()
      },
      data: data
    };

    const response = await axios.request(config);
    console.log('SMS sent successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error sending SMS:', error.response?.data || error.message);
    throw error;
  }
}
module.exports = {
    sendOTP
}
// Example usage
// const otp = '5599';
// const phoneNumber = '8934983769';
// sendOTP(otp, phoneNumber);
