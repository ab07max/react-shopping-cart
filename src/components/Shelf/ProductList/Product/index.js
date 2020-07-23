import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Thumb from '../../../Thumb';
import { formatPrice } from '../../../../services/util';
import { addProduct } from '../../../../services/cart/actions';

const Product = ({ product, addProduct }) => {
  product.quantity = 1;

  let formattedPrice = formatPrice(product.price, product.currencyId);

  let productInstallment;

  if (!!product.startDate) {
    //const installmentPrice = product.price / product.installments;

    productInstallment = (
      <div className="installment">
        <span><b>{product.startDate} - {product.endDate}</b></span><br/>
        {product.meetingDate} | {product.meetingTime}
          {/* {product.currencyFormat}
          {formatPrice(installmentPrice, product.currencyId)} */}
      </div>
    );
  }

  return (
    <div
      className="shelf-item"
      onClick={() => addProduct(product)}
      data-sku={product.thumbnailUrl}
    >
      {/* {product.isFreeShipping && (
        <div className="shelf-stopper">Free shipping</div>
      )} */}
      <div className="shelf-stopper">Registration ends {product.registrationEnd}</div>

      <Thumb
        classes="shelf-item__thumb"
        src={require(`../../../../static/products/${product.thumbnailUrl}.jpg`)}
        alt={product.title}
        title={product.title}
        description={product.Description}
        pre={product.prerequisite}
        requirement={product.Requirement}

      />

      <p className="shelf-item__title">{product.title}</p>
      <div className="shelf-item__price">
        <div className="val">
          <small>{product.currencyFormat}</small>
          <b>{formattedPrice.substr(0, formattedPrice.length - 3)}</b>
          <span>{formattedPrice.substr(formattedPrice.length - 3, 3)}</span>
        </div>
        {productInstallment}
      </div>
      <div className="shelf-item__buy-btn">Add to cart</div>
    </div>
  );
};

Product.propTypes = {
  product: PropTypes.object.isRequired,
  addProduct: PropTypes.func.isRequired
};

export default connect(
  null,
  { addProduct }
)(Product);
