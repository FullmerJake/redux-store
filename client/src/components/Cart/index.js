import React, { useEffect } from 'react';
import CartItem from '../CartItem/index.js';
import Auth from '../../utils/auth.js';
import './style.css';
import { numberWithCommas, idbPromise } from '../../utils/helpers.js';

//GRAPHQL APOLLO IMPORTS
import { useLazyQuery } from '@apollo/react-hooks';
import { QUERY_CHECKOUT } from '../../utils/queries.js';


//REDUX IMPORTS
import { useSelector, useDispatch } from 'react-redux';
//REDUX ACTIONS
import {
  addMultipleToCart,
  toggleCart
} from '../../actions';

//STRIPE IMPORTS
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
  //REDUX OBSERVE GLOBAL STATE IMPORT
  const commerceState = useSelector(state => state.commerce);
  //REDUX OBSERVE GLOBAL STATE PIECES
  const {
    cart,
    cartOpen
  } = commerceState
  console.log(cart)
  console.log(cartOpen);

  //REDUX DISPATCHER FUNCTION
  const dispatchREDUX = useDispatch();

  useEffect(() => {
    async function getIDBCart() {
      const cart = await idbPromise('cart', 'get');

      dispatchREDUX(addMultipleToCart(cart))
    }
    if (!cart.length || cart.length === 0) getIDBCart();
  }, [cart.length, dispatchREDUX]);

  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);
  console.log(data);

  function changeCart() {

    dispatchREDUX(toggleCart(cartOpen))
  };

  function calculateTotal() {
    let sum = 0;
    cart.forEach(item => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  };

  function submitCheckout() {
    const productIds = [];
    cart.forEach(item => 
    {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout(
      {
        variables: { products: productIds }
      }
    );
    console.log(productIds);
  };

  useEffect(() => {
    if (data) {
      stripePromise.then
      (
        res => 
        {
          res.redirectToCheckout
          (
            {
              sessionId: data.checkout.session
            }
          );
        }
      );
    }
  }, [data]);

  return (
    <>
      {
        cartOpen 
        ?
        (
          <div className="cart">
            <div 
              className="close"
              onClick={changeCart}
            >
                [close]
            </div>
            <h2>
              Shopping Cart
            </h2>
            {
              cart.length
              ?
              (
                <div>
                  {
                    cart.map(item => (
                      <CartItem 
                        key={item._id}
                        item={item}
                      />
                    ))
                  }
                  <div className="flex-row space-between">
                    <strong>Total: ${numberWithCommas(calculateTotal())}</strong>
                    {
                      Auth.loggedIn() 
                      ?
                      <button
                        onClick={submitCheckout}
                      >
                        Checkout
                      </button>
                      :
                      <span>(log in to check out)</span>
                    }
                  </div>
                </div>
              )
              :
              (
                <h3>
                  <span
                    role="img"
                    aria-label="shocked"
                  >
                    🧐
                  </span>
                  You haven't added anything into your cart yet.
                </h3>
              )
            }
          </div>
        )
        :
        (
          <div
            className="cart-closed"
            onClick={changeCart}
          >
            <span
              role="img"
              aria-label="cart"
            >
              🛒
            </span>
          </div>
        )
      }
    </>
  );
};

export default Cart;