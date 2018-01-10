'use strict';
// 换肤管理页面的请求接口管理

import { fetchGet, fetchPost } from '@ali/uniform-react-components/lib/UniFetch/index';

class Fetcher {
  /**
   * 获取方案列表
   * @param query
   * @param query.accountid
   * @param query.status
   * @param query.projectname
   * @param query.pageNo
   * @param qeury.pageSize
   */
  static getList(query) {
    return fetchGet('/output/project/query.json', { query: JSON.stringify(query) });
  }

  /**
   * 新增方案
   * @param project:
   *           name： 方案名称， 必传
   *           category: 分类， 字符串，逗号分隔的汉字
   *           categoryBlock: 屏蔽分类
   *           showIds:  剧集指定，字符串，逗号分隔的 id
   *           showIdsBlock: 屏蔽剧集，同上
   *           pygIds: 指定蒲公英账号，逗号分隔的id
   *           pgyIdsBlock: 屏蔽蒲公英账号, 同上
   *           ownerIds: 自媒体 指定， 逗号分隔的 id
   *           ownerIdsBlock: 屏蔽自媒体，同上
   *           ownerNames: 自媒体指定， 逗号分隔 的 name
   *           ownerNames: 屏蔽自媒体， 同上
   *           isExclusive: 是否独播， 0 否 1 是
   *           notExclusive: 是否非独播， 0 否 1 是
   *           isUpgc: 是否Upgc， 0 否 1 是
   *           isPublicCopywright: 是否独播， 0 否 1 是
   *           accounts: 关联账号： list list 中是账号map， 具体格式：{"userinfoChannelId":100,"outputChannel":"jinxiao","account":"jinxiaotest"}
   * @see https://lark.alipay.com/asam9t/actwte/izb320#1%E3%80%81%E6%96%B0%E5%A2%9E%E6%96%B9%E6%A1%88
   */
  static add(param) {
    return fetchPost('/output/project/add.json', { project: JSON.stringify(param) });
  }

  /**
   * 更新方案
   * @param id
   * @param project
   * @see https://lark.alipay.com/asam9t/actwte/izb320#2%E3%80%81%E7%BC%96%E8%BE%91%E6%96%B9%E6%A1%88
   */
  static update(id, param) {
    return fetchPost(`/output/project/${id}/update.json`, { project: JSON.stringify(param) });
  }

  /**
   * 获取单个方案详情
   * @param id
   */
  static get(id) {
    return fetchGet(`/output/project/${id}/detail.json`);
  }

  /**
   * 设置方案状态
   * @param id
   * @param status
   */
  static setStatus(id, status) {
    return fetchPost(`/output/project/${id}/update.json`, { project: JSON.stringify({ status }) });
  }

}

export default Fetcher;
