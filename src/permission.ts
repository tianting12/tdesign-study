import { MessagePlugin } from 'tdesign-vue-next';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

import { getPermissionStore, getUserStore } from '@/store';
import router from '@/router';

// 使用 NProgress.configure 方法配置 NProgress：在这里，我们设置 showSpinner 为 false，以禁用进度条上的旋转加载器。
NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
  // beforeEach 方法中，我们使用 NProgress.start 方法来启动进度条。
  NProgress.start();
  // 获取用户信息
  const userStore = getUserStore();
  // 获取权限信息
  const permissionStore = getPermissionStore();
  // 获取白名单路由
  const { whiteListRouters } = permissionStore;
  // 获取 token
  const { token } = userStore;
  // 如果 token 存在
  if (token) {
    // 开始时，调用 NProgress.start() 开启进度条。
    if (to.path === '/login') {
      next();
      return;
    }

    const { roles } = userStore;
    // 如果用户信息存在
    if (roles && roles.length > 0) {
      next();
    } else {
      try {
        // 获取用户信息
        await userStore.getUserInfo();
        // 获取用户角色
        const { roles } = userStore;
        // 初始化路由
        await permissionStore.initRoutes(roles);
        // 如果路由存在 如果路由不存在
        if (router.hasRoute(to.name)) {
          next();
        } else {
          next(`/`);
        }
      } catch (error) {
        MessagePlugin.error(error);
        next({
          path: '/login',
          query: { redirect: encodeURIComponent(to.fullPath) },
        });
        NProgress.done();
      }
    }
  } else {
    /* white list router */
    if (whiteListRouters.indexOf(to.path) !== -1) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      });
    }
    NProgress.done();
  }
});

// 这段代码定义了一个 Vue Router 的全局后置守卫 (router.afterEach)，它在导航完成后执行一些逻辑。在这个例子中，主要处理了登录页面跳转后的操作和进度条关闭。以下是代码的逐步解释：
// router.afterEach 函数接收一个参数 to，它表示目标路由。
router.afterEach((to) => {
  if (to.path === '/login') {
    const userStore = getUserStore();
    const permissionStore = getPermissionStore();
    // 退出登录
    userStore.logout();
    // 重置路由
    permissionStore.restore();
  }
  // afterEach 方法中，我们使用 NProgress.done 方法来停止进度条。
  NProgress.done();
});
