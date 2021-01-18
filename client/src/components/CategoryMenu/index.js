import React, { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";
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


  const {
    categories
  } = commerceState;
  const categoriesREDUX = categories;

  //GRAPHQL DATABASE GET CATEGORIES QUERY
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {

    if (categoryData) {

      //REDUX DISPATCHER
      dispatchREDUX(updateCategories(categoryData.categories))

     
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get')
      .then
      (
        categories => 
        {
          //REDUX UPDATE CATEGORIES DISPATCH
          dispatchREDUX(updateCategories(categories));
        }
      );
    }
  }, [categoryData, loading, dispatchREDUX]);

  const handleClick = _id => {

    dispatchREDUX(updateCurrentCategory(_id));
  };

  const setCurrentCategoryBlank = () => {

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