import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import { faker } from '@faker-js/faker';

const expect = chai.expect;
const requester = supertest(app);

describe('TEST API', () => {
  describe('ENDPOINT Products', () => {
    it('Should return all products', async () => {
      const response = await requester.get('/api/products');
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.data).to.be.an.instanceof(Array);
    });

    it('Should return one product by Id', async () => {
      let pid = '6508cc7156a024d698a8db17';
      const response = await requester.get(`/api/products/${pid}`);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body).to.be.an.instanceof(Object);
      expect(_body.data).to.have.property('title');
    });

    it('Should create a new product', async () => {
      const productMock = {
        title: 'Rústico Acero Atún',
        description: 'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
        code: '9tatwahh68',
        price: 588,
        stock: 18,
        category: 'linguistics',
        thumbnail: ['https://loremflickr.com/640/480'],
        owner: 'adminCoder@coder.com',
      };
      const response = await requester.post('/api/products').send(productMock);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(201);
      expect(_body.data).to.have.property('_id');
    });

    it('Should update one product', async () => {
      let pid = '6508ea34bd37b99bfd2fb4c0';
      const productUpdated = {
        title: 'Ergonómico Acero Ordenador',
        description: 'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
        code: '0c8srw18wl',
        price: 694,
        stock: 25,
        category: 'marketing',
        thumbnail: ['https://loremflickr.com/640/480'],
      };
      const response = await requester.put(`/api/products/${pid}`).send(productUpdated);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.data).to.have.property('price');
    });

    it('Should delete one product', async () => {
      let pid = '6508f25293a85e6fa2c90de3';

      const response = await requester.delete(`/api/products/${pid}`);
      if (response.error) {
        throw new Error(response.error.message);
      }

      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.data).to.equal(true);
    });
  });

  describe('ENDPOINT Carts', () => {
    it('Should return all carts', async () => {
      const response = await requester.get('/api/carts');
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.data).to.be.an.instanceof(Array);
    });

    it('Should return one cart by Id', async () => {
      let cid = '6508dfcbf0cf4e788ebfb5cb';
      const response = await requester.get(`/api/carts/${cid}`);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body).to.be.an.instanceof(Object);
      expect(_body.data).to.have.property('_id');
    });

    it('Should create a new cart', async () => {
      const response = await requester.post('/api/carts');
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(201);
      expect(_body.data).to.have.property('_id');
    });

    it('Add new product to cart', async () => {
      const response = await requester.post('/api/carts/6508de67f0cf4e788ebfb5a5/products/6508cebd56a024d698a8db24');
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(201);
      expect(_body.data).to.have.property('_id');
    });

    it('Update cart product', async () => {
      let cid = '6508de67f0cf4e788ebfb5a5';
      const updatedCartProduct = {
        productId: '6508cfb456a024d698a8db2a',
      };
      /*
      const updatedCartProduct = {
        products: [
          {
            product: '6508cfb456a024d698a8db2a',
            quantity: 5,
          },
        ],
      };
      */
      const response = await requester.put(`/api/carts/${cid}`).send(updatedCartProduct);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.message).to.have.eql('Cart updated successfully');
    });

    it('Update the quantity of the product in the cart', async () => {
      let cid = '6508de67f0cf4e788ebfb5a5';
      let pid = '6508cfb456a024d698a8db2a';
      const updateProductQuantity = {
        quantity: 10,
      };
      const response = await requester.put(`/api/carts/${cid}/products/${pid}`).send(updateProductQuantity);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.message).to.have.eql('Product quantity updated');
    });

    it('Remove a product from the cart', async () => {
      let cid = '6508de67f0cf4e788ebfb5a5';
      let pid = '6508ea34bd37b99bfd2fb4c0';

      const response = await requester.delete(`/api/carts/${cid}/products/${pid}`);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.message).to.have.eql('Product removed from cart');
    });

    it('Clear the cart', async () => {
      let cid = '6508de8ef0cf4e788ebfb5ad';

      const response = await requester.delete(`/api/carts/${cid}`);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.message).to.have.eql('Cart cleared successfully');
    });

    it('Complete purchase', async () => {
      let cid = '6508e009f0cf4e788ebfb5d2';

      const response = await requester.post(`/api/carts/${cid}/purchase`);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, body } = response;
      expect(status).to.equal(201);
      expect(body.msg).to.have.eql('Thanks for your purchase');
    });
  });

  describe('ENDPOINT Register, Login and Current', () => {
    let cookieName;
    let cookieValue;
    const mockUser = {
      email: faker.internet.email(),
      firstName: 'Test',
      lastName: 'Test',
      age: 39,
      password: '1234',
    };

    it('You must register a user', async () => {
      const response = await requester.post('/api/sessions/register').send(mockUser);

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { status, body } = response;
      expect(status).to.equal(302);
      expect(body).to.be.an('object');
    });

    it('You must log in a user and return a cookie', async () => {
      const result = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      });

      const cookie = result.headers['set-cookie'][0];
      expect(cookie).to.be.ok;

      cookieName = cookie.split('=')[0];
      cookieValue = cookie.split('=')[1];

      expect(cookieName).to.be.ok.and.eql('connect.sid');
      expect(cookieValue).to.be.ok;
    });

    it('Send cookie to see user content', async () => {
      const { body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookieName}=${cookieValue}`]);
      expect(body.data.user.email).to.be.eql(mockUser.email);
    });
  });
});
