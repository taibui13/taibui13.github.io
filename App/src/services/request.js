import endPoint from './endPoint';
import axios from 'axios';
import store from '../store/configureStore';
import { setLoadingStatus, setErrorMessage } from '../actions/commonAction';
const url_enviroment = (process.env.NODE_ENV === 'development') ? endPoint.base_dev : endPoint.base;
const request = (method) => {
    return (url, data, hideLoading, callbackError) => {
       if(!hideLoading) {
            store.dispatch(setLoadingStatus(true));
       }
        return new Promise((resolve, reject) => {
            axios[method](url_enviroment + url, data).then((response) => {
            resolve(response);
            store.dispatch(setLoadingStatus(false));
          }).catch((e) => {
              reject(e);
              store.dispatch(setLoadingStatus(false));
              if(callbackError) {
                callbackError(e);
              } else {
                const globalErrors = store.getState().commonReducer.msg.error;
                store.dispatch(setErrorMessage(globalErrors.serviceAvailable));
              }
             
            });
        });
    }   
    
}

const requestInternal = (method) => {
    return (url, data) => {
        return new Promise((resolve, reject) => {
            axios[method](url, data).then((response) => {
            resolve(response);
          }).catch((e) => reject(e));
        });
    }   
}

export default {
    get : request("get"),
    getInternal : requestInternal("get"),
    post: request("post")
}