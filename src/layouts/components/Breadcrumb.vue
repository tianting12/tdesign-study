<template>
  <t-breadcrumb :max-item-width="'150'" class="tdesign-breadcrumb">
    <t-breadcrumbItem v-for="item in crumbs" :key="item.to" :to="item.to">
      {{ item.title }}
    </t-breadcrumbItem>
  </t-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const crumbs = computed(() => {
  //  使用 useRoute 函数从 vue-router 获取当前路由对象。 /dashboard/base
  const route = useRoute();
  // 从路由对象中获取 path 属性，然后使用 split 方法将其拆分为数组。 ["", "dashboard", "base"]
  const pathArray = route.path.split('/');
  // 使用 shift 方法删除数组中的第一个元素。 ["dashboard", "base"]
  pathArray.shift();

  // reduce 函数是 JavaScript 数组的一个方法，它用于将数组的元素组合成一个值。reduce 函数接受一个回调函数作为参数，该回调函数在数组的每个元素上调用，最终将结果累积成单个值。
  const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
    // 如果路由下有hiddenBreadcrumb或当前遍历到参数则隐藏
    if (route.matched[idx]?.meta?.hiddenBreadcrumb || Object.values(route.params).includes(path)) {
      return breadcrumbArray;
    }

    // 将当前遍历到的路由信息添加到面包屑数组中
    breadcrumbArray.push({
      path,
      to: breadcrumbArray[idx - 1] ? `/${breadcrumbArray[idx - 1].path}/${path}` : `/${path}`,
      title: route.matched[idx]?.meta?.title ?? path,
    });
    return breadcrumbArray;
  }, []);
  return breadcrumbs;
});
</script>
<style scoped>
.tdesign-breadcrumb {
  margin-bottom: 24px;
}
</style>
