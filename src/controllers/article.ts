import { Context } from 'koa';
import { getManager, getConnection } from 'typeorm';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { Article } from '../entity/article';
 
export default class UserController {
  public static async articleList(ctx: Context) {
    let pageParam = ctx.query
    const articleRepository = getConnection()
    const articles = await getManager().getRepository(Article).find() 
    const articlelist = await articleRepository
      .getRepository(Article)
      .createQueryBuilder('article')
      .orderBy('id', 'DESC')//倒序 
      .skip(pageParam.pageSize * (pageParam.current - 1))
      .take(pageParam.pageSize)
      .where("article.title LIKE :param")
      .setParameters({
        param: '%'+pageParam.q+'%'
      })
      .getMany();
    ctx.status = 200;
    ctx.body = { 
      success:200,
      message:'查询成功',
      count:articles.length,
      list:articlelist
    };
  }

  public static async showArticleDetail(ctx: Context) { 
    const articleRepository = getManager().getRepository(Article); 
    const article = await articleRepository.findOneBy({id:ctx.params.id});
    if (article) {
      ctx.body = { 
        success:200,
        message:'查询成功',
        article
      }
    } else {
      throw new NotFoundException();
    }
  }
  
  public static async updateArticle(ctx: Context) {
    const articleRepository = getManager().getRepository(Article);
    const articleId = ctx.request.body.id;
    console.log(articleId);
    
    //新增
    if (!articleId) {
      const newArticle = new Article();
      newArticle.title = ctx.request.body.title;
      newArticle.centent = ctx.request.body.centent; 
      newArticle.class = ctx.request.body.class;
      newArticle.senderName = ctx.request.body.senderName;
      newArticle.status = ctx.request.body.status;
      newArticle.type = ctx.request.body.status;
      newArticle.uid = ctx.request.body.uid; 
      await articleRepository.save(newArticle);  
      return ctx.body = {
        success:201,
        message:'新增成功'
      };
    } 
    //修改
    await articleRepository.update(+articleId, ctx.request.body);
    const updatedArticle = await articleRepository.findOneBy({id:articleId}); 
    if (updatedArticle) { 
      return ctx.body = {
        success:201,
        message:'修改成功', 
        updatedArticle
      };
    }
    return ctx.body = {
      success:501,
      message:'修改失败', 
      updatedArticle
    };
  }

  // public static async deleteArticle(ctx: Context) { 
  //   const articleId = ctx.request.body.id; 
  //   const articleRepository = getManager().getRepository(Article); 
  //   await articleRepository.delete({id:articleId}); 
  //   return ctx.body = {
  //     success:201,
  //     message:'删除成功',  
  //   };
  // }
} 