'use strict';
// 换肤管理页面的请求接口管理

import {fetchGet, fetchPost} from 'components/RequestManager/RequestManager';

class Fetcher {
  /**
   * 搜索皮肤方案
   * @param data
   * @param data.page
   * @param data.name
   * @param data.creator
   * @param data.device  unnecessary
   * @param data.version  unnecessary
   * @param data.status
   * @param data.configType 写死 'skin'
   */
  static searchMethod(data) {
    return fetchGet('/config/query.json', data);
  }

  /**
   * 根据 id 获取皮肤方案信息
   * @param id
   */
  static getMethodInfo(id) {
    return fetchGet('/config/queryById.json', {id});
  }

  /**
   * 创建皮肤方案
   * @param data
   * @param data.name
   * @param data.page
   * @param data.device
   * @param data.version
   * @param data.status
   * @param data.description
   * @param data.startTime
   * @param data.endTime
   * @param data.configType = "skin"
   * @param data.config
   * @param data.config.header
   * @param data.config.header.img
   * @param data.config.header.textColor
   * @param data.config.bottom array
   * {
   *   "iconName": "图1",
   *   "selected": "test2.jpg",
   *   "unselected": "test3.jpg"
   * }
   */
  static addMethod(data) {
    return fetchPost('/config/add.json', data);
  }

  /**
   * 修改换肤方案
   * @param data
   * @param data.id
   * 其它参数同 addMethod
   */
  static updateMethod(data) {
    return fetchPost('/config/update.json', data);
  }

  /**
   * 删除换肤方案
   */
  static deleteMethod(id) {
    return fetchPost('/config/delete.json', {id});
  }

  /**
   * 修改换肤方案状态
   * @param data
   * @param data.id
   * @param data.status
   */
  static updateMethodStatus(data) {
    return fetchPost('/config/updateStatus.json', data);
  }

}

export default Fetcher;
