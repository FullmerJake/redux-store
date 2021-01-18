export const updateProducts = (products) => {
  return {
    type: 'UPDATE_PRODUCTS',
    payload: products
  }
}

export const updateCategories = (categories) => {
  return {
    type: 'UPDATE_CATEGORIES',
    payload: categories
  }
}

export const updateCurrentCategory = (name) => {
  return {
    type: 'UPDATE_CURRENT_CATEGORY',
    payload: name
  }
}

export const addToCart = (data) => {
  return {
    type: 'ADD_TO_CART',
    payload: data
  }
}

export const addMultipleToCart = (data) => {
  return {
    type: 'ADD_MULTIPLE_TO_CART',
    payload: data
  }
}

export const removeFromCart = (_id) => {
  return {
    type: 'REMOVE_FROM_CART',
    payload: _id
  }
}

export const updateCartQuantity = (item, quantity) => {
  return {
    type: 'UPDATE_CART_QUANTITY',
    _id: item._id,
    payload: quantity
  }
}

export const toggleCart = (data) => {
  return {
    type: 'TOGGLE_CART',
    payload: data
  }
}