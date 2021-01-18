import React, { useEffect } from "react";

// import { /*UPDATE_CATEGORIES,*/ UPDATE_CURRENT_CATEGORY } from '../../utils/actions.js';

import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";

// import { useStoreContext } from '../../utils/GlobalState.js';
import { idbPromise } from '../../utils/helpers.js';

//REDUX IMPORTS 
import {
  updateCategories, updateCurrentCategory
} from '../../actions';

import { useSelector, useDispatch } from 'react-redux'

function CategoryMenu() {

  //REDUX
  // observe global commerce state
  const commerceState = useSelector(state => state.commerce);
  //use global action dispatcher
  const dispatchREDUX = useDispatch();

  console.log('VVV CHECKING GLOBAL STATE IN CATEGORY MENU COMPONENT VVV');
  console.log(commerceState);

  
  // const [, dispatch] = useStoreContext();
  // const {categories} = state;

  const {//GET REDUX CATEGORIES
    categories
  } = commerceState;
  const categoriesREDUX = categories;

  //GRAPHQL DATABASE GET CATEGORIES QUERY
  //destructure the categoryData property from the data returned from GRAPHQL
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    // if categoryData exists or has changed from the response
    // of useQuery, then run dispatch()
    if (categoryData) {
      //execute our dispatch function with our action object
      // indicating the type of action and the data to set our state
      // for categories to something new
      // dispatch
      // (
      //   {
      //     type: UPDATE_CATEGORIES,
      //     categories: categoryData.categories
      //   }
      // );
      //REDUX DISPATCHER
      dispatchREDUX(updateCategories(categoryData.categories))

      //also save categories to idb
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {//if server is offline get categories from idb
      idbPromise('categories', 'get')
      .then
      (
        categories => 
        {
          // dispatch
          // (
          //   {
          //     type: UPDATE_CATEGORIES,
          //     categories: categories
          //   }
          // );

          //REDUX UPDATE CATEGORIES DISPATCH
          dispatchREDUX(updateCategories(categories));
        }
      );
    }
  }, [categoryData, loading, dispatchREDUX]);

  const handleClick = _id => {
    // dispatch
    // (
    //   {
    //     type: UPDATE_CURRENT_CATEGORY,
    //     currentCategory: id
    //   }
    // );
    dispatchREDUX(updateCurrentCategory(_id));
  };

  const setCurrentCategoryBlank = () => {
    // dispatch
    // (
    //   {
    //     type: UPDATE_CURRENT_CATEGORY,
    //     currentCategory: ''
    //   }
    // );
    dispatchREDUX(updateCurrentCategory(''));
  }

  return (
    <div>
      <h2>Choose a Category:</h2>
      <button
        onClick={setCurrentCategoryBlank}
      >
        All Categories
      </button>
      {
        categoriesREDUX.map(category => (
          <button
            key={category._id}
            onClick={() => {
              handleClick(category._id)
            }}
          >
            {category.name}
          </button>
        ))
      }
    </div>
  );
}

export default CategoryMenu;