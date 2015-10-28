const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const stripe = require("stripe")(
  "sk_test_melwcmbGnk2eOxtdmidxJTnB"
);

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/charge', (req, res) => {
  console.log(req.body);
  const chargeParams = {
    amount: 2000,
    currency: 'gbp',
    source: req.body.id, // obtained with Stripe.js
    description: 'Charge for test@example.com'
  };
    stripe.charges.create(chargeParams, (err, charge) => {
      // asynchronously called
      console.log(err, charge);
    });
  res.send('okay');
});


const server = app.listen(process.env.PORT || 3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
