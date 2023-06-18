import { Context } from 'koa';
import { getManager, getConnection } from 'typeorm';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { Note } from '../entity/note';
import * as argon2 from 'argon2';  

export default class ClassController {
  public static async listNote(ctx: Context) {
    const { current, pageSize, q, status } = ctx.query;
  
    const classRepository = getConnection();
    const queryBuilder = classRepository
      .getRepository(Note)
      .createQueryBuilder('note')
      .orderBy('id', 'DESC') // 倒序
  
    if (q) {
      queryBuilder.where("note.title LIKE :param").setParameters({
        param: '%' + q + '%'
      });
    }
  
    if (status) {
      queryBuilder.andWhere("note.status = :status").setParameters({
        status: status
      });
    }
  
    const count = await queryBuilder.getCount();
    const notelist = await queryBuilder
      .skip(pageSize * (current - 1))
      .take(pageSize)
      .getMany();
  
    ctx.status = 200;
    ctx.body = { 
      code: 200,
      message: '查询成功',
      count: count,
      list: notelist
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
  
  public static async updateNote(ctx: Context) {
    const repository = getManager().getRepository(Note);
    const id = ctx.request.body.id;
     
    if (!id) {
      const data = new Note();
      data.title = ctx.request.body.title;
      data.content = ctx.request.body.content;
      data.url = ctx.request.body.url;
      data.cover_url = ctx.request.body.cover_url
      data.status = ctx.request.body.status
      await repository.save(data);  
      return ctx.body = {
        code:201,
        message:'新增成功'
      };
    } 
    //修改
    await repository.update(+id, ctx.request.body);
    const updated = await repository.findOneBy({id:id}); 
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

  public static async deleteNote(ctx: Context) { 
    const id = ctx.request.body.id; 
    const repository = getManager().getRepository(Note); 
    await repository.delete({id:id}); 
    return ctx.body = {
      code:201,
      message:'删除成功',  
    };
  }
} 