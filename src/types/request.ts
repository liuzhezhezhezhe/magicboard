/**
 * 返回的基本数据格式
 * @param {number} code 状态码
 * @param {string} msg 状态说明
 * @param {T} data 返回的数据
 */
export interface IResponse<T> {
  code: number;
  msg: string;
  data: T;
}
