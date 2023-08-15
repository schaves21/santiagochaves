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
};
