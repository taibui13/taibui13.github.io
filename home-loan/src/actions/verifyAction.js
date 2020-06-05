import * as types from './actionTypes';
import { Config, Application } from './../api/httpApi';
import { setApplicationId } from './applicationAction';
import { setLoadingStatus } from './commonAction';
import localStore from './../common/localStore';

export const handleEmailValidation = (code, redirectOnSuccess) => {
  return (dispatch, getState) => {
    dispatch(setEmailVerifying(true));
    // const data = {
    //   "identifier" : "5c2a7ed3-7f38-4dda-b16b-0a750deb6702",
    //   "legalId" : "S9912374E",
    //   "status" : "PENDING_MAIN_CUSTOMER",
    //   "agentParams" : "SoReal|ERA|R041851C"
    // }
    // localStore.setStore("agentParams", data.agentParams)
    // dispatch(storeAgentParams(data.agentParams))
    // dispatch(setApplicationId(data));
    // dispatch(setEmailVerifying(false));
    // dispatch(isFromAgentFlow(true));
    // redirectOnSuccess && redirectOnSuccess();

    Config.verifyEmail(code).then(response => {
      localStore.setStore("agentParams", response.data.agentParams)
      dispatch(storeAgentParams(response.data.agentParams))
      dispatch(setApplicationId(response.data.identifier));
      dispatch(setEmailVerifying(false));
      dispatch(isFromAgentFlow(true));
      redirectOnSuccess && redirectOnSuccess();
    }).catch(e => {
      dispatch(setEmailVerifying(false));
      if (e.response && e.response.status === 400) {
        dispatch(setEmailVerifyStatus(false, 'linkExpired'));
      } else if (e.response && e.response.status === 500) {
        dispatch(setEmailVerifyStatus(false, 'serviceDown'));
      } else {
        dispatch(setEmailVerifyStatus(false, 'badRequest'));
      }
    });
  }
}

export const handleSetDefaultError = (errorCode) => {
  return {
    type: types.SET_DEFAULT_VERIFY_ERROR_CODE,
    errorCode
  }
}

const setEmailVerifyStatus = (status, errorCode) => {
  return {
    type: types.SET_EMAIL_VERIFY_STATUS,
    status,
    errorCode
  }
}

const setEmailVerifying = (status) => {
  return {
    type: types.SET_EMAIL_VERIFYING_STATUS,
    status
  }
}

export const appendParameter = (parameter) => {
  return (dispatch) => {
    dispatch({
      type: types.APPEND_PARAMETER_TO_URL,
      parameter
    })
  }
}

export const setVerifyCode = (verifyCode) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_VERIFY_CODE,
      verifyCode
    })
  }
}

export const retrieveMyInfoURL = (parameter) => {
  return ( dispatch , getState ) => {
    dispatch(setLoadingStatus(true));
    Application.retrieveMyInfoRedirectURL(parameter).then(response => {
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

export const isFromAgentFlow = (status) => {
  return (dispatch) => {
    dispatch({
      type: types.IS_FROM_AGENT_FLOW,
      status
    })
  }
}

export const storeAgentParams = (params) => {
  return (dispatch) => {
    const paramsArr = params.split('|');
    const source = paramsArr[0];
    const agency = paramsArr[1];
    const ceaid = paramsArr[2];

    dispatch({
      type: types.STORE_AGENT_PARAMS,
      source,
      agency,
      ceaid
    })
  }
}
