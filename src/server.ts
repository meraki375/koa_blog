import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import jwt from 'koa-jwt';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { protectedRouter, unprotectedRouter } from './routes';
import 'reflect-metadata';
import { logger } from './logger';
// import router from './routes';
import { JWT_SECRET } from './constants';
// const isDev = process.env.NODE_ENV === 'development';
createConnection()
  .then(() => {
    // 初始化 Koa 应用实例
    const app = new Koa();

    // 注册中间件
    app.use(logger());
    // 设置跨域
    app.use(cors({
      origin: function (ctx) {
          return '*'
      }
    }))
    // 设置跨域,只允许该域名下的请求访问
    // app.use(cors({
    //   origin: function (ctx) {
    //       return isDev ? '*' : 'http://qutanqianduan.com'
    //   }
    // }))
    app.use(bodyParser());

    //捕获在 Controller 中抛出的错误
    app.use(async (ctx, next) => {
      try { 
        await next();
      } catch (err) {
        // 只返回 JSON 格式的响应
        ctx.status = err.status || 500;
        ctx.body = { message: err.message };
      }
    })
    // 响应用户请求
    // app.use(router.routes()).use(router.allowedMethods());
    // 无需 JWT Token 即可访问
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    // 注册 JWT 中间件
    
    app.use(jwt({ secret: JWT_SECRET }).unless({ path: [/^\/public/, /\/login/] }));

    // 需要 JWT Token 才可访问
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());
  
    // 启动服务监听本地3000端口
  app.listen(3000, () => {
    console.log('应用已经启动, http://localhost:3000');
  })
  })
  .catch((err: string) => console.log('TypeORM connection error:', err)); 
