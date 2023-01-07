import { IResponse } from "@/types/request";
import request from "@/utils/request";

/**
 * 获取数据
 * @returns data
 */
export const fetch = () =>
  request<IResponse<string>>({
    method: "GET",
    url: "fetch",
  });

/**
 * 存储数据参数
 * @property {string} magicboard
 */
export interface IStore {
  magicboard: string;
}

/**
 * 存储数据
 * @param {IStore} data
 * @returns {string | null}
 */
export const store = (data: IStore) =>
  request<IResponse<string | null>>({
    method: "POST",
    url: "store",
    data,
  });
