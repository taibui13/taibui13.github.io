import * as types from './actionTypes';

export const handleTextInputChange = (data, field) => {
  return (dispatch, getState) => {
    dispatch({
      type: types.BASICDETAILS_HANDLE_TEXT_INPUT_CHANGE,
      value: data.value,
      field,
      isValid: data.isValid,
      errorMsg: data.errorMsg,
      isInitial: data.isInitial
    });
  };
}

export const setBasicDetailData = (applicant) => {
  const obj = (applicant && applicant.basicInfo) || {};
  return {
    type: types.MYINFO_SET_BASIC_DETAIL_DATA,
    fullName: obj && obj.names.principalName ? obj.names.principalName : '',
    nric: obj && obj.idDetails.legalId ? obj.idDetails.legalId : '',
    email: obj && obj.emailAddress ? obj.emailAddress : '',
    mobileNumber: obj && obj.mobileNumber ? obj.mobileNumber : '',
    alias: (obj && obj.names && obj.names.alias) ? obj.names.alias : '',
    hanYuPinYinName: (obj && obj.names && obj.names.hanYuPinYinName) ? obj.names.hanYuPinYinName : '',
    hanYuPinYinAliasName: (obj && obj.names && obj.names.hanYuPinYinAliasName) ? obj.names.hanYuPinYinAliasName : '',
    marriedName: (obj && obj.names && obj.names.marriedName) ? obj.names.marriedName : '',
    residentialStatus: obj && obj.residentialStatus ? obj.residentialStatus : '',
    otpVerified: applicant && applicant.otpVerified ? applicant.otpVerified : 'N'
  }
}
