// 通用声明

// Vue
// declare module '*.vue' {...}：这部分声明了一个通配符模块，表示所有 .vue 文件。这样，TypeScript 可以正确处理 Vue 单文件组件（SFC）的导入。
declare module '*.vue' {
  import { DefineComponent } from 'vue';

  // 定义一个 component 常量，类型为 DefineComponent，泛型参数分别表示组件的 props、组件的 state 和组件的事件。
  const component: DefineComponent<{}, {}, any>;
  // ：将 component 导出为模块的默认导出，这样在其他地方导入 .vue 文件时，TypeScript 可以正确推断组件的类型。
  export default component;
}

// 义一个名为 ClassName 的类型，表示一个字符串、对象（对象的键为字符串，值为任意类型）或一个 ClassName 类型的数组。这可以用于表示 CSS 类名，例如在 Vue 组件中以对象形式传递类名。
// { [className: string]: any }：这是一个对象，其中键是字符串类型，值是任意类型。这可以用于表示一个以类名为键、类属性值为值的对象。例如，可以用来表示一个 CSS 类对象，键对应于类名，值对应于类属性值。
// ClassName[]：这表示一个 ClassName 类型的数组。数组中的每个元素都是 ClassName 类型，这意味着数组可以包含对象、其他 ClassName 数组或字符串。这种结构可以用于表示嵌套的类名组合。
// string：这表示一个字符串类型，可以用于表示单独的类名。
declare type ClassName = { [className: string]: any } | ClassName[] | string;

declare module '*.svg' {
  const CONTENT: string;
  export default CONTENT;
}

// 义一个名为 Recordable 的类型，它接受一个泛型参数 T（默认为 any 类型），并将其映射为 Record<string, T> 类型。这表示一个对象，其中键是字符串，值是类型 T。这个类型可以在项目中用于声明具有动态键的对象。
// T = any：这是一个泛型参数，表示类型变量 T。默认情况下，如果在使用 Recordable 类型时没有提供泛型参数，那么 T 将是 any 类型。
// Record<string, T>：这是 TypeScript 中的 Record 类型，它接受两个类型参数。第一个参数是键的类型，第二个参数是值的类型。在本例中，键的类型是 string，值的类型是泛型参数 T。
declare type Recordable<T = any> = Record<string, T>;

// declare 关键字用于声明变量、类型、模块等。但在这里，declare model 并不是一个合法的 TypeScript 声明
