// 从 pinia 库中导入了 defineStore 函数。defineStore 函数用于定义一个新的存储，它可以管理应用程序的状态、动作和其他逻辑。这个存储可以在应用程序的不同部分使用和共享。
import { defineStore } from 'pinia';
// 导入了一个名为 NotificationItem 的类型，该类型可能定义在 @/types/interface 文件中。
// 类型定义有助于提供更好的代码提示和类型检查。在本例中，NotificationItem 类型将被用于定义一个通知项，它可能包含了关于通知的一些信息，如标题、内容、类型等。
import type { NotificationItem } from '@/types/interface';

const msgData = [
  {
    id: '123',
    content: '腾讯大厦一楼改造施工项目 已通过审核！',
    type: '合同动态',
    status: true,
    collected: false,
    date: '2021-01-01 08:00',
    quality: 'high',
  },
  {
    id: '124',
    content: '三季度生产原材料采购项目 开票成功！',
    type: '票务动态',
    status: false,
    collected: false,
    date: '2021-01-01 08:00',
    quality: 'low',
  },
  {
    id: '125',
    content: '2021-01-01 10:00的【国家电网线下签约】会议即将开始，请提前10分钟前往 会议室1 进行签到！',
    type: '会议通知',
    status: false,
    collected: false,
    date: '2021-01-01 08:00',
    quality: 'middle',
  },
  {
    id: '126',
    content: '一季度生产原材料采购项目 开票成功！',
    type: '票务动态',
    status: true,
    collected: false,
    date: '2021-01-01 08:00',
    quality: 'low',
  },
  {
    id: '127',
    content: '二季度生产原材料采购项目 开票成功！',
    type: '票务动态',
    status: true,
    collected: false,
    date: '2021-01-01 08:00',
    quality: 'low',
  },
  {
    id: '128',
    content: '三季度生产原材料采购项目 开票成功！',
    type: '票务动态',
    status: true,
    collected: false,
    date: '2021-01-01 08:00',
    quality: 'low',
  },
];

// 这行代码定义了一个名为 MsgDataType 的新类型。MsgDataType 类型与 msgData 变量的类型相同。使用 typeof 关键字可以获取 msgData 变量的类型。
type MsgDataType = typeof msgData;

export const useNotificationStore = defineStore('notification', {
  // () => ({}) 是一个箭头函数的简写。箭头函数可以让你更简洁地编写函数表达式。在这个例子中，它表示一个没有参数的函数，函数体只有一个表达式，该表达式返回一个包含 msgData 属性的对象。
  //   function() {
  //   return {
  //     msgData: msgData
  //   };
  // }
  // state 是一个返回对象的函数。这个对象包含一个名为 msgData 的属性。这种写法是为了在每次访问或创建一个新的 Pinia store 实例时，都返回一个新的对象，而不是共享同一个对象。这样可以确保每个组件或实例都有自己独立的状态，从而避免数据被意外修改。

  state: () => ({
    msgData,
  }),
  // getters：提供两个 getter 函数，用于获取未读消息和已读消息。
  // unreadMsg：过滤 state.msgData，仅返回 status 为真的通知项。
  // readMsg：过滤 state.msgData，仅返回 status 为假的通知项。
  getters: {
    unreadMsg: (state) => state.msgData.filter((item: NotificationItem) => item.status),
    readMsg: (state) => state.msgData.filter((item: NotificationItem) => !item.status),
  },
  // actions：提供一个名为 setMsgData 的 action 函数，用于更新 msgData 属性。
  actions: {
    setMsgData(data: MsgDataType) {
      this.msgData = data;
    },
  },
  // persist：设置为 true，表示该存储的状态将被持久化。这意味着当用户刷新页面时，该存储的状态将被保留。
  persist: true,
});
