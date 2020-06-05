import * as types from './actionTypes';
import { Application } from './../api/httpApi';
import { setLoadingStatus, setErrorMessage, setCurrentSection, setApplicationReferenceNo } from './commonAction';
import { setErrorWithValue } from './applicationAction';
import { sendDataToSparkline } from './../common/utils';

export const handleIstoggled = (isToggled , field) => {
  return(dispatch) => {
    dispatch ({
      type: types.CONFIRMDETAILS_IS_TOGGLED,
      field,
      isToggled : !isToggled
    })
  }
}

export const setToggleErrorMsg = (field, errorMsg) => {
  return {
    type: types.CONFIRMDETAILS_SET_TOGGLE_ERROR_MESSAGE,
    field,
    errorMsg
  }
}

export const submitApplication = (dataObj, applicationId, redirectToErrorPage) => {
  return(dispatch, getState) => {
      const globalErrors = getState().commonReducer.appData.globalErrors;
      const dataElement = getState().commonReducer.appData.dataElement;
      const isMyInfo = getState().commonReducer.isMyInfoFlow;
      const propertyType = getState().loanDetailsReducer.loanPropertyType.value;
      const loanType = getState().loanDetailsReducer.loanType.value;
      const parameter = getState().commonReducer.parameter;
      const agency =  getState().verifyReducer.agency;
      const ceaid =  getState().verifyReducer.ceaid;
      const source =  getState().verifyReducer.source;
      const isAgency = agency !== "" && agency !== null  && agency !== undefined && ceaid !== "" && ceaid !== null  && ceaid !== undefined && source !== "" && source !== null  && source !== undefined
      dispatch(setLoadingStatus(true));
      Application.submitApplication(dataObj, applicationId, parameter).then(response => {
        const referenceNo = response.data.referenceNumber;
        dispatch(setApplicationReferenceNo(referenceNo));
        dispatch(setLoadingStatus(false));
        if(referenceNo !== null && referenceNo !== undefined && referenceNo !== ''){
          dispatch(setCurrentSection('thankyou'));
          sendDataToSparkline(dataElement, '', isMyInfo, referenceNo, false, true, propertyType, loanType, false, isAgency, source, agency, ceaid);
        } else {
          dispatch(setErrorWithValue("NOREF"));
          redirectToErrorPage && redirectToErrorPage();
        }
      }).catch(e => {
        if (e.response && e.response.status === 400 ) {
          dispatch(setErrorMessage(globalErrors.apiException));
        } else if (e.response && e.response.status === 500) {
          dispatch(setErrorWithValue("linkExpired"));
          redirectToErrorPage && redirectToErrorPage();
        } else {
          dispatch(setErrorWithValue("badRequest"));
          redirectToErrorPage && redirectToErrorPage();
        }
        dispatch(setLoadingStatus(false));
      })
  }
}
