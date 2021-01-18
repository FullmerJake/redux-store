import React from 'react';
import { idbPromise } from '../../utils/helpers.js';

//REDUX IMPORTS
import { useDispatch } from 'react-redux';
//REDUX ACTIONS
import {
  removeFromCart,
  updateCartQuantity
} from '../../actions';


const CartItem = (props) => {
  const {
    item
  } = props;

  //DISPATCH FUNCTION
  const dispatchREDUX = useDispatch();

  const rmvFromCart = item => {

    //REDUX DISPATCH
    dispatchREDUX(removeFromCart(item._id))

    idbPromise('cart', 'delete',
    {
      ...item
    });
  };
  const onChange = (event) => {
    const value = event.target.value;
    if (value === '0') {
      
      //REDUX DISPATCH
      dispatchREDUX(removeFromCart(item._id))
      //idb save
      idbPromise('cart', 'delete', {...item});
    } else {

      //REDUX DISPATCH
      dispatchREDUX(updateCartQuantity(item, Number(value)));
      
      //IDB SAVE
      idbPromise('cart', 'put', 
      {
        ...item,
        purchaseQuantity: Number(value)
      });
    }
  };

  return (
    <div className="flex-row">
      <div>
        <img 
          src={`/images/${item.image}`}
          alt="thing"
        />
      </div>
      <div>
        <div>{item.name}, ${item.price}</div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder='1'
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => rmvFromCart(item)}
            style={{cursor: 'pointer'}}
          >
            🗑
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;