import { FETCH_PRODUCTS } from './actionTypes';
import axios from 'axios';

import { productsAPI } from '../util';

import firebase from '../../services/firebase';

const compare = {
  lowestprice: (a, b) => {
    if (a.price < b.price) return -1;
    if (a.price > b.price) return 1;
    return 0;
  },
  highestprice: (a, b) => {
    if (a.price > b.price) return -1;
    if (a.price < b.price) return 1;
    return 0;
  }
};

export const fetchProducts = (filters, sortBy, callback) => dispatch => {
  return firebase.database()
  .ref('products')
  .once('value')
  .then(function(snapshot) {
    console.log(snapshot.val());
    let { products } = snapshot.val();
    if (!!filters && filters.length > 0) {
      products = products.filter(p =>
        filters.find(f => p.keywords.find(keyword => keyword === f)) || filters.find(find => p.meetingDate.find(meet => meet === find))
      );

      // Code for Second filter
    }

    if (!!sortBy) {
      products = products.sort(compare[sortBy]);
    }

    if (!!callback) {
      callback();
    }

    return dispatch({
      type: FETCH_PRODUCTS,
      payload: products
    });
  })
  .catch(err => {
    console.log('Could not fetch products. Try again later.');
  });
};
