import { Context } from 'koa';
import { getManager, getConnection } from 'typeorm';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { Wallpaper } from '../entity/wallpaper';
import * as argon2 from 'argon2';  

export default class ClassController {
    public static async listWallpaper(ctx: Context) {
        let pageParam = ctx.query
        const classRepository = getConnection()
        const queryBuilder = classRepository
          .getRepository(Wallpaper)
          .createQueryBuilder('wallpaper')
          .orderBy('id', 'DESC')//倒序 
          .skip(pageParam.pageSize * (pageParam.current - 1))
          .take(pageParam.pageSize);
      
        if (pageParam.q) {
            queryBuilder.where("wallpaper.title LIKE :param").setParameters({
                param: `%${pageParam.q}%`
            });
        }
        if (pageParam.type) {
            queryBuilder.where("wallpaper.type LIKE :type").setParameters({
                type: `%${pageParam.type}%`
            });
          }
      
        const wallpaperlist = await queryBuilder.getMany();
      
        ctx.status = 200;
        ctx.body = { 
          code: 200,
          message: '查询成功',
          count: wallpaperlist.length,
          list: wallpaperlist
        };
    }
      
  public static async updateWallpaper(ctx: Context) {
    const repository = getManager().getRepository(Wallpaper);
    const id = ctx.request.body.id;
     
    if (!id) {
      const data = new Wallpaper();
      data.image_url = ctx.request.body.image_url
      data.type = ctx.request.body.type
      await repository.save(data);  
      return ctx.body = {
        code:201,
        message:'新增成功'
      };
    } 
  }

  public static async deleteWallpaper(ctx: Context) { 
    const id = ctx.request.body.id; 
    const repository = getManager().getRepository(Wallpaper); 
    await repository.delete({id:id}); 
    return ctx.body = {
      code:201,
      message:'删除成功',  
    };
  }
} 