import * as types from './actionTypes';
import scrollIntoView from 'scroll-into-view';
import { Config } from './../api/httpApi';

//change current step
export const changeCurrentStep = (step) => {
  return (dispatch) => {
    dispatch({
      type: types.CHANGE_CURRENT_STEP,
      step
    });
  };
};

//get initial application data
export const getInitialData = () => {
  return (dispatch) => {
    dispatch(setLoadingStatus(true));
    Config.getInitialData().then((response) => {
        dispatch({
          type: types.INITIAL_APP_DATA,
          appData: response.mainApplicant
          // appData: response
        });
        dispatch(setLoadingStatus(false));
    });
  };
}

export const getFormData = () => {
  return (dispatch) => {
    Config.getFormData().then((response) => {
        dispatch({
          type: types.INITIAL_FORM_DATA,
          formData: response
        });
    });
  };
}

//set global error message
export const setErrorMessage = (messageContent, timeOut) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_ERROR_CONTENT_MESSAGE,
      messageContent,
      timeOut
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

export const setProcessingStatus = (isProcessing) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_APP_PROCESSING_STATUS,
      isProcessing
    });
  };
}

export const scrollToSection = (nextStep) => {
    // similar to nextTick in node. will push function to the next queue stack.
    return (dispatch) => {
      Promise.resolve().then(() => {
        dispatch(setCurrentSection(nextStep));
      }).then(() => {
        const element = document.querySelector(`[id='${nextStep}-section']`);
        scrollIntoView(element, {time: 500, align: {top: 0}});
      });
    }
}

export const scrollBackToSection = (nextStep) => {
    // similar to nextTick in node. will push function to the next queue stack.
    return (dispatch) => {
      Promise.resolve().then(() => {
        const element = document.querySelector(`[id='${nextStep}-section']`);
        scrollIntoView(element, {time: 500, align: {top: 0}});
      });
    }
}


export const scrollToElement = (element) => {
    // similar to nextTick in node. will push function to the next queue stack.
    return (dispatch) => {
      Promise.resolve().then(() => {
        const toElement = document.querySelector(`[id='${element}']`);
        scrollIntoView(toElement, {time: 500, align: {top: 0}});
      });
    }
}

export const setCurrentSection = (currentSection) => {
  return {
    type: types.SET_CURRENT_SECTION,
    currentSection
  }
}


export const setIdentifier = (identifier) => {
  return {
    type: types.SET_IDENTIFIER,
    identifier
  }
}

export const setMyInfoFlowStatus = (status) => {
  return {
    type: types.SET_MYINFO_FLOW_STATUS,
    status
  }
}

//handle HelpMessage click
export const setHelpMessageExpanded = (isExpand) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_HELP_MESSAGE_EXPANDED,
      isExpanded: !isExpand
    });
  };
}

export const setApplicationReferenceNo = (referenceNo) => {
  return {
    type: types.SET_APPLICATION_REFERENCE_NO,
    referenceNo
  }
}


// handle set error msg
export const handleErrorMessage = (field, errorMsg) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_ERROR_MESSAGE_INPUT,
      field,
      errorMsg
    })
  }
}

export const handleClearErrorMessage = (field) => {
  return (dispatch) => {
    dispatch({
      type: types.CLEAR_ERROR_MESSAGE_INPUT,
      field
    })
  }
}

export const setParameter = (parameter) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_PARAMETER,
      parameter
    })
  }
}

export const updateObject = (type, obj) => { return { type, obj } }
