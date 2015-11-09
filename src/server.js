const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const stripeKey = process.env.STRIPE_KEY;

const stripe = require("stripe")(stripeKey);

app.use(bodyParser.json());

console.log(__dirname);

app.use(express.static(__dirname + '/public'));

app.post('/charge', (req, res) => {
  console.log(req.body);
  const chargeParams = {
    amount: req.body.amount,
    currency: 'gbp',
    source: req.body.token, // obtained with Stripe.js
    description: req.body.description,
    receipt_email: req.body.email
  };
  stripe.charges.create(chargeParams)
    .then(charge => {
      res.send(charge);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

const server = app.listen(process.env.PORT || 3000, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
