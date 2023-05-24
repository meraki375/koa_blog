import { Context } from 'koa';
import { getManager, getConnection } from 'typeorm';
import { Tab } from '../entity/tab';

export default class TabController {
  public static async listTab(ctx: Context) {
    let pageParam = ctx.query
    const tabRepository = getConnection()
    const tab = await getManager().getRepository(Tab).find() 
    const queryBuilder = await tabRepository
      .getRepository(Tab)
      .createQueryBuilder('tab')
      .orderBy('id', 'DESC')//倒序 
      .skip(pageParam.pageSize * (pageParam.current - 1))
      .take(pageParam.pageSize)
      if (pageParam.q) {
        queryBuilder.where("tab.title LIKE :param").setParameters({
            param: `%${pageParam.q}%`
        });
    }
    const list = await queryBuilder.getMany();
    ctx.status = 200;
    ctx.body = { 
      code:200,
      message:'查询成功',
      count:list.length,
      list:list
    };
  }
  
  public static async updateTab(ctx: Context) {
    const repository = getManager().getRepository(Tab);
    const id = ctx.request.body.id;
    const findname = await repository.findOneBy({name:ctx.request.body.name});
    if(findname){
      return ctx.body = {
        code:501,
        message:'分类名重复'
      };
    }
    //新增
    if (!id) {
      const data = new Tab();
      data.name = ctx.request.body.name;
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

  public static async deleteTab(ctx: Context) { 
    const id = ctx.request.body.id; 
    const repository = getManager().getRepository(Tab); 
    await repository.delete({id:id}); 
    return ctx.body = {
      code:201,
      message:'删除成功',  
    };
  }
} 