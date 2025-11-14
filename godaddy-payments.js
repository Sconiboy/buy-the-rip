// GoDaddy Payments Integration
// API Key: 34Awdpcba8_4KKmdJme12FEWduvo9xATB
// Secret: 88QPGzP8kSptzP8gHPopw7

const GODADDY_API_KEY = '34Awdpcba8_4KKmdJme12FEWduvo9xATB';
const GODADDY_SECRET = '88QPGzP8kSptzP8gHPopw7';
const GODADDY_API_URL = 'https://api.godaddy.com/v1/payments';

const PLANS = {
    basic: {
        name: 'Basic Plan',
        price: 69.99,
        currency: 'USD',
        description: 'Unlimited stock lookups + Full analysis suite'
    },
    deluxe: {
        name: 'Deluxe Plan',
        price: 499.00,
        currency: 'USD',
        description: 'Everything in Basic + Advanced charts + Admin dashboard'
    }
};

class GoDaddyPayments {
    constructor(apiKey, secret) {
        this.apiKey = apiKey;
        this.secret = secret;
        this.baseURL = GODADDY_API_URL;
    }

    // Create a payment intent
    async createPaymentIntent(planType, userEmail, userId) {
        const plan = PLANS[planType];
        if (!plan) throw new Error('Invalid plan type');

        const payload = {
            amount: Math.round(plan.price * 100), // Convert to cents
            currency: plan.currency,
            description: plan.description,
            metadata: {
                userId: userId,
                userEmail: userEmail,
                planType: planType,
                planName: plan.name
            },
            return_url: `${window.location.origin}?payment_success=true&plan=${planType}`,
            cancel_url: `${window.location.origin}?payment_cancelled=true`
        };

        try {
            const response = await fetch(`${this.baseURL}/intents`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Payment API error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    }

    // Verify payment
    async verifyPayment(paymentId) {
        try {
            const response = await fetch(`${this.baseURL}/${paymentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Verification error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    }

    // Create subscription
    async createSubscription(planType, userEmail, userId) {
        const plan = PLANS[planType];
        if (!plan) throw new Error('Invalid plan type');

        const payload = {
            plan_id: planType,
            customer_email: userEmail,
            metadata: {
                userId: userId,
                planType: planType
            }
        };

        try {
            const response = await fetch(`${this.baseURL}/subscriptions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Subscription error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    }

    // Get plan details
    getPlan(planType) {
        return PLANS[planType];
    }

    // Get all plans
    getAllPlans() {
        return PLANS;
    }
}

// Initialize GoDaddy Payments
const godaddyPayments = new GoDaddyPayments(GODADDY_API_KEY, GODADDY_SECRET);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GoDaddyPayments, godaddyPayments, PLANS };
}
