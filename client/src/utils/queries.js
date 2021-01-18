import gql from 'graphql-tag';

export const QUERY_PRODUCTS = gql`
  query getProducts
  (
    $category: ID
  ) 
  {
    products
    (
      category: $category
    ) 
    {
      _id
      name
      description
      price
      quantity
      image
      category {
        _id
      }
    }
  }
`;

export const QUERY_ALL_PRODUCTS = gql`
  {
    products {
      _id
      name
      description
      price
      quantity
      category {
        name
      }
    }
  }
`;

export const QUERY_CATEGORIES = gql`
{
  categories {
    _id
    name
  }
}
`;

export const QUERY_USER = gql`
{
  user {
    firstName
    lastName
    orders {
      _id
      purchaseDate
      products {
        _id
        name
        description
        price
        quantity
        image
      }
    }
  }
}
`;

/**
 * query takes in an array of product ID's 
 * and returns a checkout object with a session ID
 * 
 * this session ID is used for entering stripe's website
 * to pay for the checked out items from the cart
 * 
 * @GraphQL_query query getCheckout
  (
    $products: [ID]!
  )
  {
    checkout
    (
      products: $products
    )
    {
      session
    }
  }
 * 
 * @returns checkout {
 *  
 * session: "cs_test_1PpFgmSsweXTtc5dh6WFkd6kzHDStr5ZsuO0BBLYB3txB8mJEhLfzk0O"
 * 
 * }
 */
export const QUERY_CHECKOUT = gql `
  query getCheckout
  (
    $products: [ID]!
  )
  {
    checkout
    (
      products: $products
    )
    {
      session
    }
  }
`;