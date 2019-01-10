import buildFormObj from '../lib/formObjectBuilder';
import { requiredAuth } from '../middlewares';
import {
  Task, User, TaskStatus, Tag,
} from '../models';

const getTagIds = async (tags) => {
  const findOrCreate = async (t) => {
    const res = await Tag.findOrCreate({ where: { name: t } });
    return res;
  };
  const tagsInstances = await Promise.all(tags.map(findOrCreate));
  const tagsIds = tagsInstances.map(([tag]) => tag.id);
  return tagsIds;
};

export default (router) => {
  router
    .use('/tasks', requiredAuth)
    .get('tasks', '/tasks', async (ctx) => {
      const tasks = await Task.findAll({
        include: [
          { model: User, as: 'Creator' },
          { model: User, as: 'Assigned' },
          { model: TaskStatus, as: 'Status' },
        ],
      });
      ctx.render('tasks', { tasks });
    })
    .get('newTask', '/tasks/new', async (ctx) => {
      const task = Task.build();
      const statuses = await TaskStatus.findAll();
      const users = await User.findAll();
      ctx.render('tasks/new', { f: buildFormObj(task), statuses, users });
    })
    .get('showTask', '/tasks/:id', async (ctx) => {
      const { id } = ctx.params;
      const task = await Task.findOne({
        where: {
          id,
        },
        include: [
          { model: User, as: 'Creator' },
          { model: User, as: 'Assigned' },
          { model: TaskStatus, as: 'Status' },
          { model: Tag, as: 'Tags' },
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
          { model: User, as: 'Assigned' },
          { model: TaskStatus, as: 'Status' },
          { model: Tag, as: 'Tags' },
        ],
      });
      const statuses = await TaskStatus.findAll();
      const users = await User.findAll();
      ctx.render('tasks/edit', { f: buildFormObj(task), statuses, users });
    })
    .post('tasks', '/tasks', async (ctx) => {
      const { userId } = ctx.session;
      const { form } = ctx.request.body;
      const tags = form.tags.split(' ').filter(t => t);
      const task = Task.build({
        ...form,
        creatorId: userId,
      });
      try {
        await task.save();
        const tagIds = await getTagIds(tags);
        await task.setTags(tagIds);
        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        const statuses = await TaskStatus.findAll();
        const users = await User.findAll();
        ctx.render('tasks/new', { f: buildFormObj(task, e), statuses, users });
      }
    })
    .patch('updateTask', '/tasks/:id', async (ctx) => {
      const { form } = ctx.request.body;
      const { id } = ctx.params;
      const tags = form.tags.split(' ').filter(t => t);
      const task = await Task.findOne({
        where: {
          id,
        },
      });
      try {
        await task.update(form);
        const tagIds = await getTagIds(tags);
        await task.setTags(tagIds);
        ctx.flash.set('Task has been updated');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        const statuses = await TaskStatus.findAll();
        const users = await User.findAll();
        ctx.render('tasks/edit', { f: buildFormObj(task, e), statuses, users });
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
