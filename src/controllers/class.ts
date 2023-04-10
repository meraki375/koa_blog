import { Context } from 'koa';
import { getManager, getConnection } from 'typeorm';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { Class } from '../entity/class';
import * as argon2 from 'argon2';  

export default class ClassController {
  public static async listClass(ctx: Context) {
    let pageParam = ctx.query
    const classRepository = getConnection()
    const classes = await getManager().getRepository(Class).find() 
    const classlist = await classRepository
      .getRepository(Class)
      .createQueryBuilder('class')
      .orderBy('id', 'DESC')//倒序 
      .skip(pageParam.pageSize * (pageParam.current - 1))
      .take(pageParam.pageSize)
      .where("class.name LIKE :param")
      .setParameters({
        param: '%'+pageParam.q+'%'
      })
      .getMany();
    ctx.status = 200;
    ctx.body = { 
      code:200,
      message:'查询成功',
      count:classes.length,
      list:classlist
    };
  }

  // public static async showUserDetail(ctx: Context) { 
  //   const userRepository = getManager().getRepository(Class); 
  //   const user = await userRepository.findOneBy({id:ctx.params.id});
  //   if (user) {
  //     ctx.status = 200;
  //     ctx.body = user;
  //   } else {
  //     throw new NotFoundException();
  //   }
  // }
  
  public static async updateClass(ctx: Context) {
    const repository = getManager().getRepository(Class);
    const classId = ctx.request.body.id;
    const findname = await repository.findOneBy({name:ctx.params.name});
    if(findname){
      return ctx.body = {
        code:501,
        message:'分类名重复'
      };
    }
    //新增
    if (!classId) {
      const data = new Class();
      data.name = ctx.request.body.name;
      data.status = ctx.request.body.status
      await repository.save(data);  
      return ctx.body = {
        code:201,
        message:'新增成功'
      };
    } 
    //修改
    await repository.update(+classId, ctx.request.body);
    const updated = await repository.findOneBy({id:classId}); 
    if (updated) { 
      return ctx.body = {
        code:201,
        message:'修改成功'
      };
    }
    return ctx.body = {
      code:501,
      message:'修改失败'
    };
  }

  public static async deleteClass(ctx: Context) { 
    const classId = ctx.request.body.id; 
    const repository = getManager().getRepository(Class); 
    await repository.delete({id:classId}); 
    return ctx.body = {
      code:201,
      message:'删除成功',  
    };
  }
} 