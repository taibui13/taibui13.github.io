import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { detectPathName } from './../common/utils';
import  OnBoard from './../containers/onBoard';
import  Error from './../containers/error';
import { wrapHOC } from '../pages/WrappedComponent';

const configureRoutes = () => (
  <main>
    <Switch>
    <Route exact path={detectPathName()} component={wrapHOC(OnBoard)} />  
    <Route path={`${detectPathName()}error`} component={wrapHOC(Error)} />
    </Switch>
  </main>
);

export default configureRoutes;
