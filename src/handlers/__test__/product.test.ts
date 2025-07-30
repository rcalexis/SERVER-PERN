import request from 'supertest';
import server from '../../server';
import db from '../../config/db';
import { createProduct, getProductId, getProducts, updateAvailability } from '../product';
import Product from '../../models/Producto.mo';
// import db from '../../config/db';

// beforeAll(async () => {
//   await db.sync();
// });

afterAll(async () => {
  await db.close();
  
});

describe('POST /api/products', () => {
  it('Debe mostrar errores de validacion si el cuerpo esta vacio', async () => {
    const res = await request(server).post('/api/products');
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('Debe validar que price sea mayor a 0', async () => {
    const res = await request(server).post('/api/products').send({
      name: 'Tablett',
      price: 0,
    });
    expect(res.status).toBe(400);
  });

  it('Debe validar que price sea un numero valido', async () => {
    const res = await request(server).post('/api/products').send({
      name: 'tableta',
      price: 'bde',
    });
    expect(res.status).toBe(400);
  });

  it('Debe crear el producto si los datos son validos', async () => {
    const res = await request(server).post('/api/products').send({
      name: 'Balon',
      price: 400,
      availability: true,
    });
    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.name).toBe('Balon');
  }, 10000)

  it('No debe devolver 404 en circunstancias esperadas', async () => {
    const res = await request(server).post('/api/products').send({
      name: 'pantalon',
      price: 100,
      availability: true,
    });
    expect(res.status).not.toBe(404);
  });
});

describe('GET /api/products', () => {
  it('Debe devolver status 200', async () => {
    const res = await request(server).get('/api/products');
    expect(res.status).toBe(200);
  });

  it('Debe devolver datos en formato JSON', async () => {
    const res = await request(server).get('/api/products');
    expect(res.header['content-type']).toMatch(/json/);
  });

  it('La respuesta debe contener una propiedad data', async () => {
    const res = await request(server).get('/api/products');
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('La respuesta no debe tener la propiedad errors', async () => {
    const res = await request(server).get('/api/products');
    expect(res.body.errors).toBeUndefined();
  });
});

describe('GET /api/products/:id', () => {
  it('Debe retornar 400 si el id no es valido', async () => {
    const res = await request(server).get('/api/products/hola');
    expect(res.status).toBe(400);
  });

  it('Debe retornar 404 si el producto no existe', async () => {
    const res = await request(server).get('/api/products/9999');
    expect(res.status).toBe(404);
  });

  it('Debe retornar 200 si el id es valido', async () => {
    const nuevo = await request(server).post('/api/products').send({
      name: 'camiseta',
      price: 100,
      availability: true,
    });
    const id = nuevo.body.data.id;

    const res = await request(server).get(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBe(id);
  });
});

describe('PUT /api/products/:id', () => {
  it('Debe validar que el id en la url sea valido', async () => {
    const res = await request(server).put('/api/products/abc').send({});
    expect(res.status).toBe(400);
  });

  it('Debe retornar 404 si el producto no existe', async () => {
    const res = await request(server).put('/api/products/9999').send({
      name: 'balon oro',
      price: 10,
      availability: true,
    });
    expect(res.status).toBe(404);
  });

  it('Debe validar que el precio sea mayor a 0', async () => {
    const nuevo = await request(server).post('/api/products').send({
      name: 'tablet',
      price: 300,
      availability: true,
    });

    const id = nuevo.body.data.id;

    const res = await request(server).put(`/api/products/${id}`).send({
      name: 'tablet',
      price: 0,
      availability: true,
    });

    expect(res.status).toBe(400);
  });

  it('Debe retornar 200 si el producto se actualiza correctamente', async () => {
    const nuevo = await request(server).post('/api/products').send({
      name: 'jarra',
      price: 159,
      availability: true,
    });

    const id = nuevo.body.data.id;

    const res = await request(server).put(`/api/products/${id}`).send({
      name: 'jarra',
      price: 200,
      availability: false,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('jarra');
    expect(res.body.data.price).toBe(200); 
  });
});

describe('PATCH /api/products/:id', () => {
  it('Debe retornar 404 si el producto no existe', async () => {
    const res = await request(server).patch('/api/products/9999');
    expect(res.status).toBe(404);
  });

  it('Debe retornar 200 si se cambia correctamente la disponibilidad', async () => {
    const nuevo = await request(server).post('/api/products').send({
      name: 'Gorra',
      price: 300,
      availability: true,
    });

    const id = nuevo.body.data.id;

    const res = await request(server).patch(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.availability).toBe(false);
  });

  it('Debe alternar availability correctamente true -> false -> true', async () => {
    const nuevo = await request(server).post('/api/products').send({
      name: 'Zapatos',
      price: 500,
      availability: true,
    });

    const id = nuevo.body.data.id;

    const res1 = await request(server).patch(`/api/products/${id}`);
    const res2 = await request(server).patch(`/api/products/${id}`);

    expect(res1.body.data.availability).toBe(false);
    expect(res2.body.data.availability).toBe(true);
  });
});

describe('DELETE /api/products/:id', () => {
  it('Debe retornar 400 si el id no es valido', async () => {
    const res = await request(server).delete('/api/products/abc');
    expect(res.status).toBe(400);
  });

  it('Debe retornar 404 si el producto no existe', async () => {
    const res = await request(server).delete('/api/products/999999');
    expect(res.status).toBe(404);
  });

  it('Debe eliminar correctamente el producto', async () => {
    const nuevo = await request(server).post('/api/products').send({
      name: 'balon',
      price: 50,
      availability: true,
    });

    const id = nuevo.body.data.id;

    const res = await request(server).delete(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });
});

describe('crear producto', () => {
  it('deberia manejar el error de crear productos', async () => {
    jest.spyOn(Product, 'create').mockRejectedValueOnce(new Error('Hubo un error al crear producto'));

    const consoleSpy = jest.spyOn(console, 'log');

    // mock para req y res
    const req = { body: {} } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;

    await createProduct(req, res);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al crear producto')
    );
  });
});

describe('obtener productos', () => {
  it('deberia manejar el error de obtener productos', async () => {
    jest.spyOn(Product, 'findAll').mockRejectedValueOnce(new Error('Hubo un error al obtener producto'));

    const consoleSpy = jest.spyOn(console, 'log');

    // mock para req y res
    const req = {} as any;
    const res = {
      json: jest.fn()
    } as any;

    await getProducts(req, res);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al obtener producto')
    );
  });
});

describe('obtener producto por id', () => {
  it('deberia manejar el error de obtener producto por id', async () => {
    jest.spyOn(Product, 'findByPk').mockRejectedValueOnce(new Error('Hubo un error al obtener producto por id'));

    const consoleSpy = jest.spyOn(console, 'log');

    // mock para req y res
    const req = { params: { id: '1' } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;

    await getProductId(req, res);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al obtener producto por id')
    );
  });
});

describe('actualizar disponibilidad', () => {
  it('deberia manejar el error de actualizar availability', async () => {
    jest.spyOn(Product, 'findByPk').mockRejectedValueOnce(new Error('Hubo un error al editar el campo availability'));

    const consoleSpy = jest.spyOn(console, 'log');

    // mock para req y res
    const req = { params: { id: '1' } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;

    await updateAvailability(req, res);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al editar el campo availability')
    );
  });
});


// describe('crear producto',()=>{
//   it('should error create product ', async () =>{
//     jest.spyOn(Product,'create')
//     .mockRejectedValueOnce(new Error("Hubo un error al crear producto"))

//     //Guardamos el resultado de la consola
//     const consoleSpy = jest.spyOn(console,'log')
//     await createProduct(Request, Response)

//     expect(consoleSpy).toHaveBeenCalledWith(
//       expect.stringContaining("Hubo un error al crear producto")
//     )

//   })
// });

// describe('error de productros',()=>{
//   it('should error get products ', async () =>{
//     jest.spyOn(Product,'findAll')
//     .mockRejectedValueOnce(new Error("Hubo un error al obtener producto"))

//     //Guardamos el resultado de la consola
//     const consoleSpy = jest.spyOn(console,'log')
//     await getProducts(Request, Response)

//     expect(consoleSpy).toHaveBeenCalledWith(
//       expect.stringContaining("Hubo un error al obtener producto")
//     )
//   })
// });

// describe('error de productros',()=>{
//   it('should error get products with id ', async () =>{
//     jest.spyOn(Product,'findByPk')
//     .mockRejectedValueOnce(new Error("Hubo un error al obtener producto por id"))

//     //Guardamos el resultado de la consola
//     const consoleSpy = jest.spyOn(console,'log')
//     await getProductId(Request, Response)

//     expect(consoleSpy).toHaveBeenCalledWith(
//       expect.stringContaining("Hubo un error al obtener producto por id")
//     )
//   })
// });

// describe('error de productros',()=>{
//   it('should error update availability ', async () =>{
//     jest.spyOn(Product,'findByPk')
//     .mockRejectedValueOnce(new Error("Hubo un error al editar el campo availability"))

//     //Guardamos el resultado de la consola
//     const consoleSpy = jest.spyOn(console,'log')
//     await updateAvailability(Request, Response)

//     expect(consoleSpy).toHaveBeenCalledWith(
//       expect.stringContaining("Hubo un error al editar el campo availability")
//     )
//   })
// });

