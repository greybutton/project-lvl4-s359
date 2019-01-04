import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import taskstatuses from './taskstatuses';

const controllers = [welcome, users, sessions, taskstatuses];

export default (router, container) => controllers.forEach(f => f(router, container));
