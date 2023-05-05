<template>
  <router-view :class="[mode]" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useSettingStore } from '@/store';

const store = useSettingStore();

const mode = computed(() => {
  return store.displayMode;
});
</script>
<style lang="less" scoped>
#nprogress .bar {
  background: var(--td-brand-color) !important;
}
</style>

<!--这是一个 Vue.js 单文件组件（SFC）的示例，包含三个部分：<template>、<script> 和 <style>。让我们逐一了解这些部分的功能：-->

<!--<template> 部分：-->

<!--定义了组件的 HTML 结构，其中 <router-view :class="[mode]" /> 是 Vue Router 的占位符，用于渲染当前路由对应的组件。:class="[mode]" 是一个动态类绑定，将根据组件的状态动态改变类名。-->
<!--<script setup> 部分：-->

<!--使用 Vue 3 的新特性 <script setup>，这是一种更简洁的组合式 API 用法。-->
<!--使用 lang="ts" 属性来指定我们使用 TypeScript 编写组件逻辑。-->
<!--从 'vue' 包中导入了 computed 函数，用于创建计算属性。-->
<!--导入 useSettingStore 函数，用于访问 Vuex store 的 setting 模块。-->
<!--创建一个名为 mode 的计算属性，它会根据 store 中的 displayMode 值动态改变。-->
<!--<style> 部分：-->

<!--使用 lang="less" 属性来指定我们使用 Less 预处理器编写 CSS 样式。-->
<!--使用 scoped 属性，使得这些样式只应用于当前组件，避免全局污染。-->
<!--在这个示例中，我们自定义了 #nprogress .bar 的背景颜色，使用了 var(&#45;&#45;td-brand-color) CSS 变量，将其设置为 TDesign 组件库中的品牌色。-->
<!--这个组件的主要作用是为 Vue Router 的占位符提供一个容器，根据设置的 mode 类名来改变路由组件的显示样式。同时，它还自定义了 NProgress 进度条的样式。-->
