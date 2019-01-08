/* eslint-disable import/prefer-default-export */

export const requiredAuth = async (ctx, next) => {
  if (!ctx.session.userId) {
    ctx.flash.set('You must be logged in!');
    ctx.redirect('/');
    return;
  }

  await next();
};
