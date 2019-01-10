import request from 'supertest';
import faker from 'faker';

import app from '..';
import { Task, User, sequelize } from '../models';

const task = {
  name: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  tags: '',
};

const taskUpdate = {
  name: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
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

describe('Task', () => {
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
      .post('/tasks')
      .set('Cookie', cookie)
      .send({ form: task })
      .expect(302);
  });

  it('read one task', async () => {
    await request.agent(server)
      .post('/tasks')
      .set('Cookie', cookie)
      .send({ form: task });
    const { id } = await Task.findOne({ where: { name: task.name } });
    await request.agent(server)
      .get(`/tasks/${id}`)
      .set('Cookie', cookie)
      .expect(200);
  });

  it('update', async () => {
    await request.agent(server)
      .post('/tasks')
      .set('Cookie', cookie)
      .send({ form: task });
    const { id } = await Task.findOne({ where: { name: task.name } });
    await request.agent(server)
      .post(`/tasks/${id}`)
      .send({ form: taskUpdate, _method: 'patch' })
      .expect(302);
  });

  it('delete', async () => {
    await request.agent(server)
      .post('/tasks')
      .set('Cookie', cookie)
      .send({ form: task });
    const { id } = await Task.findOne({ where: { name: task.name } });
    await request.agent(server)
      .post(`/tasks/${id}`)
      .send({ _method: 'delete' })
      .expect(302);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
