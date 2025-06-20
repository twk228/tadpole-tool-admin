import { neon } from '@netlify/neon';
export const SQL = neon('postgresql://kedouzhihuiDB_owner:npg_tHU2FgQCOIA5@ep-shy-sunset-a8hk884g-pooler.eastus2.azure.neon.tech/kedouzhihuiDB?sslmode=require'); // automatically uses env NETLIFY_DATABASE_URL

export async function runAql(sql: string, isTokenValid: boolean = false, token?: string) {
  if(isTokenValid){
    let tokenSql = 'SELECT * FROM token_list';
    if(token){
      tokenSql += ` where token = '${token}'`;
    }
    let tokenRes: any = await SQL(tokenSql);
    if(tokenRes.rowCount > 0){
      return await SQL(sql);
    }else{
      return { code: 401, message: 'token已失效' };
    }
  }else{
    return await SQL(sql);
  }
}
