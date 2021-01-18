const commerceReducer = (
  state = {//initial commerceReducer redux state
    products: [],
    cart: [],
    cartOpen: false,
    categories: [],
    currentCategory: '',
}, action) => //ACTION TO DISPATCH BY DISPATCHER FUNCTION
{
  switch(action.type) {//9 actions
    case 'UPDATE_PRODUCTS':
      return {
        ...state,
        products: [...action.payload]
      };
    case 'UPDATE_CATEGORIES':
      return {
        ...state,
        categories: [...action.payload]
      };
    case 'UPDATE_CURRENT_CATEGORY':
      return {
        ...state,
        currentCategory: action.payload
      }
    case 'ADD_TO_CART':
      return {
        ...state,
        cartOpen: true,
        cart: [...state.cart, action.payload]
      }
    case 'ADD_MULTIPLE_TO_CART':
      return {
        ...state,
        cart: [...state.cart, ...action.payload ]
      }
    case 'REMOVE_FROM_CART':
      let newState = state.cart.filter(product => {
        return product._id !== action.payload
      })
      return {
        ...state,
        cart: newState
      }
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cartOpen: true,
        cart: state.cart.map(product => {
          if (action._id === product._id) {
            product.purchaseQuantity = action.payload
          }
          return product;
        })
      }
    case 'CLEAR_CART':
      return {

      }
    case 'TOGGLE_CART':
      return {
        ...state,
        cartOpen: !state.cartOpen
      }
    default:
      return state;
  }
}

export default commerceReducer;
