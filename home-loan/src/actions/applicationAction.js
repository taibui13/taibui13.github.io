import * as types from './actionTypes';
import { Config, Application, allowFutureDate } from './../api/httpApi';
import { setBasicDetailData } from './basicDetailsAction';
import { setPersonalDetailData, setPreviousPersonalData } from './personalDetailsAction';
import { setLoanDetailsData, setJointApplicantData, setAdditionalDetailsLoan } from './loanDetailsAction';
import { setResidentialDetailData, setMailingAddressData } from './residentialDetailsAction';
import { setWorkDetailData, setNameOfBusiness, setPreviousApplicationWorkDetails } from './workDetailsAction';
import { setLocalAddressHomeData, setMailingAddressHomeData } from './localAddressInputAction';
import { setMyInfoFlowStatus, setProcessingStatus, setParameter } from './commonAction';
import { storeAgentParams } from './verifyAction';
import localStore from './../common/localStore';

//Retrieve MY Info
export const retrieveMyInfoDetails = (redirectToErrorPage, parameter) => {
  return (dispatch) => {
    dispatch(retrievingMyInfoData(true));
    dispatch(setParameter(parameter));    
    Config.getMyInfoData().then(response => {
      const address = response.applicant.addresses && response.applicant.addresses[0];
      Promise.resolve().then(() => {
        const params = localStore.getStore("agentParams");
        params && params !=="" && response.applicant.verifiedData === "A" && dispatch(storeAgentParams(params));
        dispatch(storeMyInfoData(response));
        dispatch(setApplicationId(response.applicationId));
        dispatch(setBasicDetailData(response.applicant));
        dispatch(setPersonalDetailData(response.applicant.personalInfo));
        dispatch(setWorkDetailData(response.applicant.employmentInfo, response.applicant.incomeDetails, allowFutureDate));
        dispatch(setNameOfBusiness(response.applicant.employmentInfo));
        if (address) {
          dispatch(setResidentialDetailData(address));
          dispatch(setLocalAddressHomeData(address));
        }
        dispatch(setMyInfoFlowStatus(true));
      }).then(() => {
        Promise.resolve().then(() => {
          dispatch(retrievingMyInfoData(true));
          Config.getPackage().then(response => {
            const loanPackage = response;
            dispatch({
              type: types.STORE_LOAN_PACKAGE,
              loanPackage
            });
           })
        }).then(() => {
          if(response.applicant.verifiedData === "S"){
            dispatch(setWithApplicationId(true));
          } else {
            dispatch(setRetrieveApplicationDataLoaded());
          }
          dispatch(retrievingMyInfoData(false));
        })
      });
    }).catch(e => {
      if (e.response && e.response.status === 400) {
        dispatch(setErrorWithValue("linkExpired", e.response.data));
        redirectToErrorPage && redirectToErrorPage();
      } else if (e.response && e.response.status === 500) {
        dispatch(setErrorWithValue("serviceDown"));
        redirectToErrorPage && redirectToErrorPage();
      } else {
        dispatch(setErrorWithValue("badRequest"));
        redirectToErrorPage && redirectToErrorPage();
      }
      dispatch(retrievingMyInfoData(false));
    });
  };
}

export const retrieveApplicationId = (dataObj, handleToLoanDetails, redirectToErrorPage) => {
  return (dispatch) => {
    // handleToLoanDetails && handleToLoanDetails()
    dispatch(setProcessingStatus(true));
    Config.getApplicationId(dataObj).then(response => {
      Promise.resolve().then(() => {
        dispatch(setProcessingStatus(false));
        dispatch(setApplicationId(response.applicationId));
      }).then(() => {
        handleToLoanDetails && handleToLoanDetails()
      });
    }).catch(e => {
      if (e.response && e.response.status === 400) {
        dispatch(setErrorWithValue("linkExpired"));
        redirectToErrorPage && redirectToErrorPage();
      } else if (e.response && e.response.status === 500) {
        dispatch(setErrorWithValue("serviceDown"));
        redirectToErrorPage && redirectToErrorPage();
      } else {
        dispatch(setErrorWithValue("badRequest"));
        redirectToErrorPage && redirectToErrorPage();
      }
      dispatch(setProcessingStatus(false));
    });
  }
}

export const setRetrieveApplicationDataLoaded = () => {
  return {
    type: types.SET_APPLICATION_DATA_LOADED
  }
}

export const retrievingMyInfoData = (status) => {
  return {
    type: types.RETRIEVING_MYINFO_DATA,
    status
  }
}

export const setApplicationId = (id) => {
  return {
    type: types.SET_APPLICATION_ID,
    id
  }
}

//Save Application
export const submitPartialApplication = (dataObj, applicationId, redirectToErrorPage) => {
  return (dispatch) => {
    Application.submitPartialApplication(dataObj, applicationId).catch(e => {
      if (e.response && e.response.status !== 500 && e.response.status !== 400) {
        dispatch(setErrorWithValue("badRequest"));
        redirectToErrorPage && redirectToErrorPage();
      }
    });
  }
}

export const setErrorWithValue = (errorCode, error) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_ERROR_MESSAGE_WITH_ERRORCODE,
      errorCode,
      error
    })
  }
}

export const setWithApplicationId = () => {
  return (dispatch) => {
    dispatch({
      type: types.SET_WITH_APPLICATION_ID
    })
  }
}

export const isTakePreviousApplication = (status) => {
  return (dispatch) => {
    Promise.resolve().then(() => {
      dispatch({
        type: types.IS_TAKE_PREVIOUS_APPLCIATION,
        status
      })
    }).then(() => {
      if(status) {
        dispatch(setPreviousApplicationData());
      }
      dispatch(setRetrieveApplicationDataLoaded());
    });
  }
}

export const storeMyInfoData = (data)  => {
  return (dispatch) => {
    dispatch ({
      type: types.STORE_MY_INFO_DATA,
      data
    })
  }
}

export const setPreviousApplicationData = () => {
  return (dispatch, getState) => {
    const response = getState().applicationReducer.data;
    dispatch(setLoanDetailsData(response.loanDetails, response.propertyDetails));
    dispatch(setPreviousPersonalData(response.applicant.personalInfo));
    if(response.jointApplicant){
      dispatch(setJointApplicantData(response.jointApplicant))
    }
    dispatch(setAdditionalDetailsLoan(response.applicant.additionalDetails));
    dispatch(setPreviousApplicationWorkDetails( response.applicant.incomeDetails, response.applicant.employmentInfo.employers, response.applicant.additionalDetails));
    const mailingAddress = response.applicant.addresses && response.applicant.addresses[1];
    if(mailingAddress){
      dispatch(setMailingAddressData(mailingAddress));
      dispatch(setMailingAddressHomeData(mailingAddress));
    }
  }
}
