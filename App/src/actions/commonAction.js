import * as types from './actionTypes';
import request from '../services/request';
import api from '../services/api';

export const getInitialData = (lang) => {
  return (dispatch) => {
    dispatch({type: types.INITIAL_APP_DATA, appData: {}});
    request.getInternal(api.getMessage(lang), {}).then(res => {
      dispatch({type: types.INITIAL_APP_MSG, msg: res.data});
    })
  };
}

export const setErrorMessage = (messageContent, errorType='error') => {
  return (dispatch) => {
    dispatch({
      type: types.SET_ERROR_CONTENT_MESSAGE,
      messageContent,
      errorType
    })
  };
}

export const setInlineErrorMessage = (inlineMessage) => {
  return {
    type: types.SET_INLINE_ERROR_MESSAGE,
    inlineMessage
  }
}

//set loading status
export const setLoadingStatus = (isLoading) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_APP_LOADING_STATUS,
      isLoading
    });
  };
}


