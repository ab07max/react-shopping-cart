const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require("stripe")(String(process.env.REACT_APP_STRIPE_SK));
const {"v4": uuidv4} = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const port = 8001;

app.get('/api/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'products.json'));
});

app.post('/checkout', async (req, res) => {
  console.log("Request:", req.body);

  let error;
  let status;
  let totalPrice = 0;
  let productDescription = "";
  try {
    const { cartProducts, token } = req.body;
    // console.log({"CART-PRODUCT": cartProducts});
    // console.log({"TOKEN": token});
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    cartProducts.forEach(cp => {
      totalPrice += cp.price;
      productDescription += cp.title + ","
    });

    productDescription = productDescription.substring(0, productDescription.length - 1);

    const idempotency_key = uuidv4();
    const charge = await stripe.charges.create(
      {
        amount: totalPrice * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${productDescription}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotency_key
      }
    );

    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }
  res.json({ error, status });
});

app.listen(port, () => {
  console.log(`[products] API listening on port ${port}.`);
});
