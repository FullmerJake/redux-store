import React, { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';
import { idbPromise } from '../../utils/helpers.js';

// import { useStoreContext } from '../../utils/GlobalState.js';
//import { UPDATE_PRODUCTS } from '../../utils/actions.js';

import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif"

//REDUX
import { useSelector, useDispatch } from 'react-redux';
//REDUX ACTIONS
import {
  updateProducts
} from '../../actions';

function ProductList() {
  //retrieve the global state object and dispatch method to update state
  // const [, dispatch] = useStoreContext();
  // const { currentCategory } = state;

  //GRAPHQL DATABASE QUERY get all products
  const { loading, data } = useQuery(QUERY_PRODUCTS);//query data from database

  //REDUX OBSERVE GLOBAL STATE OF THE GLOBAL REDUCER
  const commerceState = useSelector(state => state.commerce);
  //console.log('vvvv GLOBAL COMMERCE STATE vvvv');
  //console.log(commerceState);

  //REDUX USE DISPATCHER
  const dispatchREDUX = useDispatch();

  //GET PIECE OF GLOBAL STATE TO OBSERVE
  const {
    products,
    currentCategory
    // cartOpen,
    // categories,
  } = commerceState;

  ///console.log('vvvv REDUX PRODUCTS ARRAY vvvv');
  ///console.log(products);
  
  useEffect(() => {
    //if theres data to be stored
    if (data) {
      //lets store it in the global state object
      // dispatch
      // (
      //   {
      //     type: UPDATE_PRODUCTS,
      //     products: data.products
      //   }
      // );

      //REDUX STORE INTO GLOBAL STATE BY USING THE
      // DISPATCH ACTION - updateProducts
      dispatchREDUX(updateProducts(data.products));
      
      //also take each product and save it to idb using helper function
      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
      //add else if to check if `loading is falsey in `useQuery()`
    } else if (!loading) {
      //since server is offline, get all of the data from the `products` store
      idbPromise('products', 'get')
      .then
      (
        products => 
        {
          //use retrieved data to set global state for offline browsing
          // dispatch
          // (
          //   {
          //     type: UPDATE_PRODUCTS,
          //     products: products
          //   }
          // );
          
          //redux dispatch
          dispatchREDUX(updateProducts(products))
        }
      );
    }
  }, [data, loading, dispatchREDUX])


  //NOW GETTING REDUX commerceState.currentCategory STATE
  function filterProducts() {
    if (!currentCategory) {
      return products;//this is the destructured products state from GLOBAL redux state
    }

    return products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {
        products.length //global redux products state
        ? 
        (
          <div className="flex-row">
              {
                filterProducts().map(product => (
                  <ProductItem
                    key= {product._id}
                    _id={product._id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    quantity={product.quantity}
                  />
                ))
              }
          </div>
        ) 
        : 
        (
          <h3>You haven't added any products yet!</h3>
        )
      }
      { 
        loading ? 
        <img src={spinner} alt="loading" />: null
      }
    </div>
  );
}

export default ProductList;