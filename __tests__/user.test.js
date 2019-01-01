import request from 'supertest';
import faker from 'faker';

import app from '..';
import { User, sequelize } from '../models';

const user = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};

const userUpdate = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};

describe('User', () => {
  let server;

  beforeEach(async () => {
    server = app().listen();
    await sequelize.sync({ force: true });
  });

  it('create', async () => {
    await request.agent(server)
      .post('/users')
      .send({ form: user })
      .expect(302);
  });

  it('update', async () => {
    await request.agent(server)
      .post('/users')
      .send({ form: user });
    const { id } = await User.findOne({ where: { email: user.email } });
    await request.agent(server)
      .post(`/users/${id}`)
      .send({ form: userUpdate, _method: 'patch' })
      .expect(302);
  });

  it('delete', async () => {
    await request.agent(server)
      .post('/users')
      .send({ form: user });
    const { id } = await User.findOne({ where: { email: user.email } });
    await request.agent(server)
      .post(`/users/${id}`)
      .send({ _method: 'delete' })
      .expect(302);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
