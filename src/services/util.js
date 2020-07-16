require('dotenv').config();

export const formatPrice = (x, currency) => {
  switch (currency) {
    case 'BRL':
      return x.toFixed(2).replace('.', ',');
    default:
      return x.toFixed(2);
  }
};

export const productsAPI = process.env.REACT_APP_FIREBASE_DATABASE + '/products.json';

//export const productsAPI = "http://localhost:8001/api/products";
