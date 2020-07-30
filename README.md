## Basic Overview - [Live Demo](https://vtrainonlinelearning.firebaseapp.com/)

A dynamic E-commerce web application with industry standard search filters, integrations to payment methods implementing the “Pay as you learn” strategy. This will solve the problem of eliminating the need of face-to-face sessions and it will also be favored by the learner, as the strategy suggests, you only pay for what you learn. As soon as the payment is successful, the learner receives an email entailing all the registration details, instructor details and webex/ zoom links.

#### Features

- Add and remove products from the floating cart
- Sort products by highest to lowest and lowest to highest price
- Filter products by available sizes
- Products persist in floating cart after page reloads
- Unit tests, integration tests and e2e testing
- Responsive design

## Getting started

Try playing with the code on CodeSandbox :)

[![Edit app](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/74rykw70qq)

## Build/Run

#### Requirements

- Node.js
- NPM

```javascript

/* First, Install the needed packages */
npm install

/* Then start both Node and React */
npm start

/* To run the tests */
npm run test

/* Running e2e tests */
npm run wdio


```

## About tests

- Unit tests
  - All components have at least a basic smoke test
- Integration tests
  - Fetch product and add to cart properly
- e2e
  - Webdriverio - Add and remove product from cart



