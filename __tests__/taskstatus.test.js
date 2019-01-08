import request from 'supertest';
import faker from 'faker';

import app from '..';
import { TaskStatus, User, sequelize } from '../models';

const taskStatus = {
  name: faker.name.firstName(),
};

const taskStatusUpdate = {
  name: faker.name.firstName(),
};

const user = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};

const getCookie = async (server) => {
  const res = await request.agent(server)
    .post('/session')
    .type('form')
    .send({ form: user });

  return res.headers['set-cookie'];
};

describe('Task status', () => {
  let server;
  let cookie;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    const dbuser = User.build(user);
    await dbuser.save();
  });

  beforeEach(async () => {
    server = app().listen();
    cookie = await getCookie(server);
  });

  it('create', async () => {
    await request.agent(server)
      .post('/taskstatuses')
      .set('Cookie', cookie)
      .send({ form: taskStatus })
      .expect(302);
  });

  it('update', async () => {
    await request.agent(server)
      .post('/taskstatuses')
      .set('Cookie', cookie)
      .send({ form: taskStatus });
    const { id } = await TaskStatus.findOne({ where: { name: taskStatus.name } });
    await request.agent(server)
      .post(`/taskstatuses/${id}`)
      .send({ form: taskStatusUpdate, _method: 'patch' })
      .expect(302);
  });

  it('delete', async () => {
    await request.agent(server)
      .post('/taskstatuses')
      .set('Cookie', cookie)
      .send({ form: taskStatus });
    const { id } = await TaskStatus.findOne({ where: { name: taskStatus.name } });
    await request.agent(server)
      .post(`/taskstatuses/${id}`)
      .send({ _method: 'delete' })
      .expect(302);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
