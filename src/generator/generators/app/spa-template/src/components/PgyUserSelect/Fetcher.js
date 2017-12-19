'use strict';

import { fetchGet } from '@ali/uniform-react-components/lib/UniFetch/index';

class Fetcher {
  /**
   * 获取账号列表
   * @param data
   * @param data.pageSize
   * @param data.pageNo
   */
  static queryUserlist(data) {
    return fetchGet('/user_info/query.json', {query: JSON.stringify(data)});
  }

}

export default Fetcher;
