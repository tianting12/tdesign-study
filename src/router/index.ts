// 从 vue-router 包中导入所需的函数和类型，
import {useRoute, createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
// 导入 lodash/uniq 函数，用于数组去重。
import uniq from 'lodash/uniq';

// 自动导入modules文件夹下所有ts文件
// 使用 import.meta.globEager 函数自动导入 ./modules 目录下的所有 .ts 文件：
//
// import.meta.globEager 是一个 Vite 提供的特性，用于在构建时自动导入匹配指定模式的所有模块。
// modules 变量存储了一个包含所有导入模块的对象。对象的 key 是模块的路径，value 是模块的 default 导出。
const modules = import.meta.globEager('./modules/**/*.ts');

// 定义一个 routeModuleList 数组，用于存储路由配置对象。
const routeModuleList: Array<RouteRecordRaw> = [];

// 遍历 modules 对象的键（模块路径）：
//
// 获取当前模块的默认导出，存储在 mod 变量中。
// 如果 mod 是一个数组，那么将其复制到 modList，否则将其放入一个新的数组中。
// 使用扩展运算符（...）将 modList 中的所有路由配置对象添加到 routeModuleList 数组中。
Object.keys(modules).forEach((key) => {
  // 从当前模块（modules[key]）获取默认导出，并将其存储在 mod 变量中。
  // 如果当前模块没有默认导出（即 modules[key].default 为 undefined 或 null），则将 mod 设置为空对象（{}）。
  // || 是逻辑或操作符，当左侧的值为假值（如 undefined、null、false、0、NaN 或空字符串）时，将返回右侧的值。在本例中，当模块没有默认导出时，将 mod 设置为空对象。
  const mod = modules[key].default || {};
  // 使用三元条件运算符检查 mod 是否为数组。如果 mod 是数组，则创建一个新数组 modList 并将 mod 中的所有元素复制到新数组中（使用扩展运算符 ...）。否则，将 mod 放入一个新数组中。
  // 这一步确保 modList 总是一个数组，即使原始模块导出的 mod 不是数组。
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  // 将 modList 数组中的所有元素添加到 routeModuleList 数组中。
  // 使用扩展运算符（...）可以将一个数组的所有元素逐个添加到另一个数组中。
  routeModuleList.push(...modList);
});

// 关于单层路由，meta 中设置 { single: true } 即可为单层路由，{ hidden: true } 即可在侧边栏隐藏该路由

// 存放动态路由
export const asyncRouterList: Array<RouteRecordRaw> = [...routeModuleList];

// 存放固定的路由
const defaultRouterList: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '/',
    redirect: '/dashboard/base',
  },
  {
    path: '/:w+',
    name: '404Page',
    redirect: '/result/404',
  },
];

export const allRoutes = [...defaultRouterList, ...asyncRouterList];

// 这段代码定义了一个名为 getRoutesExpanded 的函数，用于从 allRoutes（未在代码中给出）中提取具有 meta.expanded 属性的路由，并返回一个包含这些路由路径的数组。
export const getRoutesExpanded = () => {
  const expandedRoutes = [];

  allRoutes.forEach((item) => {
    if (item.meta && item.meta.expanded) {
      expandedRoutes.push(item.path);
    }
    if (item.children && item.children.length > 0) {
      item.children
        .filter((child) => child.meta && child.meta.expanded)
        .forEach((child: RouteRecordRaw) => {
          expandedRoutes.push(item.path);
          expandedRoutes.push(`${item.path}/${child.path}`);
        });
    }
  });
  return uniq(expandedRoutes);
};

// 这段代码定义了一个名为 getActive 的函数，该函数接受一个可选参数 maxLevel（默认值为 3），并返回一个字符串。该函数的目的是根据当前路由的路径和最大层级（maxLevel 参数）生成一个新的路径。以下是逐步解释：
export const getActive = (maxLevel = 3): string => {
  // 使用 useRoute 函数获取当前路由对象。
  const route = useRoute();
  // 如果当前路由没有 path 属性，则返回空字符串。
  if (!route.path) {
    return '';
  }
  // 使用 route.path.split('/') 将当前路由的路径拆分为一个字符串数组。
  // 使用数组的 filter 方法过滤数组中的元素。在本例中，我们使用 filter 方法过滤数组中的元素，只保留数组中索引小于等于 maxLevel 的元素。

  return route.path
    .split('/')
    .filter((_item: string, index: number) => index <= maxLevel && index > 0)
    .map((item: string) => `/${item}`)
    .join('');
};

// 创建路由实例
const router = createRouter({
  // 使用 createWebHashHistory 函数创建路由历史记录对象。这意味着 Vue Router 将使用哈希模式（URL 中的 # 符号）进行导航。这种模式兼容所有浏览器，不需要服务器端配置。
  history: createWebHashHistory(),
  // 使用 allRoutes 数组作为路由配置。
  routes: allRoutes,
  // 使用 scrollBehavior 函数定义路由切换时的滚动行为。
  scrollBehavior() {
    // 该函数返回一个对象，该对象包含了路由切换时的滚动行为。
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});

// 在 JavaScript 和 TypeScript 中，export default 是一种模块导出语法，表示将一个值（可以是变量、函数、对象、类等）作为模块的默认导出。这意味着，当其他模块通过 import 语句导入这个模块时，如果没有指定具体的导出名称，就会获取到这个默认导出的值。
export default router;
