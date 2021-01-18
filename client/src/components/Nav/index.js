import React from "react";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";

//REDUX IMPORTS
import { useDispatch } from 'react-redux';
//REDUX ACTIONS
import {
  updateCurrentCategory
} from '../../actions';

function Nav() {

  //REDUX DISPATCH FUNCTION
  const dispatchREDUX = useDispatch();

  const setCurrentCategoryBlank = () => {

    //REDUX DISPATCH
    dispatchREDUX(updateCurrentCategory(''));
  }

  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        <ul className="flex-row">
          <li className="mx-1">
            <Link to="/orderHistory">
              Order History
            </Link>
          </li>
          <li className="mx-1">
            <a href="/" onClick={() => Auth.logout()}>
              Logout
            </a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="flex-row">
          <li className="mx-1">
            <Link to="/signup">
              Signup
            </Link>
          </li>
          <li className="mx-1">
            <Link to="/login">
              Login
            </Link>
          </li>
        </ul>
      );
    }
  }

  return (
    <header className="flex-row px-1">
      <h1>
        <Link 
          onClick={setCurrentCategoryBlank}
          to="/"
        >
          <span 
            role="img" 
            aria-label="shopping bag"
          >
            🛍️
          </span>
          -Shop-Shop
        </Link>
      </h1>

      <nav>
        {showNavigation()}
      </nav>
    </header>
  );
}

export default Nav;
