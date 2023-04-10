import Router from '@koa/router';

import AuthController from './controllers/auth';
import UserController from './controllers/user';
import ArticleController from './controllers/article';
import ClassController from './controllers/class';
import MessageController from './controllers/message';
const unprotectedRouter = new Router(); 

// auth 相关的路由
unprotectedRouter.post('/auth/login', AuthController.login);
unprotectedRouter.post('/auth/register', AuthController.register);

const protectedRouter = new Router();
// users 相关的路由
protectedRouter.get('/system/user/list', UserController.listUsers); 
protectedRouter.get('/users/:id', UserController.showUserDetail);
protectedRouter.post('/system/user/add', UserController.updateUser);
protectedRouter.delete('/system/user/del', UserController.deleteUser);

//article 相关路由
protectedRouter.get('/blog/list', ArticleController.articleList);
protectedRouter.post('/blog/edit', ArticleController.updateArticle);
protectedRouter.get('/blog/info', ArticleController.showArticleDetail);

//class 相关路由
protectedRouter.get('/class/list', ClassController.listClass);
protectedRouter.post('/class/edit', ClassController.updateClass); 
protectedRouter.delete('/class/del', ClassController.deleteClass);

//message 相关路由 
protectedRouter.post('/message/edit', MessageController.updateMessage);
protectedRouter.get('/message/info', MessageController.showMessageDetail);

export default {
    unprotectedRouter,
    protectedRouter
};
export { protectedRouter, unprotectedRouter };