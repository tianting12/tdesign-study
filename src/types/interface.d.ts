import { RouteRecordName, LocationQueryRaw } from 'vue-router';
import STYLE_CONFIG from '@/config/style';

// ?表示改参数可选
export interface MenuRoute {
  // 该菜单路由对应的路由路径。
  path: string;
  // 该菜单路由对应的路由路径。
  title?: string;
  // 该菜单路由对应的路由路径。
  name?: string;
  // 该菜单路由的图标，可以是一个字符串表示图标的名称，或者是一个对象，包含一个render方法，用于渲染图标。
  // | 表示或 ？表示可选 这种语法是 TypeScript 中的联合类型（Union Types），用于表示一个属性可以是多种不同的类型之一。
  icon?:
    | string
    | {
        render: () => void;
      };
  // 该菜单路由的重定向路径。
  redirect?: string;
  // 该菜单路由的子路由列表。
  children: MenuRoute[];
  // 该菜单路由的子路由列表。
  meta: any;
}

// 是一个字符串字面量类型，只能为 'dark' 或 'light' 两种取值。
export type ModeType = 'dark' | 'light';

// 是一个类型别名，指代 STYLE_CONFIG 对象的类型。
export type SettingType = typeof STYLE_CONFIG;

// 在这段 TypeScript 代码中，我们定义了一个名为 ClassName 的类型。该类型可以被赋予以下三种形式之一：
// 一个对象（Object），其键（key）为字符串类型，值（value）为任意类型。这种形式允许创建一个类名与其对应属性值的映射，例如：{ "active": true, "disabled": false }。
// 一个包含 ClassName 类型元素的数组。这种形式允许创建一个嵌套的类名列表，例如：[{ "active": true }, "inactive", ["secondary", { "highlighted": false }]]。
// 一个字符串类型，表示一个单独的类名，例如："primary"。
// 这个 ClassName 类型可以用于定义接受多种类型的类名参数的函数或组件。例如，在 React 库中，你可能需要接受不同类型的类名，以便在渲染时将它们合并成一个字符串。这个自定义类型可以帮助你更灵活地处理这些不同类型的输入。
export type ClassName = { [className: string]: any } | ClassName[] | string;

// 是一个联合类型，可以是一个字符串字典对象，或者是字符串数组，或者是一个字符串。一般用于定义组件的 style 属性。
export type CommonObjType = {
  [key: string]: string | number;
};

export interface NotificationItem {
  // 通知的唯一标识符。
  id: string;
  // 通知的标题。
  content: string;
  // 通知的类型。
  type: string;
  // 一个布尔类型，表示通知的状态（例如，已读或未读）。
  status: boolean;
  // 一个布尔类型，表示通知是否已被收藏。
  collected: boolean;
  //  一个字符串类型，表示通知的日期。
  date: string;
  //  一个字符串类型，表示通知的优先级。
  quality: string;
}

//  接口定义了与路由信息相关的数据结构，包括以下属性：
export interface TRouterInfo {
  // 该路由的路径。
  path: string;
  // 一个可选属性，类型为 LocationQueryRaw，表示路由查询参数。
  query?: LocationQueryRaw;
  // 一个可选属性，类型为数值，表示路由索引
  routeIdx?: number;
  // 一个可选属性，类型为字符串，表示路由标题。
  title?: string;
  // 一个可选属性，类型为字符串，表示路由名称。
  name?: RouteRecordName;
  //  一个可选属性，类型为布尔值，表示路由组件是否保持激活状态。
  isAlive?: boolean;
  // 一个可选属性，类型为布尔值，表示是否为主页路由。
  isHome?: boolean;
  // 一个可选属性，类型为 any，表示路由的元数据。
  meta?: any;
}

export interface TTabRouterType {
  // 一个布尔类型，表示标签页路由是否正在刷新。
  isRefreshing: boolean;
  // 一个包含 TRouterInfo 类型元素的数组，表示标签页路由列表。
  tabRouterList: Array<TRouterInfo>;
}
