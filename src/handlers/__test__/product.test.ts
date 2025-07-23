import request from 'supertest';
import server from '../../server';
// import db from '../../config/db';

// beforeAll(async () => {
//   await db.sync();
// });

// afterAll(async () => {
//   await db.close();
// });

describe('POST /api/products', () => {
  it('debe mostrar errores de validación si el cuerpo está vacío', async () => {
    const res = await request(server).post('/api/products').send({});
    expect(res.status).toBe(400);
     expect(res.body).toHaveProperty('errors');
  });

  it('debe fallar si price es 0 o menor', async () => {
    const res = await request(server).post('/api/products').send({
      name: 'Producto invalido',
      price: 0,
    });
    expect(res.status).toBe(400);
  });

  it('debe fallar si price no es numérico', async () => {
    const res = await request(server).post('/api/products').send({
      name: 'Producto invalido',
      price: 'abc',
    });
    expect(res.status).toBe(400);
  });

  it('debe crear correctamente un producto válido', async () => {
    const res = await request(server).post('/api/products').send({
      name: 'Producto válido',
      price: 100,
    });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe('Producto válido');
  });

  it('no debe devolver 404 en casos esperados', async () => {
    const res = await request(server).post('/api/products').send({
      name: 'Producto prueba',
      price: 50,
    });
    expect(res.status).not.toBe(404);
  });
});

describe('GET /api/products', () => {
  it('debe devolver status 200', async () => {
    const res = await request(server).get('/api/products');
    expect(res.status).toBe(200);
  });

  it('debe devolver JSON con propiedad data', async () => {
    const res = await request(server).get('/api/products');
    expect(res.header['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).not.toHaveProperty('errors');
  });
});

describe('GET /api/products/:id', () => {
  it('debe retornar 400 si el ID no es válido', async () => {
    const res = await request(server).get('/api/products/abc');
    expect(res.status).toBe(400);
  });

  it('debe retornar 404 si el producto no existe', async () => {
    const res = await request(server).get('/api/products/9');
    expect(res.status).toBe(404);
  });

  it('debe retornar 200 con el producto si existe', async () => {
    const create = await request(server).post('/api/products').send({
      name: 'Producto test get',
      price: 80,
    });

    const id = create.body.data.id;
    const res = await request(server).get(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('name', 'Producto test get');
  });
});

describe('PUT /api/products/:id', () => {
  it('debe retornar 400 si el cuerpo está vacío', async () => {
    const res = await request(server).put('/api/products/1').send({});
    expect(res.status).toBe(400);
  });

  it('debe retornar 400 si price es inválido', async () => {
    const res = await request(server).put('/api/products/1').send({
      name: 'Test',
      price: -10,
      availability: true,
    });
    expect(res.status).toBe(400);
  });

  it('debe retornar 404 si el producto no existe', async () => {
    const res = await request(server).put('/api/products/9').send({
      name: 'Test',
      price: 100,
      availability: true,
    });
    expect(res.status).toBe(404);
  });

  it('debe actualizar correctamente si el producto existe', async () => {
    const create = await request(server).post('/api/products').send({
      name: 'Producto original',
      price: 30,
    });

    const res = await request(server).put(`/api/products/${create.body.data.id}`).send({
      name: 'Producto actualizado',
      price: 120,
      availability: false,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Producto actualizado');
    expect(res.body.data.availability).toBe(false);
  });
});

describe('PATCH /api/products/:id', () => {
  it('debe retornar 404 si el producto no existe', async () => {
    const res = await request(server).patch('/api/products/9');
    expect(res.status).toBe(404);
  });

  it('debe alternar disponibilidad correctamente', async () => {
    const create = await request(server).post('/api/products').send({
      name: 'Producto patch',
      price: 70,
    });

    const patch = await request(server).patch(`/api/products/${create.body.data.id}`);
    expect(patch.status).toBe(200);
    expect(typeof patch.body.data.availability).toBe('boolean');
  });
});

describe('DELETE /api/products/:id', () => {
  it('debe retornar 400 si el ID no es numérico', async () => {
    const res = await request(server).delete('/api/products/abc');
    expect(res.status).toBe(400);
  });

  it('debe retornar 404 si el producto no existe', async () => {
    const res = await request(server).delete('/api/products/9');
    expect(res.status).toBe(404);
  });

  it('debe eliminar correctamente si existe', async () => {
    const create = await request(server).post('/api/products').send({
      name: 'Producto a eliminar',
      price: 40,
    });

    const res = await request(server).delete(`/api/products/${create.body.data.id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });
});
