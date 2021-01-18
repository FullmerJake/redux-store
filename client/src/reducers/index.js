import { combineReducers } from 'redux';
import commerceReducer from './commerceReducer.js';

const allReducers = combineReducers(
  {
    commerce: commerceReducer
  }
);

export default allReducers;