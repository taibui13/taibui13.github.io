import request from '../../../services/request';
import api from '../../../services/api';
import {PAGES} from '../../../common/constant';
import {Action} from './responseHandler';

export function getUser(payload, goPage) {
  return (dispatch) => request.get(api.getUsers.replace("{id}", payload.id), payload, true, redirectPage.bind(this, goPage)).then(res => {
    dispatch({type: Action.GET_DATA, payload: {field: "users", data: res.data}});
    dispatch({type: Action.GET_DATA, payload: {field: "originalUser", data: res.data}});
    dispatch({type: Action.SET_STATUS, payload: {field: "isLoading", data: false}});
  })
}

export function selectData(data) {
  return (dispatch) => {
    dispatch({type: Action.SET_STATUS, payload: {field: "searchObj", data: data}});
  }
}

export function filterUsers(users, fieldName, value) {
  return (dispatch) => {
    dispatch({type: Action.FILTER_USER, payload: {field: "users", data: users, fieldName : fieldName, value : value}});
  }
}

export function setData(field, data) {
  return (dispatch) => {
    dispatch({type: Action.SET_DATA, payload: {field: field, data: data}});
  }
}

const redirectPage = (go, error) => {
  const errorCode = error && error.response && error.response.data && error.response.data.errorCode;
  const status = error && error.response && error.response.status;
  go && go({pathname: PAGES.ERROR, state: {errorID: errorCode ? errorCode: status}});
}

