import { Context } from 'koa'; 

export default class ClassController {
  public static async getCOSToken(ctx: Context) {
    ctx.status = 200;
    ctx.body = { 
        code:200, 
        AccessKeyId: 'AKIDCPfqxzwnYDmEct9IMLEzmU5gDqNn8NWY',
        AccessKeySecret: '155MWbbUJ3hFmFfnstmZQCsSwLcoJk5J',
        Bucket: 'meraki-1313127528', // 存储桶
        Region: 'ap-guangzhou', // 地域
    };
  }

  
 
} 