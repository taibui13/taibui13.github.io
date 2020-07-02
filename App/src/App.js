import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './store/configureStore';
import ConfigureRoutes from './routes/configureRoutes'


class App extends Component {
  render() {
    return (
      <Provider store={configureStore}>
        <BrowserRouter>
          <ConfigureRoutes />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
