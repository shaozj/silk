/**
 * Asynchronously loads the component
 */
import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';

export default Loadable({
  loader: () => import(/* webpackChunkName: "delivery-material" */'./index'),
  loading: LoadingIndicator
});
