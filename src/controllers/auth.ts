import { Context } from 'koa';
import * as argon2 from 'argon2';
import { getManager } from 'typeorm';
import jwt from 'jsonwebtoken';
import { User } from '../entity/user';
import { JWT_SECRET } from '../constants';
import { UnauthorizedException } from '../exceptions';
export default class AuthController {
  // ...
  public static async login(ctx: Context) {
    const userRepository = getManager().getRepository(User); 
    const user = await userRepository
      .createQueryBuilder()
      .where({ username: ctx.request.body.username })
      .addSelect('User.password')
      .getOne(); 
      if (!user) {
        throw new UnauthorizedException('用户名不存在');
      } else if (await argon2.verify(user.password, ctx.request.body.password)) {
        ctx.status = 200;
        ctx.body = {
          success:200,
          message:'登录成功',
          token: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15d' }),
          user
        };
      } else {
        throw new UnauthorizedException('密码错误');
      } 
  }

  public static async register(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const newUser = new User();
    newUser.username = ctx.request.body.username;
    newUser.email = ctx.request.body.email;
    newUser.phone = ctx.request.body.phone;
    newUser.avatar = ctx.request.body.avatar;
    newUser.password = await argon2.hash(ctx.request.body.password);

    // 保存到数据库
    const user = await userRepository.save(newUser); 
    ctx.status = 201;
    ctx.body = {
      success:200,
      message:'注册成功',
      token: jwt.sign({ id: user.id }, JWT_SECRET),
      user
    };
  }
} 