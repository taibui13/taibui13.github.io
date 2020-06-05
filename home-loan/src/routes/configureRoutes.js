import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RetrievingContainer from './../containers/RetrievingContainer';
import PendingContainer from './../containers/PendingContainer';
import ApplicationContainer from './../containers/ApplicationContainer';
import VerifyContainer from './../containers/VerifyContainer';
import ApplyContainer from './../containers/ApplyContainer';
import ErrorContainer from './../containers/ErrorContainer';
import {detectPathName} from './../common/utils';

const ConfigureRoutes = () => (
  <div id="main">
    <Switch>
      <Route exact path={`${detectPathName()}`} component={RetrievingContainer} />
      <Route exact path={`${detectPathName()}apply`} component={ApplyContainer} />
      <Route path={`${detectPathName()}error`} component={ErrorContainer} />
      <Route path={`${detectPathName()}pending`} component={PendingContainer} />
      <Route path={`${detectPathName()}application`} component={ApplicationContainer} />
      <Route path={`${detectPathName()}verify`} component={VerifyContainer} />
    </Switch>
  </div>
);

export default ConfigureRoutes;
