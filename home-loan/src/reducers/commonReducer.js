import * as types from './../actions/actionTypes';

const initialState = {
  isLoading: true,
  isProcessing: false,
  currentStep: 'signIn',
  currentSection: 'basicDetails',
  appData: null,
  messageContent: '',
  inlineMessage: '',
  referenceNo: '',
  identifier: '',
  isMyInfoFlow: false,
  isExpanded: false,
  parameter: '',
  formData: {},
  errorTimeOut: 15
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INITIAL_APP_DATA:
      return { ...state, appData: action.appData };

    case types.INITIAL_FORM_DATA:
        return { ...state, formData: action.formData };  

    case types.SET_APP_LOADING_STATUS:
      return { ...state, isLoading: action.isLoading };

    case types.SET_APP_PROCESSING_STATUS:
      return { ...state, isProcessing: action.isProcessing };

    case types.SET_ERROR_CONTENT_MESSAGE:
      return { ...state, messageContent: action.messageContent, errorTimeOut: action.timeOut ? action.timeOut : 15 };

    case types.SET_INLINE_ERROR_MESSAGE:
      return { ...state, inlineMessage: action.inlineMessage };

    case types.CHANGE_CURRENT_STEP:
      return { ...state, currentStep: action.step };

    case types.SET_CURRENT_SECTION:
      return { ...state, currentSection: action.currentSection };

    case types.SET_IDENTIFIER:
      return { ...state, identifier: action.identifier };

    case types.SET_MYINFO_FLOW_STATUS:
      return { ...state, isMyInfoFlow: action.status };

    case types.SET_HELP_MESSAGE_EXPANDED:
      return { ...state, isExpanded: action.isExpanded};

    case types.SET_APPLICATION_REFERENCE_NO:
      return { ...state, referenceNo: action.referenceNo};

    case types.SET_PARAMETER:
      return { ...state , parameter: action.parameter};
      
    default:
      return state;
  }
}

export default commonReducer;
