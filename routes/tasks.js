import buildFormObj from '../lib/formObjectBuilder';
import { requiredAuth } from '../middlewares';
import { Task, User, TaskStatus } from '../models';

export default (router) => {
  router
    .use('/tasks', requiredAuth)
    .get('tasks', '/tasks', async (ctx) => {
      const tasks = await Task.findAll({
        include: [
          { model: User, as: 'Creator' },
          { model: TaskStatus, as: 'Status' },
        ],
      });
      ctx.render('tasks', { tasks });
    })
    .get('newTask', '/tasks/new', async (ctx) => {
      const task = Task.build();
      const statuses = await TaskStatus.findAll();
      ctx.render('tasks/new', { f: buildFormObj(task), statuses });
    })
    .get('showTask', '/tasks/:id', async (ctx) => {
      const { id } = ctx.params;
      const task = await Task.findOne({
        where: {
          id,
        },
        include: [
          { model: User, as: 'Creator' },
          { model: TaskStatus, as: 'Status' },
        ],
      });
      ctx.render('tasks/show', { task });
    })
    .get('editTask', '/tasks/:id/edit', async (ctx) => {
      const { id } = ctx.params;
      const task = await Task.findOne({
        where: {
          id,
        },
        include: [
          { model: TaskStatus, as: 'Status' },
        ],
      });
      const statuses = await TaskStatus.findAll();
      ctx.render('tasks/edit', { f: buildFormObj(task), statuses });
    })
    .post('tasks', '/tasks', async (ctx) => {
      const { userId } = ctx.session;
      const { form } = ctx.request.body;
      const task = Task.build({
        ...form,
        creatorId: userId,
      });
      try {
        await task.save();
        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('tasks/new', { f: buildFormObj(task, e) });
      }
    })
    .patch('updateTask', '/tasks/:id', async (ctx) => {
      const { form } = ctx.request.body;
      const { id } = ctx.params;
      try {
        await Task.update(form, {
          where: {
            id,
          },
        });
        ctx.flash.set('Task has been updated');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        const task = {
          id,
          ...form,
        };
        ctx.render('tasks/edit', { f: buildFormObj(task, e) });
      }
    })
    .delete('deleteTask', '/tasks/:id', async (ctx) => {
      const { id } = ctx.params;
      const task = await Task.findOne({
        where: {
          id,
        },
      });
      try {
        await task.destroy();
        ctx.flash.set('Task has been deleted');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        ctx.flash.set('Can\'t delete');
      }
    });
};
