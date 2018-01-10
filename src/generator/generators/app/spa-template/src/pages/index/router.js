/**
 * 页面路由
 */

import routes from './routes';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

export default function(){
  return (
    <BrowserRouter>
      <Switch>
        {
          routes.map((route, k) => (
            <Route exact key={k} path={route.path} render={(props) => {
              if (route.redirectTo) {
                return <Redirect to={route.redirectTo} />;
              } else if (route.component) {
                return <route.component {...props} />;
              }
              return null;
            }} />
          ))
        }
      </Switch>
    </BrowserRouter>
  );
}
