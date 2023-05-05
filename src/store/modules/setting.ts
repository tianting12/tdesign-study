import { defineStore } from 'pinia';
import keys from 'lodash/keys';
import { COLOR_TOKEN, LIGHT_CHART_COLORS, DARK_CHART_COLORS, TColorSeries } from '@/config/color';
import STYLE_CONFIG from '@/config/style';
import { store } from '@/store';

const state = {
  ...STYLE_CONFIG,
  showSettingPanel: false,
  colorList: COLOR_TOKEN,
  chartColors: LIGHT_CHART_COLORS,
};

export type TState = typeof state;

export const useSettingStore = defineStore('setting', {
  // 包含了一些初始设置和默认值。
  state: () => state,
  getters: {
    // 用于获取当前主题的颜色列表。返回一个布尔值，表示是否应该显示侧边栏。如果布局 (state.layout) 不等于 'top'，则返回 true，否则返回 false。
    showSidebar: (state) => state.layout !== 'top',
    // layout: 'side'，则返回 true，否则返回 false。
    showSidebarLogo: (state) => state.layout === 'side',
    showHeaderLogo: (state) => state.layout !== 'side',
    // 用于获取当前主题的颜色列表。返回一个布尔值，表示是否应该显示侧边栏。如果布局 (state.layout) 不等于 'top'，则返回 true，否则返回 false。
    // displayMode: 返回一个字符串，表示当前的显示模式，可以是 'dark' 或 'light'。如果模式 (state.mode) 等于 'auto'，则通过检查浏览器的
    // prefers-color-scheme 来决定返回 'dark' 还是 'light'。如果模式不是 'auto'，则直接返回模式值（'dark' 或 'light'）。
    displayMode: (state): 'dark' | 'light' => {
      if (state.mode === 'auto') {
        const media = window.matchMedia('(prefers-color-scheme:dark)');
        if (media.matches) {
          return 'dark';
        }
        return 'light';
      }
      return state.mode as 'dark' | 'light';
    },
  },
  actions: {
    // 用于切换主题模式。接受一个字符串参数，可以是 'dark'、'light' 或 'auto'。如果参数是 'auto'，则通过检查浏览器的 prefers-color-scheme 来决定
    async changeMode(mode: 'dark' | 'light' | 'auto') {
      let theme = mode;
      // 如果模式 (state.mode) 等于 'auto'，则通过检查浏览器的 prefers-color-scheme 来决定返回 'dark' 还是 'light'。如果模式不是 'auto'，则直接返回模式值（'dark' 或 'light'）。
      if (mode === 'auto') {
        const media = window.matchMedia('(prefers-color-scheme:dark)');
        if (media.matches) {
          theme = 'dark';
        } else {
          theme = 'light';
        }
      }
      // 这段代码定义了一个布尔值变量 isDarkMode，用于检查当前的主题是否为暗色主题。如果 theme 等于 'dark'，
      // 那么 isDarkMode 将为 true，表示当前主题是暗色主题；否则，isDarkMode 将为 false，表示当前主题不是暗色主题。这个变量可以用于根据当前主题执行不同的操作或应用不同的样式。
      const isDarkMode = theme === 'dark';
      // ? condition ? value1 : value2 如果 condition 为真，则返回 value1，否则返回 value2。在
      // document.documentElement.setAttribute('theme-mode', isDarkMode ? 'dark' : ''); 中，当 isDarkMode 为 true 时，将 theme-mode 属性设置为 'dark'，否则将其设置为空字符串 ''。
      document.documentElement.setAttribute('theme-mode', isDarkMode ? 'dark' : '');

      // this.chartColors = isDarkMode ? DARK_CHART_COLORS : LIGHT_CHART_COLORS;
      this.chartColors = isDarkMode ? DARK_CHART_COLORS : LIGHT_CHART_COLORS;
    },
    changeBrandTheme(brandTheme: string) {
      document.documentElement.setAttribute('theme-color', brandTheme);
    },
    addColor(payload: TColorSeries) {
      // 合并
      this.colorList = { ...this.colorList, ...payload };
    },
    // 用于更新配置。接受一个对象参数，对象的键是配置的属性名，值是要更新的值。在函数内部，遍历参数对象的键，如果值不是 undefined，则将当前的配置值替换为参数对象的值。
    updateConfig(payload: Partial<TState>) {
      for (const key in payload) {
        if (payload[key] !== undefined) {
          this[key] = payload[key];
        }
        if (key === 'mode') {
          this.changeMode(payload[key]);
        }
        if (key === 'brandTheme') {
          this.changeBrandTheme(payload[key]);
        }
      }
    },
  },
  persist: {
    // 用于持久化的配置项。这里使用了 lodash 的 keys 函数，将 STYLE_CONFIG 对象的所有键都作为持久化的配置项。
    paths: [...keys(STYLE_CONFIG), 'colorList', 'chartColors'],
  },
});

export function getSettingStore() {
  return useSettingStore(store);
}
