import * as types from './../actions/actionTypes';

const initialState = {
  isVerifying: false,
  errorCode: '',
  parameter: '',
  verifyingBox: true,
  receivingError: false,
  verifyCode: '',
  link: '',
  isAgentFlow: false,
  source: '',
  agency: '',
  ceaid: ''
};

const verifyReducer = (state = initialState, action) => {
  switch (action.type) {

    case types.SET_EMAIL_VERIFY_STATUS:
      return { ...state, isVerifying: action.status, errorCode: action.errorCode, receivingError: true, verifyingBox: false };

    case types.SET_DEFAULT_VERIFY_ERROR_CODE:
      return {
        ...state,
        errorCode: action.errorCode,
        isVerifying: false,
        receivingError: true,
        verifyingBox: false
      }

    case types.APPEND_PARAMETER_TO_URL:
      return {
        ...state,
        parameter: action.parameter
      }

    case types.SET_EMAIL_VERIFYING_STATUS:
      return {
        ...state,
        isVerifying: action.status,
        verifyingBox: false,
        receivingError: false
      }

    case types.SET_VERIFY_CODE:
      return {
        ...state,
        verifyCode: action.verifyCode
      }

    case types.IS_FROM_AGENT_FLOW:
      return {
        ...state,
        isAgentFlow: action.status
      }

    case types.STORE_AGENT_PARAMS:
      return {
        ...state,
        source: action.source,
        agency: action.agency,
        ceaid: action.ceaid
      }
      
    default:
      return state;
  }
}

export default verifyReducer;
