import Razorpay from 'razorpay';
import { ApiResponse } from '../utils/ApiResponse.js';
import { billingSchema } from '../models/billingdetails.model.js';
import crypto from 'crypto';
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
    const { cart } = req.body;
    const amount = cart.reduce((sum, product) => sum + (product.price[0] * product.qty), 0) * 100; // Convert to paise
    const currency = "INR";
    
    // Ensure req.user exists
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const receipt = `Receipt#${Math.floor(Math.random() * 1000000 + 1)}`;
    const payment_capture = 1;
    
    const options = {
        amount,
        currency,
        receipt,
        payment_capture,
    };
    try {
        const response = await razorpay.orders.create(options);
        response.cart = cart;
        response.user = req.user;
        response.amount = amount;
        return res.json(new ApiResponse(200, response, "Order created successfully"));
    } catch (error) {
        console.error('Razorpay Error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, firstName, lastName, address, city, postCode, phoneNumber, cart ,amount} = req.body;

    try {
        // Generate the expected signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        // Compare the generated signature with the one received from Razorpay
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment verified successfully, now save billing details
            const billing = await billingSchema.create({
                firstName,
                lastName,
                address,
                city,
                postCode,
                cart,
                amount: amount / 100,
                owner: req.user.id,
                phoneNumber,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id
            });

            return res.json(new ApiResponse(200, { billing }, "Payment verified and billing details saved successfully"));
        } else {
            return res.status(400).json(new ApiResponse(400, null, "Payment verification failed"));
        }
    } catch (error) {
        console.error('Razorpay Error:', error);
        return res.status(500).json(new ApiResponse(500, null, "Server error", error.message));
    }
};

export { createOrder, verifyPayment };