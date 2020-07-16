import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { loadCart, removeProduct, changeProductQuantity } from '../../services/cart/actions';
import { updateCart } from '../../services/total/actions';
import CartProduct from './CartProduct';
import { formatPrice } from '../../services/util';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import './style.scss';

import firebase from '../../services/firebase';

toast.configure();

class FloatCart extends Component {
  static propTypes = {
    loadCart: PropTypes.func.isRequired,
    updateCart: PropTypes.func.isRequired,
    cartProducts: PropTypes.array.isRequired,
    newProduct: PropTypes.object,
    removeProduct: PropTypes.func,
    productToRemove: PropTypes.object,
    changeProductQuantity: PropTypes.func,
    productToChange: PropTypes.object,
  };

  state = {
    isOpen: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.newProduct !== this.props.newProduct) {
      this.addProduct(nextProps.newProduct);
    }

    if (nextProps.productToRemove !== this.props.productToRemove) {
      this.removeProduct(nextProps.productToRemove);
    }

    if (nextProps.productToChange !== this.props.productToChange) {
      this.changeProductQuantity(nextProps.productToChange);
    }
  }

  openFloatCart = () => {
    this.setState({ isOpen: true });
  };

  closeFloatCart = () => {
    this.setState({ isOpen: false });
  };

  addProduct = product => {
    const { cartProducts, updateCart } = this.props;
    let productAlreadyInCart = false;

    cartProducts.forEach(cp => {
      if (cp.id === product.id) {
        cp.quantity += product.quantity;
        productAlreadyInCart = true;
      }
    });

    if (!productAlreadyInCart) {
      cartProducts.push(product);
    }

    updateCart(cartProducts);
    this.openFloatCart();
  };

  removeProduct = product => {
    const { cartProducts, updateCart } = this.props;

    const index = cartProducts.findIndex(p => p.id === product.id);
    if (index >= 0) {
      cartProducts.splice(index, 1);
      updateCart(cartProducts);
    }
  };

  clearCart = () => {
    const { cartProducts, updateCart } = this.props;
    console.log(cartProducts);
    let cartProdIndex = cartProducts.length - 1;
    while (cartProdIndex + 1) {
      cartProducts[cartProdIndex].quantity = 0;
      this.changeProductQuantity(cartProducts[cartProdIndex]);
      cartProdIndex -= 1;
    }
  };

  proceedToCheckout = async(token) => {
    const { cartProducts, updateCart } = this.props;
    //console.log({cartProducts})
    const response = await axios.post('http://localhost:5000/checkout', {
      token,
      cartProducts
    });
    const { status } = response.data;
    if (status === "success") {
      let checkoutRef = firebase.database().ref('checkout');
      firebase.database().ref('checkout').push({token, cartProducts});
      toast("Success! Check email for details", { type: "success" });
      this.clearCart();
    } else {
      toast("Something went wrong", { type: "error" });
    }
  };

  changeProductQuantity = changedProduct => {
    const { cartProducts, updateCart } = this.props;

    const product = cartProducts.find(p => p.id === changedProduct.id);
    product.quantity = changedProduct.quantity;
    if (product.quantity <= 0) {
      this.removeProduct(product);
    }
    updateCart(cartProducts);
  }

  render() {
    const { cartTotal, cartProducts, removeProduct, changeProductQuantity } = this.props;

    const products = cartProducts.map(p => {
      return (
        <CartProduct product={p} removeProduct={removeProduct} changeProductQuantity={changeProductQuantity} key={p.id} />
      );
    });

    let classes = ['float-cart'];

    if (!!this.state.isOpen) {
      classes.push('float-cart--open');
    }

    return (
      <div className={classes.join(' ')}>
        {/* If cart open, show close (x) button */}
        {this.state.isOpen && (
          <div
            onClick={() => this.closeFloatCart()}
            className="float-cart__close-btn"
          >
            X
          </div>
        )}

        {/* If cart is closed, show bag with quantity of product and open cart action */}
        {!this.state.isOpen && (
          <span
            onClick={() => this.openFloatCart()}
            className="bag bag--float-cart-closed"
          >
            <span className="bag__quantity">{cartTotal.productQuantity}</span>
          </span>
        )}

        <div className="float-cart__content">
          <div className="float-cart__header">
            <span className="bag">
              <span className="bag__quantity">{cartTotal.productQuantity}</span>
            </span>
            <span className="header-title">Cart</span>
          </div>

          <div className="float-cart__shelf-container">
            {products}
            {!products.length && (
              <p className="shelf-empty">
                Add some products in the cart <br />
                :)
              </p>
            )}
          </div>

          <div className="float-cart__footer">
            <div className="sub">SUBTOTAL</div>
            <div className="sub-price">
              <p className="sub-price__val">
                {`${cartTotal.currencyFormat} ${formatPrice(
                  cartTotal.totalPrice,
                  cartTotal.currencyId
                )}`}
              </p>
              <small className="sub-price__installment">
                {!!cartTotal.installments && (
                  <span>
                    {`OR UP TO ${cartTotal.installments} x ${
                      cartTotal.currencyFormat
                    } ${formatPrice(
                      cartTotal.totalPrice / cartTotal.installments,
                      cartTotal.currencyId
                    )}`}
                  </span>
                )}
              </small>
            </div>
            {/* <div onClick={() => this.clearCart()} className="buy-btn">
              Checkout
            </div> */}

            {products.length ? (
              <StripeCheckout
              name="ABC Company Co."
              description="Company Description"
              image=""
              ComponentClass="div"
              currency={cartTotal.currencyId}
              stripeKey={process.env.REACT_APP_STRIPE_PK}
              token={this.proceedToCheckout}
              billingAddress
              shippingAddress
              alipay
              bitcoin
              allowRememberMe
              amount={cartTotal.totalPrice * 100}
              triggerEvent="onClick"
              >
              <div className="buy-btn">Checkout</div>
            </StripeCheckout>
            ) : <div className="disable-buy-btn">Checkout</div>}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cartProducts: state.cart.products,
  newProduct: state.cart.productToAdd,
  productToRemove: state.cart.productToRemove,
  productToChange: state.cart.productToChange,
  cartTotal: state.total.data
});

export default connect(
  mapStateToProps,
  { loadCart, updateCart, removeProduct, changeProductQuantity }
)(FloatCart);
