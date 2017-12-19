'use strict';

import { fetchGet } from '@ali/uniform-react-components/lib/UniFetch/index';

class Fetcher {
  /**
   * 搜索节目
   */
  static searchShow(key) {
    return fetchGet('/platform/youku_api/filterShow.json', {key});
  }

}

export default Fetcher;
