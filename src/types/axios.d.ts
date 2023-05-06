import { AxiosRequestConfig } from 'axios';

export interface RequestOptions {
  //  可选的 API 基本 URL
  apiUrl?: string;
  // 是否在请求 URL 前附加 urlPrefix。 默认：true
  isJoinPrefix?: boolean;
  // 可选的 URL 前缀
  urlPrefix?: string;
  //  是否将参数加到URL中
  joinParamsToUrl?: boolean;
  // 格式化请求参数时间
  formatDate?: boolean;
  //  是否在请求中添加令牌。
  isTransformResponse?: boolean;
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse?: boolean;
  // 是否忽略重复请求
  ignoreRepeatRequest?: boolean;
  // 是否加入时间戳
  joinTime?: boolean;
  //  是否在请求中添加令牌。
  withToken?: boolean;
  retry?: {
    count: number;
    delay: number;
  };
}
// Result 接口定义了一个通用的响应结果对象，包括以下属性：
// code: 响应状态码，例如，成功的状态码通常是 200。
// data: 泛型 T 类型的响应数据。
export interface Result<T = any> {
  code: number;
  data: T;
}
// 接口继承了 AxiosRequestConfig，并添加了一个可选的 retryCount 属性，用于记录当前请求的重试次数。这在实现请求重试功能时非常有用。
export interface AxiosRequestConfigRetry extends AxiosRequestConfig {
  retryCount?: number;
}
