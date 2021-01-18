import React from "react";
import { Link } from "react-router-dom";
import { pluralize, idbPromise } from "../../utils/helpers"

//REDUX IMPORTS
import { useSelector, useDispatch } from 'react-redux';
//REDUX ACTIONS
import {
  addToCart,
  updateCartQuantity
} from '../../actions';

function ProductItem(item) {
  //REDUX OBSERVE GLOBAL STATE
  const commerceState = useSelector(state => state.commerce);
  //GET PIECE OF GLOBAL STATE
  const {
    cart
  } = commerceState;
  
  //REDUX DISPATCH FUNCTION
  const dispatchREDUX = useDispatch();
  
  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  const addToCartDOM = () => {
    
    const itemInCart = cart.find(cartItem => cartItem._id === _id);

    if (itemInCart) {

      //REDUX DISPATCH
      dispatchREDUX(updateCartQuantity(itemInCart, Number(itemInCart.purchaseQuantity) + 1));

      idbPromise('cart', 'put', 
      {
        ...itemInCart,
        purchaseQuantity: Number(itemInCart.purchaseQuantity) + 1
      });
    } else {

      //REDUX DISPATCH
      const payload = {...item, purchaseQuantity: 1}
      dispatchREDUX(addToCart(payload));

      idbPromise('cart', 'put', 
      {
        ...item,
        purchaseQuantity: 1
      });
    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button
        onClick={addToCartDOM}
      >
        Add to cart
      </button>
    </div>
  );
}

export default ProductItem;
