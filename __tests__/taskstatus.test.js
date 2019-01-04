import request from 'supertest';
import faker from 'faker';

import app from '..';
import { TaskStatus, sequelize } from '../models';

const taskStatus = {
  name: faker.name.firstName(),
};

const taskStatusUpdate = {
  name: faker.name.firstName(),
};

describe('Task status', () => {
  let server;

  beforeEach(async () => {
    server = app().listen();
    await sequelize.sync({ force: true });
  });

  it('create', async () => {
    await request.agent(server)
      .post('/taskstatuses')
      .send({ form: taskStatus })
      .expect(302);
  });

  it('update', async () => {
    await request.agent(server)
      .post('/taskstatuses')
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
