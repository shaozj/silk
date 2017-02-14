import '../style/index.less';
import <%= component.className %> from './index';

// write your demo code here, below is an example
data = "hello world";
params = {
  "name": "Jack"
}
const mountNode = document.getElementById('app');
new <%= component.className %>(mountNode, data, params);
