import { Context } from 'koa';
import { getManager, getConnection } from 'typeorm';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { Privacy } from '../entity/privacy';

export default class MessageController { 

  public static async getPrivacy(ctx: Context) { 
    const Repository = getManager().getRepository(Privacy); 
    const privacy = await Repository.findOneBy({id:1});
    if (privacy) {
        return ctx.body = {
            code:200,
            data:privacy
          };
    } else {
      throw new NotFoundException();
    }
  }
  
  public static async updatePrivacy(ctx: Context) {
    const repository = getManager().getRepository(Privacy);
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