import Router from '@koa/router';

import AuthController from './controllers/auth';
import UserController from './controllers/user';
import ArticleController from './controllers/article';
import ClassController from './controllers/classes';
import MessageController from './controllers/message';
import NoteController from './controllers/note';
import CosController from './controllers/cos';
import WallpaperController from './controllers/wallpaper';
import TabController from './controllers/tab';
import PrivacyController from './controllers/privacy';
const unprotectedRouter = new Router(); 

// auth 相关的路由
unprotectedRouter.post('/api/auth/login', AuthController.login);
unprotectedRouter.post('/api/auth/register', AuthController.register);

const protectedRouter = new Router();
// users 相关的路由
protectedRouter.get('/api/system/user/list', UserController.listUsers); 
protectedRouter.get('/api/getUser', UserController.getUser);
protectedRouter.post('/api/system/user/edit', UserController.editUser);
protectedRouter.delete('/api/system/user/del', UserController.deleteUser);

//article 相关路由
protectedRouter.get('/api/blog/list', ArticleController.articleList);
protectedRouter.post('/api/blog/edit', ArticleController.updateArticle);
protectedRouter.get('/api/blog/info', ArticleController.showArticleDetail);
protectedRouter.post('/api/blog/del', ArticleController.delArticle);

//class 相关路由
protectedRouter.get('/api/class/list', ClassController.listClass);
protectedRouter.post('/api/class/edit', ClassController.updateClass); 
protectedRouter.delete('/api/class/del', ClassController.deleteClass);

//message 相关路由 
protectedRouter.post('/api/message/edit', MessageController.updateMessage);
protectedRouter.get('/api/message/info', MessageController.showMessageDetail);

//note 相关路由
protectedRouter.get('/api/note/list', NoteController.listNote);
protectedRouter.post('/api/note/edit', NoteController.updateNote); 
protectedRouter.delete('/api/note/del', NoteController.deleteNote);

// cos 相关路由
protectedRouter.get('/api/getCOSToken', CosController.getCOSToken);

//Wallpaper 相关路由
protectedRouter.get('/api/wallpaper/list', WallpaperController.listWallpaper);
protectedRouter.post('/api/wallpaper/edit', WallpaperController.updateWallpaper); 
protectedRouter.delete('/api/wallpaper/del', WallpaperController.deleteWallpaper);

//class 相关路由
protectedRouter.get('/api/tab/list', TabController.listTab);
protectedRouter.post('/api/tab/edit', TabController.updateTab); 
protectedRouter.delete('/api/tab/del', TabController.deleteTab);

//privacy 相关路由 
protectedRouter.post('/api/privacy/edit', PrivacyController.updatePrivacy);
protectedRouter.get('/api/privacy/info', PrivacyController.getPrivacy);
//客户端接口
unprotectedRouter.get('/api/craica/message/info', MessageController.showMessageDetail);
unprotectedRouter.get('/api/craica/wallpaper/list', WallpaperController.listWallpaper);
unprotectedRouter.get('/api/craica/note/list', NoteController.listNote);
unprotectedRouter.get('/api/craica/blog/list', ArticleController.articleList);
unprotectedRouter.get('/api/craica/blog/info', ArticleController.showArticleDetail);
unprotectedRouter.get('/api/craica/class/list', ClassController.listClass);
unprotectedRouter.get('/api/craica/privacy/info', PrivacyController.getPrivacy);
export default {
    unprotectedRouter,
    protectedRouter
};

export { protectedRouter, unprotectedRouter };