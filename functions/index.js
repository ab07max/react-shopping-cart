
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { request, response } = require('express');

const stripe = require("stripe")(String(process.env.REACT_APP_STRIPE_SK));
const {"v4": uuidv4} = require('uuid');

const admin = require('firebase-admin');
admin.initializeApp();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/', async (req, res) => {
//app.post('/checkout', async (req, res) => {
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
        totalPrice += cp.price * cp.quantity;
        productDescription += cp.title + ","
      });
  
      productDescription = productDescription.substring(0, productDescription.length - 1);
  
      const idempotency_key = uuidv4();
      let totalPriceInCents = Math.floor(totalPrice * 100);
      const charge = await stripe.charges.create(
        {
          amount: totalPriceInCents,
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
    res.status(200).send({ error, status });
  });

exports.checkout = functions.https.onRequest(app);
