import * as types from './actionTypes';
import { Customer } from './../api/httpApi';
import { setLoadingStatus, setProcessingStatus, setErrorMessage, setInlineErrorMessage, scrollToSection } from './commonAction';
export const setCountDownStatus = (status) => {
  return (dispatch) => {
    dispatch({
      type: types.OTP_SET_COUNT_DOWN_STATUS,
      status
    });
  };
}

export const sendOtp = (data, isResend = true) => {
  return (dispatch, getState) => {
    const globalErrors = getState().commonReducer.appData.globalErrors;
    const otpTriedCount = parseInt(getState().otpReducer.otpTriedCount, 10);
    dispatch(handleOtpChange(''));
    dispatch(setOtpTriedCount(otpTriedCount + 1));
    dispatch(setCountDownStatus(true));
    dispatch(isSendingOTP(true));
    dispatch(setProcessingStatus(true));
    const mobile = data.value.replace(/ +/g, "");

    Customer.sendOtp(mobile).then((res) => {
      dispatch(setOtpPrefix(res.data.prefix, res.data.requestIdentity));
      if (!isResend) {
         dispatch(scrollToSection('otpPage'));
      }
      dispatch(isSendingOTP(false));
      dispatch(setProcessingStatus(false));
    }).catch(e => {
      if (e.response && e.response.status === 400) {
        dispatch(setInlineErrorMessage(globalErrors.badRequest));
      } else {
        dispatch(setErrorMessage(globalErrors.apiException));
      }
      dispatch(isSendingOTP(false));
      dispatch(setProcessingStatus(false));
    });
  }
}

export const verifyOtp = (otpObj, gotoStep) => {
  return (dispatch, getState) => {
    const globalErrors = getState().commonReducer.appData.globalErrors;
    Customer.verifyOtp(otpObj).then((res) => {
      gotoStep();
      dispatch(setLoadingStatus(false));
      dispatch(setOtpVerified());
    }).catch(e => {
      if (e.response && e.response.status === 400) {
        dispatch(setInlineErrorMessage(globalErrors.invalidOTP));
      } else {
        dispatch(setErrorMessage(globalErrors.apiException));
      }
      dispatch(resetOtpToEmpty());
      dispatch(setLoadingStatus(false));
    });
  }
}

export const setOtpPrefix = (prefix, requestIdentity) => {
  return (dispatch) => {
    dispatch({
      type: types.OTP_SET_PREFIX,
      prefix,
      requestIdentity
    });
  }
}

export const setOtpTriedCount = (otpTriedCount) => {
  return (dispatch) => {
    dispatch({
      type: types.OTP_SET_TRIED_COUNT,
      otpTriedCount
    });
  }
}

export const handleOtpChange = (code) => {
  return (dispatch) => {
    dispatch({
      type: types.OTP_INPUT_CHANGE,
      code
    });
  }
}

const isSendingOTP = (status) => {
  return {
    type: types.OTP_IS_SENDING_OTP,
    status
  };
}

const resetOtpToEmpty = () => {
  return {
    type: types.RESET_OTP_CODE_TO_EMPTY
  }
}

const setOtpVerified = () => {
  return {
    type: types.SET_OTP_VERIFIED
  }
}
