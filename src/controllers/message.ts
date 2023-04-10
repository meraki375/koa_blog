import { Context } from 'koa';
import { getManager, getConnection } from 'typeorm';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { Message } from '../entity/message';

export default class MessageController { 

  public static async showMessageDetail(ctx: Context) { 
    const Repository = getManager().getRepository(Message); 
    const message = await Repository.findOneBy({id:1});
    if (message) {
        return ctx.body = {
            code:200,
            data:message
          };
    } else {
      throw new NotFoundException();
    }
  }
  
  public static async updateMessage(ctx: Context) {
    const repository = getManager().getRepository(Message);
    await repository.update(+1, ctx.request.body);
    const updated = await repository.findOneBy({id:1}); 
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
} 