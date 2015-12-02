const express = require('express');
const bodyParser = require('body-parser');
const braintree = require('braintree');
const cors = require('cors');
const app = express();

// CONFIG
const stripe = require('stripe')(process.env.STRIPE_KEY);
const braintreeGateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/london', (req, res) => {
  res.render('london.ejs', {});
});

app.get('/warsaw', (req, res) => {
  braintreeGateway.clientToken.generate({}, (err, response) => {
    res.render('warsaw.ejs', {
      braintreeToken: response.clientToken,
    });
  });
});

app.get('/braintree_token', (req, res) => {
  braintreeGateway.clientToken.generate({}, (err, response) => {
    res.send(response);
  });
});

app.post('/charge_braintree', (req, res) => {
  // console.log(req.body);
  braintreeGateway.transaction.sale({
    amount: parseInt(req.body.amount, 10),
    paymentMethodNonce: req.body.nonce,
    customer: {
      firstName: req.body.givenName,
      lastName: req.body.surname,
      company: req.body.company,
      email: req.body.email,
    },
  }, (err, result) => {
    console.log(err);
    res.send(result);
  });
});

app.post('/charge_stripe', (req, res) => {
  const chargeParams = {
    amount: req.body.amount,
    currency: 'gbp',
    source: req.body.token, // obtained with Stripe.js
    description: req.body.description,
    receipt_email: req.body.email,
    metadata: {
      fullName: req.body.fullName,
      company: req.body.company,
    },
  };
  stripe.charges.create(chargeParams)
    .then(charge => {
      res.send(charge);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

const server = app.listen(process.env.PORT || 3000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
