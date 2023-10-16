import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';

/* ---------- CORRER LAS PRUEBAS DIRECTAMENTE EN UNA SOLA TERMINAL CON (npm run test) ---------------------- */
/* ---------- SUPERTEST CONECTA A TRAVES DEL ARCHIVO SERVER app.js ----------------------------------------- */
/* ---------- PRIMERO PROBAR LOS ENDPOINT DE PRODUCTOS CON EL LOGIN DE adminCoder@coder.com  --------------- */
/* ---------- SEGUNDO PROBAR LOS ENDPOINT DE CARTS CON EL LOGIN DE tester.user@tester.com ------------------ */
/* ---------- TERCERO PROBAR LOS ENDPOINT DE SESSIONS ------------------------------------------------------ */
/* ---------- REALIZAR LAS PRUEBAS CON NUEVOS DATOS, LOS QUE ESTAN EN EL CODIGO YA FUERON UTILIZADOS ------- */

const expect = chai.expect;
const requester = supertest(app);

describe('TEST API', () => {
  let cookieName;
  let cookieValue;

  describe('LOGIN test with admin role (products), user role (carts)', () => {
    it('LOGIN', async () => {
      /* ----- PARA PROBAR LOS ENDPOINT DE PRODUCTS USAR adminCoder@coder.com ---- */
      const result = await requester.post('/api/sessions/login').send({
        email: 'adminCoder@coder.com',
        password: 'adminCod3r123',
      });

      /* ----- PARA PROBAR LOS ENDPOINT DE CARTS USAR tester.user@tester.com ---- */
      /*
      const result = await requester.post('/api/sessions/login').send({
        email: 'tester.user@tester.com',
        password: '1234',
      });
      */

      const cookie = result.headers['set-cookie'][0];
      expect(cookie).to.be.ok;

      cookieName = cookie.split('=')[0];
      cookieValue = cookie.split('=')[1];

      expect(cookieName).to.be.ok.and.eql('connect.sid');
      expect(cookieValue).to.be.ok;
    });
  });

  describe('ENDPOINT Products', () => {
    it('Should return all products', async function () {
      this.timeout(5000);
      const response = await requester.get('/api/products').set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, body } = response;
      expect(status).to.equal(200);
      expect(body.payload).to.be.an.instanceof(Array);
    });

    it('Should return one product by Id', async function () {
      this.timeout(5000);
      let pid = '652b14a3af02da66cb9e01b5';
      const response = await requester.get(`/api/products/${pid}`).set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, body } = response;
      expect(status).to.equal(200);
      expect(body).to.be.an.instanceof(Object);
      expect(body.payload).to.have.property('title');
    });

    it('Should create a new product', async function () {
      this.timeout(5000);
      const productMock = {
        title: 'Refinado Metal Patatas fritas',
        description: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
        code: 'dur16ii4s8',
        price: 636,
        stock: 63,
        category: 'obsidian',
        thumbnail: ['https://loremflickr.com/cache/resized/65535_52246730837_f157bd5e46_b_640_480_nofilter.jpg'],
      };
      const response = await requester
        .post('/api/products')
        .send(productMock)
        .set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, body } = response;
      expect(status).to.equal(201);
      expect(body.payload).to.have.property('_id');
    });

    it('Should update one product', async function () {
      this.timeout(5000);
      let pid = '652d4efab1dd1e0eb01ceafa';
      const productUpdated = {
        title: 'Sabroso Ladrillo Queso',
        description: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
        code: 'o8vtcmelcx',
        price: 957,
        stock: 95,
        category: 'ferry',
        thumbnail: ['https://loremflickr.com/cache/resized/65535_52485773254_572ae23e7a_b_640_480_nofilter.jpg'],
      };
      const response = await requester
        .put(`/api/products/${pid}`)
        .send(productUpdated)
        .set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, body } = response;
      expect(status).to.equal(200);
      expect(body.payload).to.have.property('price');
    });

    it('Should delete one product', async function () {
      this.timeout(5000);
      let pid = '652d4ff76c676ea08125cb84';

      const response = await requester.delete(`/api/products/${pid}`).set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }

      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.msg).to.have.eql('Product deleted');
    });
  });

  describe('ENDPOINT Carts', () => {
    it('Should return all carts', async function () {
      this.timeout(5000);
      const response = await requester.get('/api/carts').set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.be.an.instanceof(Array);
    });

    it('Should return one cart by Id', async function () {
      this.timeout(5000);
      let cid = '652d27238260c23574e8da95';
      const response = await requester.get(`/api/carts/${cid}`).set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body).to.be.an.instanceof(Object);
      expect(_body.payload).to.have.property('_id');
    });

    it('Should create a new cart', async function () {
      this.timeout(5000);
      const response = await requester.post('/api/carts').set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(201);
      expect(_body.payload).to.have.property('_id');
    });

    it('Add new product to cart', async function () {
      this.timeout(5000);
      const response = await requester.post('/api/carts/652d27238260c23574e8da95/products/652d4efab1dd1e0eb01ceafa').set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(201);
      expect(_body.payload).to.have.property('_id');
    });

    it('Update cart product', async function () {
      this.timeout(5000);
      let cid = '652d27238260c23574e8da95';
      const updatedCartProduct = {
        productId: '652c51736cb45b6a1fe7b2d8',
      };
      const response = await requester
        .put(`/api/carts/${cid}`)
        .send(updatedCartProduct)
        .set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.have.property('_id');
    });

    it('Update the quantity of the product in the cart', async function () {
      this.timeout(5000);
      let cid = '652d27238260c23574e8da95';
      let pid = '652c51736cb45b6a1fe7b2d8';
      const updateProductQuantity = {
        quantity: 8,
      };
      const response = await requester
        .put(`/api/carts/${cid}/products/${pid}`)
        .send(updateProductQuantity)
        .set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.have.property('_id');
    });

    it('Remove a product from the cart', async function () {
      this.timeout(5000);
      let cid = '652d27238260c23574e8da95';
      let pid = '652d5f3255bbf06037dda4e9';

      const response = await requester.delete(`/api/carts/${cid}/products/${pid}`).set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.have.property('_id');
    });

    it('Clear the cart', async function () {
      this.timeout(5000);
      let cid = '652d27238260c23574e8da95';

      const response = await requester.delete(`/api/carts/${cid}`).set('Cookie', [`${cookieName}=${cookieValue}`]);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, body } = response;
      expect(status).to.equal(200);
      expect(body.msg).to.have.eql('Cart cleared successfully');
    });

    it('Complete purchase', async function () {
      this.timeout(5000);
      let cid = '652d27238260c23574e8da95';

      const response = await requester.post(`/api/carts/${cid}/purchase`).set('Cookie', [`${cookieName}=${cookieValue}`]);
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
      email: 'tester2.user@tester.com',
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
