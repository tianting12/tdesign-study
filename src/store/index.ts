// Pinia，一个轻量级的 Vue 3 状态管理库，用于创建应用的状态存储
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

// 导入 createPinia 和 createPersistedState 方法。createPinia 用于创建 Pinia 实例，而 createPersistedState 是一个插件，用于将 Pinia 存储的状态持久化到例如本地存储 (localStorage) 中。
const store = createPinia();
// 注册持久化状态插件。这将使 Pinia 存储的状态在页面刷新时保持不变。
store.use(createPersistedState());

export { store };

// 通过 export * from 语句重新导出各个模块，使得这些模块可以直接从这个文件中导入。这些模块包括：notification（通知），permission（权限），user（用户），setting（设置）和 tabs-router（选项卡路由）。
export * from './modules/notification';
export * from './modules/permission';
export * from './modules/user';
export * from './modules/setting';
export * from './modules/tabs-router';

export default store;
