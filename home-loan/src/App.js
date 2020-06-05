import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ConfigureStore from './store/configureStore';
import ConfigureRoutes from './routes/configureRoutes'

const store = ConfigureStore(); // You can also pass in an initialState here

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ConfigureRoutes />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
