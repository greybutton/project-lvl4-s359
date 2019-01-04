import buildFormObj from '../lib/formObjectBuilder';
import { TaskStatus } from '../models';

export default (router) => {
  router
    .get('taskstatuses', '/taskstatuses', async (ctx) => {
      const taskstatuses = await TaskStatus.findAll();
      ctx.render('taskstatuses', { taskstatuses });
    })
    .get('newTaskstatus', '/taskstatuses/new', (ctx) => {
      const taskstatus = TaskStatus.build();
      ctx.render('taskstatuses/new', { f: buildFormObj(taskstatus) });
    })
    .post('taskstatuses', '/taskstatuses', async (ctx) => {
      const { form } = ctx.request.body;
      const taskstatus = TaskStatus.build(form);
      try {
        await taskstatus.save();
        ctx.flash.set('Task status has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('taskstatuses/new', { f: buildFormObj(taskstatus, e) });
      }
    })
    .get('editTaskstatus', '/taskstatuses/:id/edit', async (ctx) => {
      const { id } = ctx.params;
      const taskstatus = await TaskStatus.findOne({
        where: {
          id,
        },
      });
      ctx.render('taskstatuses/edit', { f: buildFormObj(taskstatus) });
    })
    .patch('updateTaskstatus', '/taskstatuses/:id', async (ctx) => {
      const { form } = ctx.request.body;
      const { id } = ctx.params;
      try {
        await TaskStatus.update(form, {
          where: {
            id,
          },
        });
        ctx.flash.set('Task status has been updated');
        ctx.redirect(router.url('taskstatuses'));
      } catch (e) {
        const taskstatus = {
          id,
          ...form,
        };
        ctx.render('taskstatuses/edit', { f: buildFormObj(taskstatus, e) });
      }
    })
    .delete('deleteTaskstatus', '/taskstatuses/:id', async (ctx) => {
      const { id } = ctx.params;
      const taskstatus = await TaskStatus.findOne({
        where: {
          id,
        },
      });
      try {
        await taskstatus.destroy();
        ctx.flash.set('Task status has been deleted');
        ctx.redirect(router.url('taskstatuses'));
      } catch (e) {
        ctx.flash.set('Can\'t delete');
      }
    });
};
