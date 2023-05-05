import { defineStore } from 'pinia';
// 是 Vue Router 中的一个类型定义，用于描述路由记录的原始格式。
import { RouteRecordRaw } from 'vue-router';
// router 是应用的 Vue Router 实例，它处理应用程序中的路由导航
// asyncRouterList 是一个包含异步路由的列表，这些路由根据用户权限动态加载。这些模块都是从 "@/router" 中导入的，其中 "@/router" 是一个路径别名，通常指向项目的 "src/router" 目录。
import router, { asyncRouterList } from '@/router';
import { store } from '@/store';

// 根据用户角色过滤路由列表。
// routes: 路由列表（类型为 Array<RouteRecordRaw>）
// roles: 用户角色列表（类型为 Array<unknown>）
// 函数返回：一个对象，包含两个属性：
// accessedRouters: 过滤后的路由列表
// removeRoutes: 被移除的路由列表
function filterPermissionsRouters(routes: Array<RouteRecordRaw>, roles: Array<unknown>) {
  //  存储过滤后的路由
  const res = [];
  // 存储被移除的路由
  const removeRoutes = [];
  // 遍历路由列表 遍历传入的路由列表 routes。对于每个路由，创建一个空数组 children 用于存储通过过滤的子路由。
  routes.forEach((route) => {
    const children = [];
    // 问号（?）是一个可选属性标记。在这里，route.children? 表示 children 属性可能不存在于 route 对象中。 变表示这个router没有子路由
    // 当你使用这个语法时，TypeScript 会知道这个属性可能是 undefined，因此在访问它之前，它会自动进行存在性检查。在这个例子中，route.children? 表示如果 route 对象有 children 属性，那么就遍历它；否则，将跳过遍历操作。
    route.children?.forEach((childRouter) => {
      // 如果路由的 meta 属性不存在或者 meta 属性的 roleCode 属性不存在，则将该路由添加到 children 数组中。
      const roleCode = childRouter.meta?.roleCode || childRouter.name;
      // indexOf 是 JavaScript 数组的一个方法，用于搜索数组中是否存在指定的元素。如果找到该元素，indexOf 返回该元素在数组中的第一个索引（位置）。如果未找到该元素，indexOf 返回 -1。
      // 如果路由的 meta 属性存在，并且 meta 属性的 roleCode 属性存在，则将该路由添加到 children 数组中。
      if (roles.indexOf(roleCode) !== -1) {
        children.push(childRouter);
      } else {
        removeRoutes.push(childRouter);
      }
    });
    // 如果 children 数组的长度大于 0，则将路由添加到 res 数组中。
    if (children.length > 0) {
      route.children = children;
      res.push(route);
    }
  });
  return { accessedRouters: res, removeRoutes };
}
// 定义一个名为 permission 的 store 模块。
// 这个 permission 状态管理模块可以在整个应用程序中使用，以便根据用户的权限动态调整路由。您可以通过 usePermissionStore() 在组件或其他地方访问此模块的状态和方法
export const usePermissionStore = defineStore('permission', {
  // 定义一个名为 whiteListRouters 的状态。
  state: () => ({
    // whiteListRouters: ['/login', '/404'], 一个数组，包含白名单路由（不需要权限即可访问的路由）。
    whiteListRouters: ['/login'],
    // routers: [], 一个数组，包含用户有权限访问的路由。
    routers: [],
    // removeRoutes: [], 一个数组，包含用户没有权限访问的路由。
    removeRoutes: [],
  }),
  actions: {
    async initRoutes(roles: Array<unknown>) {
      let accessedRouters = [];

      let removeRoutes = [];
      // special token
      // 如果用户角色列表中包含 all，则表示用户拥有所有权限，因此可以访问所有路由。
      if (roles.includes('all')) {
        accessedRouters = asyncRouterList;
      } else {
        const res = filterPermissionsRouters(asyncRouterList, roles);
        accessedRouters = res.accessedRouters;
        removeRoutes = res.removeRoutes;
      }

      this.routers = accessedRouters;
      this.removeRoutes = removeRoutes;

      removeRoutes.forEach((item: RouteRecordRaw) => {
        if (router.hasRoute(item.name)) {
          router.removeRoute(item.name);
        }
      });
    },
    // 该函数用于将 removeRoutes 中的路由添加到路由表中。方法用于将先前被移除的路由恢复到路由系统中。通常在用户注销或权限发生变化时调用此方法。
    async restore() {
      this.removeRoutes.forEach((item: RouteRecordRaw) => {
        router.addRoute(item);
      });
    },
  },
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
