import buildFormObj from '../lib/formObjectBuilder';
import { User } from '../models';

export default (router) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .post('users', '/users', async (ctx) => {
      const { form } = ctx.request.body;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })
    .get('users', '/users/:id/edit', async (ctx) => {
      const { id } = ctx.params;
      const user = await User.findOne({
        where: {
          id,
        },
      });
      ctx.render('users/edit', { f: buildFormObj(user) });
    })
    .patch('updateUser', '/users/:id', async (ctx) => {
      const { form } = ctx.request.body;
      const { id } = ctx.params;
      try {
        await User.update(form, {
          where: {
            id,
          },
        });
        ctx.flash.set('User has been updated');
        ctx.redirect(router.url('users'));
      } catch (e) {
        const user = {
          id,
          ...form,
        };
        ctx.render('users/edit', { f: buildFormObj(user, e) });
      }
    })
    .delete('deleteUsers', '/users/:id', async (ctx) => {
      const { id } = ctx.params;
      const user = await User.findOne({
        where: {
          id,
        },
      });
      try {
        await user.destroy();
        ctx.flash.set('User has been deleted');
        ctx.redirect(router.url('users'));
      } catch (e) {
        ctx.flash.set('Can\'t delete');
      }
    });
};
