import request from 'supertest';
import server from '../../server';
import db from '../../config/db';
import User from '../../models/Usuario.mo';
import colors from 'colors';
import {
  createUser,
  getUsers,
  getUserId,
  updateUser,
  deleteUser,
} from '../user';

jest.setTimeout(20000);

afterAll(async () => {
  await db.close();
});

//vacia la bace de datos antes de cada prueba para evitar errores con los ids o datos anteriores de las pruebas
beforeEach(async () => {
  await User.destroy({ where: {}, truncate: true });
});

describe('POST /api/users', () => {
  it('debe de mostrar error si los datos estan incompletos', async () => {
    const res = await request(server).post('/api/users');
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('debe crear el usuario si los datos son correctos', async () => {
    const res = await request(server).post('/api/users').send({
      username: 'alexis',
      email: 'alexis@example.com',
      password: '12345',
      role: 'user',
    });
    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.username).toBe('alexis');
  });

  it('debe de evitar correos duplicados', async () => {
    await request(server).post('/api/users').send({
      username: 'liz',
      email: 'liz@example.com',
      password: '1234567',
      role: 'user',
    });

    const res = await request(server).post('/api/users').send({
      username: 'ang',
      email: 'liz@example.com',
      password: '12345',
      role: 'user',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('email ya existe');
  });
  it('debe evitar usernames duplicados', async () => {
  await request(server).post('/api/users').send({
    username: 'alexis',
    email: 'anonimo@example.com',
    password: '12345',
    role: 'user',
  });

  const res = await request(server).post('/api/users').send({
    username: 'alexis',
    email: 'adair@example.com',
    password: '12345',
    role: 'user',
  });

  expect(res.status).toBe(400);
  expect(res.body.error).toBe('username ya existe');
});

});

describe('GET /api/users', () => {
  it('debe retornar una lista de usuarios', async () => {
    const res = await request(server).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /api/users/:id', () => {
  it('debe retornar 400 si el id no es numerico', async () => {
    const res = await request(server).get('/api/users/abc');
    expect(res.status).toBe(400);
  });

  it('debe retornar 404 si el usuario no existe', async () => {
    const res = await request(server).get('/api/users/999999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/users/:id', () => {
  it('debe retornar 400 si el id no es numerico', async () => {
    const res = await request(server).put('/api/users/abc').send({});
    expect(res.status).toBe(400);
  });

  it('debe retornar 404 si el usuario no existe', async () => {
    const res = await request(server).put('/api/users/9999').send({
      username: 'profe',
      email: 'profe@example.com',
    });
    expect(res.status).toBe(404);
  });

  it('debe retornar error si se intenta cambiar password', async () => {
    const nuevo = await request(server).post('/api/users').send({
      username: 'jorge',
      email: 'jorge@example.com',
      password: 'password123',
      role: 'user',
    });

    const id = nuevo.body.data.id;

    const res = await request(server).put(`/api/users/${id}`).send({
      password: 'nuevaclave',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('No se puede actualizar la contraseña');
  });

  it('Debe retornar error si se intenta cambiar id', async () => {
    const nuevo = await request(server).post('/api/users').send({
      username: 'ang',
      email: 'ang@example.com',
      password: '123456',
      role: 'user',
    });

    const id = nuevo.body.data.id;

    const res = await request(server).put(`/api/users/${id}`).send({
      id: 12345,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('No se puede actualizar el ID');
  });

  it('Debe actualizar correctamente los datos validos', async () => {
    const nuevo = await request(server).post('/api/users').send({
      username: 'alexis',
      email: 'alexis@example.com',
      password: '123456',
      role: 'user',
    });

    const id = nuevo.body.data.id;

    const res = await request(server).put(`/api/users/${id}`).send({
      username: 'alexis',
      email: 'adair@example.com',
      role: 'admin',
      isActive: false,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe('alexis');
    expect(res.body.data.role).toBe('admin');
    expect(res.body.data.isActive).toBe(false);
  });
});
describe('DELETE /api/users/:id', () => {
  it('debe retornar 400 si el id no es numerico', async () => {
    const res = await request(server).delete('/api/users/abc');
    expect(res.status).toBe(400);
  });

  it('debe retornar 404 si el usuario no existe', async () => {
    const res = await request(server).delete('/api/users/9999');
    expect(res.status).toBe(404);
  });

  it('debe cambiar el campo isactive si se quiere eliminar al usuario ', async () => {
  const nuevo = await request(server).post('/api/users').send({
    username: 'alexis',
    email: 'alexis@example.com',
    password: '123456',
    role: 'user',
  });

  const id = nuevo.body.data.id;

  const res = await request(server).delete(`/api/users/${id}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('message', 'Usuario eliminado');


  const user = await User.findByPk(id);
  expect(user?.isActive).toBe(false);
});

});

// tests de manejo de errores con mocks
describe('crear usuario', () => {
  it('deberra manejar el error de crear usuario', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Hubo un error al crear usuario'));

    const consoleSpy = jest.spyOn(console, 'log');

    const req = { body: {} } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await createUser(req, res);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al crear usuario')
    );

    jest.restoreAllMocks();
  });
});

describe('obtener usuarios', () => {
  it('deberia manejar el error de obtener usuarios', async () => {
    jest.spyOn(User, 'findAll').mockRejectedValueOnce(new Error('Hubo un error al obtener usuarios'));

    const consoleSpy = jest.spyOn(console, 'log');

    const req = { query: {} } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await getUsers(req, res);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al obtener usuarios')
    );

    jest.restoreAllMocks();
  });
});

describe('obtener usuario por id', () => {
  it('deberia manejar el error de obtener usuario por id', async () => {
    jest.spyOn(User, 'findByPk').mockRejectedValueOnce(new Error('Hubo un error al obtener usuario por id'));

    const consoleSpy = jest.spyOn(console, 'log');

    const req = { params: { id: '1' } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await getUserId(req, res);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al obtener usuario por id')
    );

    jest.restoreAllMocks();
  });
});

describe('actualizar usuario', () => {
  it('deberia manejar el error de actualizar usuario', async () => {
    jest.spyOn(User, 'findByPk').mockRejectedValueOnce(new Error('Hubo un error al actualizar usuario'));

    const consoleSpy = jest.spyOn(console, 'log');

    const req = {
      params: { id: '1' },
      body: {},
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await updateUser(req, res);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al actualizar usuario')
    );

    jest.restoreAllMocks();
  });
});

describe('eliminar usuario', () => {
  it('deberia manejar el error de eliminar usuario', async () => {
    jest.spyOn(User, 'findByPk').mockRejectedValueOnce(new Error('Hubo un error al eliminar usuario'));

    const consoleSpy = jest.spyOn(console, 'log');

    const req = { params: { id: '1' } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await deleteUser(req, res);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al eliminar usuario')
    );

    jest.restoreAllMocks();
  });
});
