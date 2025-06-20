import { getUUID } from '@/utils';
import { Alova } from '@/utils/http/alova/index';
import { runAql } from '@/utils/sql';

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return Alova.Get<InResult>('/admin_info', {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 用户登录
 */
export async function login(params: { username: string; password: string; }) {
  let userList = await runAql(`SELECT * FROM user_list WHERE "userName" = '${params.username}' AND "password" = '${params.password}'`);
  console.log(userList, 'userList');
  if (!(userList as any[]).length) {
    return { code: 500, message: '用户名或密码错误' };
  }else{
    let token = getUUID();
    let tokenList = await runAql(`SELECT * FROM token_list WHERE "userId" = '${userList[0].id}'`);
    if (!(tokenList as any[]).length) {
      // 插入token
      await runAql(`INSERT INTO token_list ("token", "userId") VALUES ('${token}', '${userList[0].id}')`);
    }else{
      // 更新token
      await runAql(`UPDATE token_list SET "token" = '${token}' WHERE "userId" = '${userList[0].id}'`);
    }
    return { code: 200, message: '登录成功',  result: { token: token, ...userList[0] } };
  }
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return Alova.Post(`/user/u${uid}/changepw`, { params });
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return Alova.Post('/login/logout', {
    params,
  });
}
