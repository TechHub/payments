const express = require('express');
const bodyParser = require('body-parser');
const RazorNode = require('razornode').razorNode;
const cors = require('cors');
const app = express();

// CONFIG
const stripeLondon = require('stripe')(process.env.STRIPE_KEY_LONDON);
const razorPay = new RazorNode(process.env.RAZOR_KEY, process.env.RAZOR_SECRET);

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

app.get('/bangalore', (req, res) => {
  res.render('bangalore.ejs', {});
});

app.post('/charge_stripe', (req, res) => {
  let stripe;
  let currency;

  if (req.body.location === 'london') {
    stripe = stripeLondon;
    currency = 'gbp';
  } else if (req.body.location === 'madrid') {
    stripe = stripeMadrid;
    currency = 'eur';
  }

  const chargeParams = {
    amount: req.body.amount,
    currency: currency,
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

app.post('/charge_razorpay', (req, res) => {
  const paymentID = req.body.id;
  const amount = req.body.amount;
  razorPay.capturePayment(paymentID, amount)
    .then((result) => {
      res.send(result.responseObject);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

const server = app.listen(process.env.PORT || 3000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
