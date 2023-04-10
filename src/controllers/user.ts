import { Context } from 'koa';
import { getManager, getConnection } from 'typeorm';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { User } from '../entity/user';
import * as argon2 from 'argon2';  

export default class UserController {
  public static async listUsers(ctx: Context) {
    let pageParam = ctx.query
    const userRepository = getConnection()
    const users = await getManager().getRepository(User).find() 
    const userlist = await userRepository
      .getRepository(User)
      .createQueryBuilder('user')
      .orderBy('id', 'DESC')//倒序 
      .skip(pageParam.pageSize * (pageParam.current - 1))
      .take(pageParam.pageSize)
      .where("user.username LIKE :param")
      .setParameters({
        param: '%'+pageParam.q+'%'
      })
      .getMany();
    ctx.status = 200;
    ctx.body = { 
      code:200,
      message:'登录成功',
      count:users.length,
      list:userlist
    };
  }

  public static async showUserDetail(ctx: Context) { 
    const userRepository = getManager().getRepository(User); 
    const user = await userRepository.findOneBy({id:ctx.params.id});
    if (user) {
      ctx.status = 200;
      ctx.body = user;
    } else {
      throw new NotFoundException();
    }
  }
  
  public static async updateUser(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const userId = ctx.request.body.id;
    //新增
    if (!userId) {
      const newUser = new User();
      newUser.username = ctx.request.body.username;
      newUser.email = ctx.request.body.email;
      newUser.phone = ctx.request.body.phone;
      newUser.avatar = ctx.request.body.avatar;
      newUser.status = ctx.request.body.status;
      newUser.sex = ctx.request.body.sex;
      newUser.password = await argon2.hash(ctx.request.body.password);
      const user = await userRepository.save(newUser);  
      return ctx.body = {
        code:201,
        message:'新增成功', 
        user
      };
    } 
    //修改
    await userRepository.update(+userId, ctx.request.body);
    const updatedUser = await userRepository.findOneBy({id:userId}); 
    if (updatedUser) { 
      return ctx.body = {
        code:201,
        message:'修改成功', 
        updatedUser
      };
    }
    return ctx.body = {
      code:501,
      message:'修改失败', 
      updatedUser
    };
  }

  public static async deleteUser(ctx: Context) { 
    const userId = ctx.request.body.id; 
    const userRepository = getManager().getRepository(User); 
    await userRepository.delete({id:userId}); 
    return ctx.body = {
      code:201,
      message:'删除成功',  
    };
  }
} 