export const EErrors = {
  ROUTING_ERROR: {
    code: 404,
    name: 'Route error',
    cause: 'Could not find route',
    message: 'Please, enter the correct address',
  },
  INVALID_INPUT_ERROR: {
    code: 400,
    name: 'Input type error',
    cause: 'One or more properties were incomplete or not valid',
    message: 'Please, enter the fields correctly',
  },
  USER_NOT_FOUND: {
    code: 400,
    name: 'User error',
    cause: 'User not found',
    message: 'Please check the user code',
  },
  INVALID_EMAIL_PASSWORD: {
    code: 401,
    name: 'User login error',
    cause: 'User not found',
    message: 'Enter the correct credentials',
  },
  USER_EXIST: {
    code: 409,
    name: 'User register error',
    cause: 'User already exists',
    message: 'Register another user',
  },
  PRODUCT_NOT_FOUND: {
    code: 400,
    name: 'Product error',
    cause: 'Product not found',
    message: 'Please check the product code',
  },
  PRODUCT_OWNER: {
    code: 403,
    name: 'Product error',
    cause: 'Product owner',
    message: 'You can`t add products to your cart that you own',
  },
  PRODUCT_OWNER_DELETE: {
    code: 403,
    name: 'Product error',
    cause: 'Product not owner',
    message: 'The product you want to remove does not belong to you',
  },
  CART_NOT_FOUND: {
    code: 400,
    name: 'Cart error',
    cause: 'Cart not found',
    message: 'Please check the cart code',
  },
  TICKET_NOT_FOUND: {
    code: 400,
    name: 'Ticket error',
    cause: 'Ticket not found',
    message: 'Please check the ticket code',
  },
  TOKEN_NOT_FOUND: {
    code: 400,
    name: 'Token error',
    cause: 'Token not found',
    message: 'Please check the token code',
  },
};
