import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './../reducers'; 
import { logger } from '../middleware/logger';

const composeEnhancers = process.env.NODE_ENV !== "production"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : "" || compose;
      
function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
      //  applyMiddleware(customMiddleWare)
        composeEnhancers(applyMiddleware(thunk, logger))
    );
}

export default configureStore();
