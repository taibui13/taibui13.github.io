import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './../reducers'; //get combine reducers

const composeEnhancers = process.env.NODE_ENV !== "production"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : "" || compose;

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(thunk))
    );
}
