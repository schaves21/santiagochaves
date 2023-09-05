import { logger } from '../../utils/logger.js';

let cartId = localStorage.getItem('cart-id');
const API_URL = 'http://localhost:8080/api';

function putIntoCart(_id) {
  cartId = localStorage.getItem('cart-id');
  const url = API_URL + '/carts/' + cartId + '/product/' + _id;

  const data = {};

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      logger.debug(res);
      alert('Product added');
    })
    .catch((err) => {
      logger.error('Error:', err);
      alert(JSON.stringify(err));
    });
}

if (!cartId) {
  alert('no id');
  const url = API_URL + '/carts';

  const data = {};

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      logger.debug('Response:', data);
      const cartId2 = localStorage.setItem('cart-id', data._id);
    })
    .catch((err) => {
      logger.error('Error:', err);
      alert(JSON.stringify(err));
    });
}
