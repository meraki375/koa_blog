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
      .leftJoinAndSelect('article.classObj', 'classes') // 连接 Class 模型
      .select(['article', 'classes.name']) // 选择 Article 和 Class.name 列
      .orderBy('article.id', 'DESC')//倒序 
      .skip(pageParam.pageSize * (pageParam.current - 1))
      .take(pageParam.pageSize)
      .where("article.title LIKE :param")
      .setParameters({
        param: '%'+pageParam.q+'%'
      })
      .getMany();
    ctx.status = 200;
    ctx.body = { 
      code:200,
      message:'查询成功',
      count:articles.length,
      list:articlelist
    };
  }

  public static async showArticleDetail(ctx: Context) { 
    // const articleRepository = getManager().getRepository(Article); 
    // const article = await articleRepository.findOneBy({id:ctx.query.id});
    // 
    const articleRepository = getManager().getRepository(Article);

    const article = await articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.classObj', 'classes')
      .select([
        'article.id',
        'article.uid',
        'article.title',
        'article.introduce',
        'article.centent',
        'article.readCnt',
        'article.cover_url',
        'article.senderName',
        'article.status',
        'article.createAt',
        'article.updatedAt',
        'article.type',
        'article.classId',
        'classes.name', // 增加class的name属性
      ])
      .where({ id: ctx.query.id })
      .getOne();
    if (article) {
      ctx.body = { 
        code:200,
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
    const { classObj, ...updatedData } = ctx.request.body;
    //新增
    if (!articleId) {
      const newArticle = new Article();
      newArticle.title = ctx.request.body.title;
      newArticle.centent = ctx.request.body.centent; 
      newArticle.classId = ctx.request.body.class;
      newArticle.senderName = ctx.request.body.senderName;
      newArticle.status = ctx.request.body.status;
      newArticle.type = ctx.request.body.status;
      newArticle.uid = ctx.request.body.uid;
      newArticle.cover_url = ctx.request.body.cover_url; 
      newArticle.introduce = ctx.request.body.introduce;
      await articleRepository.save(newArticle);  
      return ctx.body = {
        code:201,
        message:'新增成功'
      };
    } 
    //修改
    await articleRepository.update(+articleId, updatedData);
    const updatedArticle = await articleRepository.findOneBy({id:articleId}); 
    if (updatedArticle) { 
      return ctx.body = {
        code:201,
        message:'修改成功', 
        updatedArticle
      };
    }
    return ctx.body = {
      code:501,
      message:'修改失败', 
      updatedArticle
    };
  }

  // public static async deleteArticle(ctx: Context) { 
  //   const articleId = ctx.request.body.id; 
  //   const articleRepository = getManager().getRepository(Article); 
  //   await articleRepository.delete({id:articleId}); 
  //   return ctx.body = {
  //     code:201,
  //     message:'删除成功',  
  //   };
  // }
} 