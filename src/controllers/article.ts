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
      .leftJoinAndSelect('article.tabObj', 'tab') // 连接 Tab 模型
      .select(['article', 'classes.name', 'tab']) // 选择 Article、Class.name 和 Tab.name 列
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
    const articleRepository = getManager().getRepository(Article);

    const article = await articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.classObj', 'classes')
      .leftJoinAndSelect('article.tabObj', 'tab') 
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
        'article.tabs',
        'tab.name', // 增加tab的name属性
        'classes.name', // 增加class的name属性
      ])
      .where({ id: ctx.query.id })
      .getOne();
    if (article) {
      if(article.tabs){
        article.tabs  = article.tabs.split(',').map(Number) as any;
      }
      ctx.body = { 
        code:200,
        message:'查询成功',
        article
      }
    } else {
      throw new NotFoundException();
    }
  }
  


  public static async updateArticle(ctx: Context)   {
    const articleRepository = getManager().getRepository(Article);
    const articleId = ctx.request.body.id;
    console.log(articleId);
    
    const { classObj, ...updatedData } = ctx.request.body;

    if (!articleId) {
      // 新增文章
      const newArticle = new Article();
      newArticle.title = ctx.request.body.title;
      newArticle.centent = ctx.request.body.centent;
      newArticle.classId = ctx.request.body.classId;
      newArticle.senderName = ctx.request.body.senderName;
      newArticle.status = ctx.request.body.status;
      newArticle.type = ctx.request.body.status;
      newArticle.uid = ctx.request.body.uid;
      newArticle.tabs = ctx.request.body.tabs;
      newArticle.cover_url = ctx.request.body.cover_url;
      newArticle.introduce = ctx.request.body.introduce;

      await articleRepository.save(newArticle);

      // 更新中间表的关联关系
      await updateArticleTabRelation(newArticle.id, newArticle.tabs);

      return (ctx.body = {
        code: 201,
        message: '新增成功',
      });
    }

    // 修改文章

    await articleRepository.update(+articleId, updatedData);
    const updatedArticle = await articleRepository.findOneBy({id:articleId});
    if (updatedArticle) {
      // 更新中间表的关联关系
      await updateArticleTabRelation(updatedArticle.id, updatedArticle.tabs);

      return (ctx.body = {
        code: 201,
        message: '修改成功',
      });
    }

    return (ctx.body = {
      code: 501,
      message: '修改失败',
    });
  }

  public static async delArticle(ctx: Context) { 
    const articleId = ctx.request.body.id; 
    const articleRepository = getManager().getRepository(Article); 
    await articleRepository.delete({id:articleId}); 
    return ctx.body = {
      code:201,
      message:'删除成功',  
    };
  }
} 

async function updateArticleTabRelation(articleId: number, tabIdsString: string) {
  const tabIds = tabIdsString.split(',').map((id) => parseInt(id.trim(), 10));
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 删除旧的中间表数据
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('article_tab_obj_tab')
      .where('articleId = :articleId', { articleId })
      .execute();

    // 插入新的中间表数据
    const values = tabIds.map((tabId) => ({
      articleId,
      tabId,
    }));

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('article_tab_obj_tab')
      .values(values)
      .execute();

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}