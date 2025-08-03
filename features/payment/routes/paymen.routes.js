const express = require('express');
const axios = require('axios');
const WalletTransectionServices = require('../../wallet_management/services/wallet_transection_service');
const router = express.Router();

// Configuration
const IMB_CONFIG = {
    baseUrl: 'https://pay.imb.org.in/api',
    userToken: 'fd4a41bab0fc4eee70f586797217a4c0', // Replace with your actual user token from IMB panel
    redirectBaseUrl: 'https://gama567app.org' // Replace with your domain
};

class ImbPaymentService {
    constructor(config) {
        this.config = config;
        this.axios = axios.create({
            baseURL: config.baseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    /**
     * Generate unique order ID
     */
    generateOrderId() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return timestamp + random;
    }

    /**
     * Validate payment request parameters
     */
    validatePaymentRequest(data) {
        const required = ['amount', 'customer_mobile'];
        const missing = required.filter(field => !data[field]);

        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }

        // Validate amount (must be positive number, minimum ₹1)
        const amount = parseFloat(data.amount);
        if (isNaN(amount) || amount < 1) {
            throw new Error('Amount must be a positive number minimum ₹1');
        }

        // Validate mobile number (basic validation)
        if (!/^\d{10}$/.test(data.customer_mobile)) {
            throw new Error('Mobile number must be 10 digits');
        }

        return true;
    }

    /**
     * Convert object to URL-encoded string
     */
    objectToUrlEncoded(obj) {
        return Object.keys(obj)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
            .join('&');
    }

    /**
     * Create payment order
     */
    async createOrder(paymentData) {
        try {
            // Validate input
            this.validatePaymentRequest(paymentData);

            // Generate unique order ID if not provided
            const orderId = paymentData.order_id || this.generateOrderId();

            // Prepare request payload
            const payload = {
                customer_mobile: paymentData.customer_mobile,
                user_token: this.config.userToken,
                amount: paymentData.amount.toString(),
                order_id: orderId,
                redirect_url: `${this.config.redirectBaseUrl}/api/payment/callback?order_id=${orderId}`,
                remark1: paymentData.remark1 || paymentData.email || 'user@gmail.com',
                remark2: paymentData.remark2 || ''
            };

            console.log('Creating payment order with payload:', payload);

            // Convert to URL-encoded format
            const urlEncodedData = this.objectToUrlEncoded(payload);

            // Make API request
            const response = await this.axios.post('/create-order', urlEncodedData);

            if (response.data.status === true) {
                return {
                    success: true,
                    data: response.data,
                    orderId: orderId
                };
            } else {
                throw new Error(response.data.message || 'Order creation failed');
            }

        } catch (error) {
            console.error('Payment creation error:', error.message);

            if (error.response) {
                const errorMsg = error.response.data?.message || error.response.statusText;
                throw new Error(`API Error: ${errorMsg}`);
            } else if (error.request) {
                throw new Error('Network error: Unable to reach payment gateway');
            } else {
                throw error;
            }
        }
    }

    /**
     * Check payment status
     */
    async checkOrderStatus(orderId) {
        try {
            if (!orderId) {
                throw new Error('Order ID is required');
            }

            console.log('Checking payment status for order:', orderId);

            const payload = {
                user_token: this.config.userToken,
                order_id: orderId
            };

            const urlEncodedData = this.objectToUrlEncoded(payload);

            const response = await this.axios.post('/check-order-status', urlEncodedData);

            return {
                success: true,
                data: response.data
            };

        } catch (error) {
            console.error('Status check error:', error.message);

            if (error.response) {
                const errorMsg = error.response.data?.message || error.response.statusText;
                throw new Error(`API Error: ${errorMsg}`);
            } else if (error.request) {
                throw new Error('Network error: Unable to reach payment gateway');
            } else {
                throw error;
            }
        }
    }

    /**
     * Process payment webhook/callback
     */
    async processWebhook(webhookData) {
        try {
            console.log('Processing webhook data:', webhookData);

            // Process based on status
            switch (webhookData.status) {
                case 'SUCCESS':
                    await this.handleSuccessfulPayment(webhookData);
                    break;
                case 'FAILD':
                case 'FALSE':
                    await this.handleFailedPayment(webhookData);
                    break;
                default:
                    console.log('Unknown payment status:', webhookData.status);
            }

            return webhookData;
        } catch (error) {
            console.error('Webhook processing error:', error.message);
            throw error;
        }
    }

    /**
     * Handle successful payment
     */
    async handleSuccessfulPayment(paymentData) {
        console.log('Payment successful:', paymentData);
        // Add your business logic here:
        // - Update order status in database
        // - Send confirmation email
        // - Update user account
        // - Generate invoice
        // - Trigger webhooks
    }

    /**
     * Handle failed payment
     */
    async handleFailedPayment(paymentData) {
        console.log('Payment failed:', paymentData);
        // Add your business logic here:
        // - Update order status to failed
        // - Send failure notification
        // - Log for analysis
    }
}

// Initialize service
const imbPayment = new ImbPaymentService(IMB_CONFIG);

// Routes

/**
 * Create new payment order
 * POST /api/payment/create
 */
router.post('/create', async (req, res) => {
    try {
        const { amount, customer_mobile, remark1, remark2, } = req.body;

        const result = await imbPayment.createOrder({
            amount,
            customer_mobile,
            remark1,
            remark2,

        });

        res.json({
            success: true,
            message: 'Payment order created successfully',
            data: {
                orderId: result.orderId,
                paymentUrl: result.data.result.payment_url
            }
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Check payment status
 * GET /api/payment/status/:orderId
 */
router.get('/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await imbPayment.checkOrderStatus(orderId);
console.log({result});

        res.json({
            success: result.success,
            message: result.data.message,
            status: result.data.status,
            data: result.data.result
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Payment webhook handler (for IMB to send status updates)
 * POST /api/payment/webhook
 */
router.post('/webhook', async (req, res) => {
    try {
        console.log('Received webhook:', req.body);

        const webhookData = req.body;

        if (!webhookData.order_id) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }

        await imbPayment.processWebhook(webhookData);

        // Respond with success to acknowledge webhook receipt
        res.json({
            success: true,
            message: 'Webhook processed successfully'
        });

    } catch (error) {
        console.error('Webhook error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * Payment callback handler (redirect URL)
 * GET /api/payment/callback
 */
router.get('/callback', async (req, res) => {
    try {
        const { order_id, status } = req.query;

        if (!order_id) {
            return res.status(400).send('Order ID is required');
        }

        // Check current payment status
        const statusResult = await imbPayment.checkOrderStatus(order_id);
        const paymentData = statusResult.data;
        console.log(`paymentData: ${JSON.stringify(paymentData)}`);

        // Redirect based on payment status
        switch (paymentData.status) {
            case 'COMPLETED':
                WalletTransectionServices.addMoneyByMobile(paymentData.result.customer_mobile, {
                    amount: paymentData.result.amount,
                    transectionId: paymentData.result.transaction_id,
                    description: paymentData.result.remark1
                });
                res.redirect(`/api/payment/success?orderId=${order_id}&amount=${paymentData.result?.amount || ''}`);
                break;
            case 'ERROR':
            case 'FAILED':
                res.redirect(`/api/payment/failed?orderId=${order_id}`);
                break;
            default:
                res.redirect(`/api/payment/pending?orderId=${order_id}`);
        }

    } catch (error) {
        console.error('Callback error:', error.message);
        res.redirect(`/api/payment/error?message=${encodeURIComponent(error.message)}`);
    }
});

// Frontend payment pages (basic examples)
router.get('/success', (req, res) => {
    const { orderId, amount } = req.query;
    res.send(`
        <html>
            <body style="text-align: center; font-family: Arial;">
                <h1 style="color: green;">Payment Successful!</h1>
                <p>Order ID: ${orderId}</p>
                <p>Amount: ₹${amount}</p>
                <button onclick="window.close()">Close</button>
            </body>
        </html>
    `);
});

router.get('/failed', (req, res) => {
    const { orderId } = req.query;
    res.send(`
        <html>
            <body style="text-align: center; font-family: Arial;">
                <h1 style="color: red;">Payment Failed!</h1>
                <p>Order ID: ${orderId}</p>
                <button onclick="history.back()">Try Again</button>
            </body>
        </html>
    `);
});

router.get('/pending', (req, res) => {
    const { orderId } = req.query;
    res.send(`
        <html>
            <body style="text-align: center; font-family: Arial;">
                <h1 style="color: orange;">Payment Pending!</h1>
                <p>Order ID: ${orderId}</p>
                <p>Your payment is being processed. Please wait...</p>
                <button onclick="location.reload()">Refresh Status</button>
            </body>
        </html>
    `);
});

router.get('/error', (req, res) => {
    const { message } = req.query;
    res.send(`
        <html>
            <body style="text-align: center; font-family: Arial;">
                <h1 style="color: red;">Payment Error!</h1>
                <p>Error: ${decodeURIComponent(message || 'Unknown error occurred')}</p>
                <button onclick="history.back()">Go Back</button>
            </body>
        </html>
    `);
});

// Export for use in other modules
module.exports = router;