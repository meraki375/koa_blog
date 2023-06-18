import { Context } from 'koa';
import { getManager, getConnection, getRepository, FindOneOptions } from 'typeorm';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { Article } from '../entity/article';
import { wl_Counter } from '../entity/wl_Counter'; 
import { wl_Comment } from '../entity/wl_Comment';
import { wl_Users } from '../entity/wl_Users'; 
export default class UserController {
  public static async articleList(ctx: Context) {
    const articleRepository = getConnection();
    const commentCount = await articleRepository
      .getRepository(wl_Comment) // 假设你的 Comment 实体类名为 Comment
      .createQueryBuilder('wl_Comment')
      .getCount();
      
    const { current, pageSize, q, status } = ctx.query;
  
   
    const queryBuilder = articleRepository
      .getRepository(Article)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.classObj', 'classes') // 连接 Class 模型
      .leftJoinAndSelect('article.tabObj', 'tab') // 连接 Tab 模型
      .leftJoinAndSelect('article.counter', 'counter') // 连接 wl_Counter 模型
      .select(['article', 'classes.name', 'tab', 'counter'])
      .orderBy('article.id', 'DESC') // 倒序
  
    if (q) {
      queryBuilder.where("article.title LIKE :param").setParameters({
        param: '%' + q + '%'
      });
    }
  
    if (status) {
      queryBuilder.andWhere("article.status = :status").setParameter("status", status);
    }
  
    const count = await queryBuilder.getCount();
    const articlelist = await queryBuilder
      .skip(pageSize * (current - 1))
      .take(pageSize)
      .getMany();
  
    const formattedList = articlelist.map(item => {
      const { classObj, tabObj, counter, content, ...rest } = item;
      return {
        ...rest,
        className: classObj.name,
        tabNames: tabObj.map(tab => tab.name).join(", "),
        readCnt: counter.time,
        likeNum: counter.reaction0 + counter.reaction1 + counter.reaction2 + counter.reaction3 + counter.reaction4 + counter.reaction5 + counter.reaction6 + counter.reaction7 + counter.reaction8
      };
    });
    const distinctNickCount = await getConnection()
    .createQueryBuilder()
    .select('COUNT(DISTINCT nick)', 'nickCount')
    .from(wl_Comment, 'comment')
    .getRawOne();

  const distinctMailCount = await getConnection()
    .createQueryBuilder()
    .select('COUNT(DISTINCT mail)', 'mailCount')
    .from(wl_Comment, 'comment')
    .getRawOne();

  const distinctLinkCount = await getConnection()
    .createQueryBuilder()
    .select('COUNT(DISTINCT link)', 'linkCount')
    .from(wl_Comment, 'comment')
    .getRawOne();
    console.log(parseInt(distinctNickCount.nickCount),parseInt(distinctMailCount.mailCount));
    
    const totalCount = Math.max(parseInt(distinctNickCount.nickCount) , parseInt(distinctMailCount.mailCount) , parseInt(distinctLinkCount.linkCount)) 
  

    ctx.status = 200;
    ctx.body = { 
      code: 200,
      message: '查询成功',
      count: count,
      commentCount: commentCount,
      usersCount: totalCount,
      list: formattedList
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
        'article.content',
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
    const wlCounterRepository = getManager().getRepository(wl_Counter);
    const articleId = ctx.request.body.id;
    const { classObj, ...updatedData } = ctx.request.body;

    if (!articleId) {
      const newCounter = new wl_Counter();
      newCounter.time = 0;
      await wlCounterRepository.save(newCounter);

      // 新增文章
      const newArticle = new Article();
      newArticle.title = ctx.request.body.title;
      newArticle.content = ctx.request.body.content;
      newArticle.classId = ctx.request.body.classId;
      newArticle.senderName = ctx.request.body.senderName;
      newArticle.status = ctx.request.body.status;
      newArticle.type = ctx.request.body.status;
      newArticle.uid = ctx.request.body.uid;
      newArticle.counter = newCounter;
      newArticle.tabs = ctx.request.body.tabs;
      newArticle.cover_url = ctx.request.body.cover_url;
      newArticle.introduce = ctx.request.body.introduce;

      await articleRepository.save(newArticle);
      newCounter.url = `/meraki/blog?id=${newArticle.id}`;
      await wlCounterRepository.save(newCounter);

     
      // 更新中间表的关联关系
      if(newArticle.tabs){
        await updateArticleTabRelation(newArticle.id, newArticle.tabs);
      }
     
      
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

  public static async toggleArticleStatus(ctx: Context) { 
    const articleRepository = getManager().getRepository(Article);
    let articles: Article[];
    let { id, status } = ctx.request.body
    console.log(ctx.request.body,ctx.request.body.id);
    try {
      if (Array.isArray(id)) {
        articles = await articleRepository.findByIds(id);
      } else {
        const options: FindOneOptions<Article> = { where: { id: id } };
        const article = await articleRepository.findOne(options);
        articles = article ? [article] : [];
      }
  
      articles.forEach(article => {
        article.status = status;
      });
  
      await articleRepository.save(articles);

      return ctx.body = {
        code:201,
        message:'文章状态更新成功',  
      };
  
    } catch (error) {
      console.log('文章状态更新失败:', error);
      throw new Error('文章状态更新失败');
    }
  }
  
} 





async function updateArticleTabRelation(articleId: number, tabIdsString: string) {
  const tabIds = tabIdsString.split(',').map((id) => parseInt(id.trim(), 10));
  console.log(tabIds);
  
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