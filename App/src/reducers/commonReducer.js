import * as types from './../actions/actionTypes';
const initialState = {
  isLoading: false,
  appData: null,
  messageContent: '',
  inlineMessage: '',
  errorType: '',
  msg: null
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INITIAL_APP_DATA:
      return { ...state, appData: action.appData };

    case types.INITIAL_APP_MSG:
      return { ...state, msg: action.msg };  

    case types.SET_APP_LOADING_STATUS:
      return { ...state, isLoading: action.isLoading };

    case types.SET_ERROR_CONTENT_MESSAGE:
      return { ...state, messageContent: action.messageContent, errorType: action.errorType };

    case types.SET_INLINE_ERROR_MESSAGE:
      return { ...state, inlineMessage: action.inlineMessage };


    default:
      return state;
  }
}

export default commonReducer;
