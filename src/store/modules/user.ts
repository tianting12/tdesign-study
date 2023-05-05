// 导入 defineStore 方法。defineStore 是 Pinia 提供的方法，用于定义一个新的存储。
import { defineStore } from 'pinia';
// 从 @/config/global 文件中导入 TOKEN_NAME 常量。TOKEN_NAME 可能是一个字符串，表示在存储用户身份验证令牌时使用的键。
import { TOKEN_NAME } from '@/config/global';
// 从 @/store 文件中导入 store 和 usePermissionStore。store 是 Pinia 存储实例，usePermissionStore 是一个导出的函数，用于访问和使用权限相关的存储。
import { store, usePermissionStore } from '@/store';

// 定义一个名为 InitUserInfo 的对象，用于初始化用户信息。在这个例子中，InitUserInfo 包含一个空数组 roles，表示用户的角色。在实际项目中，InitUserInfo 可能还包含其他用户相关的初始数据。
const InitUserInfo = {
  roles: [],
};

// 定义一个名为 "user" 的 Pinia 存储，用于管理用户信息，如登录、获取用户信息、登出等功能。
// defineStore 函数用于创建一个存储，并接收一个配置对象，该对象包含以下属性：
export const useUserStore = defineStore('user', {
  // state（可选）：一个函数，用于初始化存储的状态。返回一个对象，该对象包含存储的初始状态。

  // state：定义存储的状态，包括 token 和 userInfo。token 从本地存储获取（如果存在），否则为默认值 'main_token'。userInfo 使用 InitUserInfo 对象的副本初始化
  state: () => ({
    token: localStorage.getItem(TOKEN_NAME) || 'main_token', // 默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  // getters（可选）：一个包含 getter 函数的对象。getter 函数用于从存储的状态中计算和获取派生值。
  // 定义一个名为 roles 的 getter，用于获取 userInfo 中的角色。
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  // actions（可选）：一个包含 action 函数的对象。action 函数用于执行更改存储状态的操作、处理异步任务等。
  // 定义一个名为 roles 的 getter，用于获取 userInfo 中的角色。
  actions: {
    async login(userInfo: Record<string, unknown>) {
      const mockLogin = async (userInfo: Record<string, unknown>) => {
        // 登录请求流程
        console.log(userInfo);
        // const { account, password } = userInfo;
        // if (account !== 'td') {
        //   return {
        //     code: 401,
        //     message: '账号不存在',
        //   };
        // }
        // if (['main_', 'dev_'].indexOf(password) === -1) {
        //   return {
        //     code: 401,
        //     message: '密码错误',
        //   };
        // }
        // const token = {
        //   main_: 'main_token',
        //   dev_: 'dev_token',
        // }[password];
        return {
          code: 200,
          message: '登陆成功',
          data: 'main_token',
        };
      };

      const res = await mockLogin(userInfo);
      if (res.code === 200) {
        this.token = res.data;
      } else {
        throw res;
      }
    },
    // 模拟从远程服务器获取用户信息。根据当前 token 获取用户信息并更新 state 中的 userInfo。
    async getUserInfo() {
      const mockRemoteUserInfo = async (token: string) => {
        if (token === 'main_token') {
          return {
            name: 'td_main',
            roles: ['all'],
          };
        }
        return {
          name: 'td_dev',
          roles: ['UserIndex', 'DashboardBase', 'login'],
        };
      };

      const res = await mockRemoteUserInfo(this.token);

      this.userInfo = res;
    },
    // 模拟登出。清除本地存储中的 token，更新 state 中的 token 和 userInfo。
    async logout() {
      localStorage.removeItem(TOKEN_NAME);
      this.token = '';
      this.userInfo = { ...InitUserInfo };
    },
    async removeToken() {
      this.token = '';
    },
  },
  // 用于在存储恢复后执行的回调函数。在这个例子中，我们在恢复存储后，使用用户角色初始化路由。
  persist: {
    // 恢复存储后执行的回调函数。在这个例子中，我们在恢复存储后，使用用户角色初始化路由。
    // persist：配置 Pinia 的持久化插件。afterRestore(ctx)：当持久化插件还原存储状态后执行的回调。检查存储中的角色列表是否存在且不为空，如果是，则使用 usePermissionStore() 获取权限存储并初始化权限路由。
    afterRestore: (ctx) => {
      if (ctx.store.roles && ctx.store.roles.length > 0) {
        const permissionStore = usePermissionStore();
        permissionStore.initRoutes(ctx.store.roles);
      }
    },
  },
});

// getUserStore 是一个导出的函数，它的作用是返回一个用户存储实例。当你需要在应用中的其他地方使用这个用户存储时，你可以调用 getUserStore() 函数。
// getUserStore 函数内部调用了 useUserStore，将 store 作为参数传递。useUserStore 函数在之前的代码片段中被定义，它是一个从 defineStore 创建的存储实例。将 store 传递给 useUserStore 是为了确保你得到的是与应用中其他地方相同的用户存储实例。
// 在这个示例中，store 是由 pinia 库创建的一个存储实例

export function getUserStore() {
  return useUserStore(store);
}
