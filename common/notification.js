const admin = require('firebase-admin');

class FirebaseNotificationService {
  constructor() {
    try {
      // const serviceAccount = require('../config/admin.json');
      
      // // Initialize Firebase Admin SDK if not already initialized
      // if (!admin.apps.length) {
      //   admin.initializeApp({
      //     credential: admin.credential.cert(serviceAccount),
      //   });
      // }
      
      // this.messaging = admin.messaging();
      console.log('Firebase Notification Service initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Notification Service:', error);
      throw error;
    }
  }

  /**
   * Send notification to a specific topic
   * @param {string} topic - The topic to send notification to
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {Object} data - Additional data to send (optional)
   * @returns {Promise} - Firebase messaging response
   */
  async sendToTopic( title, body, data = {}) {
    if ( !title || !body) {
      throw new Error(' title, and body are required fields.');
    }
    const topic = 'news';

    try {
      const message = {
        topic,
        notification: {
          title,
          body,
        },
        data,
      };

      const response = await this.messaging.send(message);
      console.log('Notification sent successfully to topic:', topic, response);
      return {
        success: true,
        message: 'Notification sent successfully',
        data: response,
      };
    } catch (error) {
      console.error('Error sending notification to topic:', topic, error);
      throw error;
    }
  }

  /**
   * Send notification to specific device tokens
   * @param {string|string[]} tokens - Device token(s) to send notification to
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {Object} data - Additional data to send (optional)
   * @returns {Promise} - Firebase messaging response
   */
  async sendToDevices(tokens, title, body, data = {}) {
    if (!tokens || !title || !body) {
      throw new Error('Token(s), title, and body are required fields.');
    }

    const deviceTokens = Array.isArray(tokens) ? tokens : [tokens];

    try {
      const message = {
        notification: {
          title,
          body,
        },
        data,
        tokens: deviceTokens,
      };

      const response = await this.messaging.sendMulticast(message);
      console.log(`Notification sent successfully to ${response.successCount} devices`);
      return {
        success: true,
        message: `Notification sent successfully to ${response.successCount} devices`,
        data: response,
      };
    } catch (error) {
      console.error('Error sending notification to devices:', error);
      throw error;
    }
  }

  /**
   * Create a middleware function for Express to handle topic notifications
   * @returns {Function} Express middleware
   */
  createTopicNotificationMiddleware() {
    return async (req, res) => {
      const payload = req.body;

      if (!payload || !payload.title || !payload.body) {
        return res.status(400).json({
          success: false,
          message: 'Title and body are required fields.',
        });
      }

      try {
        const topic = payload.topic || 'news'; // Default to 'news' if no topic specified
        const result = await this.sendToTopic(
          topic, 
          payload.title, 
          payload.body, 
          payload.data || {}
        );
        
        return res.status(200).json(result);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
          data: {},
        });
      }
    };
  }
}

module.exports = FirebaseNotificationService;