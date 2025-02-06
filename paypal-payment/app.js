const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8080;

app.use(express.json());

// PayPal API credentials
const CLIENT_ID = 'AS0DPgkh0ZENMcSpe8dK5b9ztKMvZFDVgJHDwyYQ3_wsRhE9Dnmc2SVSmdpMbAwYhFD934Q8z8hxX1Tw';
const CLIENT_SECRET = 'EAegMs7HJEt2TGWiQrgGrGODXBUSNK5CDzGiPS86TkMVn9nMhzSI8hRFGG-cV4trWcDIVRd3mTQui36p';

// Step 1: Get PayPal Access Token
const getPayPalAccessToken = async () => {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', 
    'grant_type=client_credentials', 
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  return response.data.access_token;
};

// Step 2: Create a Payment
app.post('/create-payment', async (req, res) => {
  const { totalAmount } = req.body;
  
  try {
    const token = await getPayPalAccessToken();

    const paymentResponse = await axios.post(
      'https://api.sandbox.paypal.com/v1/payments/payment',
      {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        transactions: [{
          amount: {
            total: totalAmount,
            currency: 'USD'
          },
          description: 'Test Payment'
        }],
        redirect_urls: {
          return_url: 'http://localhost:8080/success',
          cancel_url: 'http://localhost:8080/cancel'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(paymentResponse.data);
  } catch (error) {
    res.status(500).send(error.response.data);
  }
});

// Step 3: Handle Payment Success
app.get('/success', (req, res) => {
  res.send('Payment successful!');
});

// Step 4: Handle Payment Cancellation
app.get('/cancel', (req, res) => {
  res.send('Payment canceled.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
