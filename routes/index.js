import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import taskstatuses from './taskstatuses';
import tasks from './tasks';

const controllers = [welcome, users, sessions, taskstatuses, tasks];

export default (router, container) => controllers.forEach(f => f(router, container));
