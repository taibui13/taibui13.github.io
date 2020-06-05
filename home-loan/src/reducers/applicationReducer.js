import * as types from './../actions/actionTypes';

const initialState = {
  retrieveError: false,
  serviceDown: false,
  dataLoaded: false,
  isLoading: true,
  applicationID : '',
  hasError: false,
  errorCode: '',
  withApplicationId:false,
  viewPendingPage: false,
  isPreviousApplication: false,
  data: null,
  firstload: false,
  error: {
    errorCode: "",
    errorMsg: ""
  }
};

const applicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_APPLICATION_DATA_LOADED:
      return {
        ...state,
        dataLoaded: true,
        viewPendingPage: false
      };

    case types.RETRIEVING_MYINFO_DATA:
      return {
        ...state,
        isLoading: action.status
      };

    case types.SET_APPLICATION_ID:
      return {
        ...state,
        applicationID: action.id
      };

    case types.SET_ERROR_MESSAGE_WITH_ERRORCODE:
      return {
        ...state,
        errorCode : action.errorCode,
        hasError: true,
        dataLoaded: false,
        viewPendingPage: false,
        error: setErrorCode(action.error)
      }

    case types.SET_WITH_APPLICATION_ID:
      return {
        ...state,
        withApplicationId: true,
        viewPendingPage: true,
        hasError: false,
      }

    case types.IS_TAKE_PREVIOUS_APPLCIATION:
      return {
        ...state,
        isPreviousApplication: action.status
      };

    case types.STORE_MY_INFO_DATA:
      return {
        ...state,
        data: action.data
      }

    default:
      return state;
  }
}

const setErrorCode = (errorObj) => {
  let error = { errorCode: "", errorMsg: "" };
  if (errorObj && errorObj.errorCode) {
    error.errorCode = errorObj.errorCode;
    error.errorMsg = (errorObj.errorMessage && errorObj.errorMessage.slice(1, -1).split(",")) || [];
  }
  return error;
}

export default applicationReducer;
