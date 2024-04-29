const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51P7PiGRxFFZ42bcDhwU2qQhIyZzTew92dzQyseBn7EnwqxfyIpJQLcOu40f5i4fOX99M5jvCbGHLQxRRPi9j14dx00faBJy9sU');

//  URL: /payments/intents -> for creating a payment intent response is client_secret key
router.post('/intents', async (req, res) => {
    try {

      console.log(req.body)

      const customer = await stripe.customers.create({
        email: req.body.email,  // Make sure to pass email from client req.body.email
        name: req.body.name,  // Make sure to pass email from client req.body.name
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount, // usd -> pennies, eur -> cents (lowest denominator of currency in integer)
        currency: 'usd',
        customer: customer.id, // Associate this payment intent with the created customer
        automatic_payment_methods: {
          enabled: true,
        },
      });
      console.log("res", res)

      res.json({ paymentIntent: paymentIntent.client_secret });
    } catch (e) {
      res.status(400).json({
        error: e.message,
      });
    }
  });
  

module.exports = router;