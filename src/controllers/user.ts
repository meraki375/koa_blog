import { Context } from 'koa';
import { getManager, getConnection } from 'typeorm';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { User } from '../entity/user';
import * as argon2 from 'argon2';  

export default class UserController {
  public static async listUsers(ctx: Context) {
    const pageParam = ctx.query;
    const userRepository = getManager().getRepository(User);
    let queryBuilder = userRepository.createQueryBuilder('user')
      .orderBy('user.id', 'DESC') // 倒序
      .skip(pageParam.pageSize * (pageParam.current - 1))
      .take(pageParam.pageSize);
  
    if (pageParam.q) {
      queryBuilder = queryBuilder
        .where('user.username LIKE :param')
        .setParameter('param', `%${pageParam.q}%`);
    }
    const [users, count] = await queryBuilder.getManyAndCount();
  
    ctx.body = { 
      code: 200,
      message: '获取用户列表成功',
      count,
      list: users
    };
  }

  public static async getUser(ctx: Context) { 
    const userRepository = getManager().getRepository(User); 
    const user = await userRepository.findOneBy({id:ctx.params.id});
    if (user) {
      ctx.body = {
        code:200,
        user
      };
    } else {
      throw new NotFoundException();
    }
  }
  
  public static async editUser(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const { id, ...userData } = ctx.request.body;
    // 新增
    if (!id) {
      const user = await userRepository.create({
        ...userData,
        password: await argon2.hash(userData.password),
      });
      await userRepository.save(user);
      return (ctx.body = {
        code: 201,
        message: '新增成功',
        user,
      });
    }
    // 修改
    try {
      const result = await userRepository.update(id, userData);
      if (result.affected === 0) {
        return (ctx.body = {
          code: 501,
          message: '修改失败，用户不存在',
        });
      } 
      return (ctx.body = {
        code: 201,
        message: '修改成功',
      });
    } catch (error) {
      console.log(error);
      
      return (ctx.body = {
        code: 501,
        message: '修改失败',
        error,
      });
    }
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