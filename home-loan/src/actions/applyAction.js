import * as types from './actionTypes';
import { Config } from './../api/httpApi';
import { setLoadingStatus } from './commonAction';

export const retrieveMyInfoURL = (parmas) => {
  return ( dispatch , getState ) => {
    dispatch(setLoadingStatus(true));
    const parameter = parmas && parmas !== "" ? `${parmas}` : ""
    Config.retrieveMyInfoRedirectURL(parameter).then(response => {
      const url = response.data.link;
      dispatch(storeRedirectLink(url));
      dispatch(setLoadingStatus(false));
    })
  }
}

export const storeRedirectLink = (link) => {
  return ( dispatch ) => {
    dispatch({
      type: types.STORE_REDIRECT_URL,
      link
    })
  }
}
