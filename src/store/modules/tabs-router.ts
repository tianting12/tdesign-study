import { defineStore } from 'pinia';
import type { TRouterInfo, TTabRouterType } from '@/types/interface';
import { store } from '@/store';

const homeRoute: Array<TRouterInfo> = [
  {
    path: '/dashboard/base',
    routeIdx: 0,
    title: '仪表盘',
    name: 'DashboardBase',
    isHome: true,
  },
];

const state = {
  tabRouterList: homeRoute,
  isRefreshing: false,
};

// 不需要做多标签tabs页缓存的列表 值为每个页面对应的name 如 DashboardDetail
// const ignoreCacheRoutes = ['DashboardDetail'];
const ignoreCacheRoutes = ['login'];

export const useTabsRouterStore = defineStore('tabsRouter', {
  state: () => state,
  getters: {
    // tabRouters：这个 getter 函数接受一个类型为 TTabRouterType 的 state 参数。它返回 state.tabRouterList，即从 state 中获取 tabRouterList 属性。这允许你在应用程序的其他部分访问标签页路由列表，而不是直接访问 state。
    tabRouters: (state: TTabRouterType) => state.tabRouterList,
    // tabRouters：这个 getter 函数接受一个类型为 TTabRouterType 的 state 参数。它返回 state.tabRouterList，即从 state 中获取 tabRouterList 属性。这允许你在应用程序的其他部分访问标签页路由列表，而不是直接访问 state。
    refreshing: (state: TTabRouterType) => state.isRefreshing,
  },
  // 这些函数主要用于处理标签页路由列表（tabRouterList）的更新。
  actions: {
    // 该函数接收一个类型为数值的参数 routeIdx，表示要切换激活状态的路由索引。它会切换 isRefreshing 的状态并更新 tabRouters 中对应索引的路由的 isAlive 状态。
    // this.isRefreshing = !this.isRefreshing;
    toggleTabRouterAlive(routeIdx: number) {
      this.isRefreshing = !this.isRefreshing;
      this.tabRouters[routeIdx].isAlive = !this.tabRouters[routeIdx].isAlive;
    },
    // 用于添加到标签页路由列表中。首先判断该路由是否需要保持激活状态，然后检查是否已存在相同路径的路由，如果不存在，则将新路由添加到 tabRouterList 中。
    appendTabRouterList(newRoute: TRouterInfo) {
      // 该变量表示路由是否需要保持激活状态。
      // 数组方法 includes() 用于判断一个数组是否包含一个指定的值，如果是返回 true，否则返回 false。
      const needAlive = !ignoreCacheRoutes.includes(newRoute.name as string);
      // 该变量表示是否已存在相同路径的路由。find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
      // find() 遍历 tabRouters 数组，寻找与新路由（newRoute）具有相同路径（path）的路由。如果没有找到相同路径的路由，find() 将返回 undefined。在这种情况下，逻辑非操作符 ! 会将 undefined 转换为 true，满足 if 语句的条件。
      if (!this.tabRouters.find((route: TRouterInfo) => route.path === newRoute.path)) {
        // 是针对 ESLint 规则的一条指令。这条指令表示在下一行代码中，允许对函数参数（在这里是 this.tabRouterList）进行重新赋值。通常情况下，
        // ESLint 会推荐避免对函数参数进行重新赋值，以减少副作用和提高代码的可读性。但在这个例子中，我们需要更新 tabRouterList 的值，因此使用这个指令来禁用这条规则。
        // eslint-disable-next-line no-param-reassign
        // 我们使用数组方法 concat() 将新路由（{ ...newRoute, isAlive: needAlive }）添加到 tabRouterList。{ ...newRoute, isAlive: needAlive }
        // 是一个新的对象，它首先使用扩展运算符 ... 将 newRoute 中的所有属性复制到新对象中，然后添加一个新属性 isAlive，其值为 needAlive。这样，新路由会带有一个 isAlive 属性，表示是否需要保持激活状态。
        this.tabRouterList = this.tabRouterList.concat({ ...newRoute, isAlive: needAlive });
      }
    },
    // 处理关闭当前
    subtractCurrentTabRouter(newRoute: TRouterInfo) {
      // 对象解构语法从 newRoute 对象中提取 routeIdx 属性并将其赋值给一个新的常量 routeIdx。对象解构是一种简洁且易读的语法，允许你从对象中提取一个或多个属性并将它们赋值给对应的变量。
      const { routeIdx } = newRoute;
      // slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括 end）。
      // 原本的是 [0,1,2,3,4,5,6,7,8,9] 去掉5 连接 [0,1,2,3,4] 和 [6,7,8,9]，返回 [0,1,2,3,4,6,7,8,9]
      this.tabRouterList = this.tabRouterList.slice(0, routeIdx).concat(this.tabRouterList.slice(routeIdx + 1));
    },
    // 处理关闭右侧
    subtractTabRouterBehind(newRoute: TRouterInfo) {
      const { routeIdx } = newRoute;
      // 总之，这行代码的作用是从 tabRouterList 中截取从开始位置到指定索引（routeIdx）之后的位置（包括指定索引位置的元素）的数组，并将结果赋值给 this.tabRouterList。这实际上是将数组截断在指定索引之后的位置
      this.tabRouterList = this.tabRouterList.slice(0, routeIdx + 1);
    },
    // 处理关闭左侧
    subtractTabRouterAhead(newRoute: TRouterInfo) {
      const { routeIdx } = newRoute;
      // 总之，这行代码的作用是从 tabRouterList 中截取从开始位置到指定索引（routeIdx）之后的位置（包括指定索引位置的元素）的数组，并将结果赋值给 this.tabRouterList。这实际上是将数组截断在指定索引之后的位置
      this.tabRouterList = homeRoute.concat(this.tabRouterList.slice(routeIdx));
    },
    // 处理关闭其他
    subtractTabRouterOther(newRoute: TRouterInfo) {
      const { routeIdx } = newRoute;
      // 总之，这行代码的作用是根据 routeIdx 的值来更新 tabRouterList。如果 routeIdx 等于 0，那么 tabRouterList 将被设置为 homeRoute；否则，tabRouterList 将被设置为 homeRoute 和索引为 routeIdx 的元素组成的新数组。
      this.tabRouterList = routeIdx === 0 ? homeRoute : homeRoute.concat([this.tabRouterList?.[routeIdx]]);
    },
    // 关闭所有
    removeTabRouterList() {
      this.tabRouterList = [];
    },
    initTabRouterList(newRoutes: TRouterInfo[]) {
      // initTabRouterList 方法的作用是遍历传入的 newRoutes 数组，并将其中的每个路由信息对象添加到 tabRouterList 中。
      newRoutes?.forEach((route: TRouterInfo) => this.appendTabRouterList(route));
    },
  },
  //  persist：设置为 true，表示该存储的状态将被持久化。这意味着当用户刷新页面时，该存储的状态将被保留。
  persist: true,
});

export function getTabsRouterStore() {
  return useTabsRouterStore(store);
}
