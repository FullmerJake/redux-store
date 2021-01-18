import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';

import { idbPromise } from '../utils/helpers.js';
import { QUERY_PRODUCTS } from "../utils/queries";
import spinner from '../assets/spinner.gif'

import Cart from '../components/Cart/index.js';

//REDUX IMPORTS
import { useSelector, useDispatch } from 'react-redux';
//REDUX ACTIONS
import {
  removeFromCart,
  updateCartQuantity,
  addToCart,
  updateProducts,
} from '../actions';

function Detail() {
  
  const commerceState = useSelector(state => state.commerce);
  
  const {
    products,
    cart,
  } = commerceState;

  const { id } = useParams();
  const currentProduct = products.find(product => product._id === id);
  
  const dispatchREDUX = useDispatch();

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {

    if (products.length) {
      // setCurrentProduct
      // (
      //   state.products.find(product => product._id === id)
      // );

      //REDUX DISPATCH dont need it here

      //retrieved from server
    } else if (data) {//data gotten from server
      // dispatch
      // (
      //   {
      //     type: UPDATE_PRODUCTS,
      //     products: data.products
      //   }
      // );
      
            dispatchREDUX(updateProducts(data.products));

        data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get')
      .then
      (
        indexedProducts => 
        {
          dispatchREDUX(updateProducts(indexedProducts));
        }
      );
    }
  }, [products, data, loading, id, dispatchREDUX]);
  const ADDtoCart = () => {
    const itemInCart = cart.find(cartItem => cartItem._id === id);
    if (itemInCart) {
   
      //REDUX DISPATCH
      dispatchREDUX(updateCartQuantity(currentProduct, Number(itemInCart.purchaseQuantity) + 1))
            idbPromise('cart', 'put', 
      {
        ...itemInCart,
        purchaseQuantity: Number(itemInCart.purchaseQuantity) + 1
      });
    } else {
  
      //REDUX DISPATCH
      const payload = {...currentProduct, purchaseQuantity: 1}
      dispatchREDUX(addToCart(payload))
      idbPromise('cart', 'put', 
      {
        ...currentProduct,
        purchaseQuantity: 1
      });
    }
  };
  const removeFromCartDOM = () => {
 
    //REDUX DISPATCH
    dispatchREDUX(removeFromCart(currentProduct._id))
    idbPromise('cart', 'delete', {...currentProduct});
  };

  return (
    <>
      {
        currentProduct 
        ? 
        (
          <div className="container my-1">
            <Link to="/">
              ← Back to Products
            </Link>

            <h2>{currentProduct.name}</h2>
            <p>
              {currentProduct.description}
            </p>

            <p>
              <strong>Price:</strong>
              ${currentProduct.price}
              {" "}
              <button
                onClick={ADDtoCart}
              >
                Add to Cart
              </button>
              <button
                disabled={
                  !cart.find(product => product._id === currentProduct._id)
                }
                onClick={removeFromCartDOM}
              >
                Remove from Cart
              </button>
            </p>
            <img
              src={`/images/${currentProduct.image}`}
              alt={currentProduct.name}
            />
          </div>
        ) 
        : null
      }
      {
        loading 
        ? 
        <img src={spinner} alt="loading" /> 
        : null
      }
    <Cart />
    </>
  );
};

export default Detail;
