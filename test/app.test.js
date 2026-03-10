const request = require('supertest');
const app = require('../src/app');

describe('eCommerce API Tests', () => {

  test('GET /health - should return status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  test('GET /products - should return list of products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products.length).toBe(3);
  });

  test('GET /products/1 - should return single product', async () => {
    const res = await request(app).get('/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.product.name).toBe('Laptop');
  });

  test('GET /products/999 - should return 404', async () => {
    const res = await request(app).get('/products/999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /cart - should add item to cart', async () => {
    const res = await request(app)
      .post('/cart')
      .send({ productId: 1, quantity: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

});
