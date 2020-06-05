import * as types from './actionTypes';

//handle personal details
export const handleTextInputChange = (data, field) => {
  return (dispatch, getState) => {
    dispatch({
      type: types.PERSONALDETAILS_TEXT_INPUT_CHANGE,
      value: data.value,
      field,
      isValid: data.isValid,
      errorMsg: data.errorMsg,
      isInitial: data.isInitial
    });
  };
}

//handle dropdown focus
export const setDropdownFocusStatus = (isFocus, field) => {
  return (dispatch) => {
    dispatch({
      type: types.PERSONALDETAILS_DROPDOWN_FOCUS,
      isFocus,
      field
    });
  };
}

//choose item from dropdown
export const selectDropdownItem = (value, description, field) => {
  return (dispatch) => {
    dispatch({
      type: types.PERSONALDETAILS_DROPDOWN_ITEM_SELECT,
      value,
      field,
      description
    })
  };
}

export const changeSearchInputValue = (searchValue, field) => {
  return (dispatch) => {
    dispatch({
      type: types.PERSONALDETAILS_DROPDOWN_SEARCH_INPUT_CHANGE,
      searchValue,
      field
    });
  };
}

export const setPersonalDetailData = (obj) => {
  return {
    type: types.MYINFO_SET_PERSONAL_DETAIL_DATA,
    dateOfBirth: obj && obj.dateOfBirth ? obj.dateOfBirth : '',
    gender: obj && obj.gender ? obj.gender : '',
    maritalStatus: obj && obj.maritalStatus ? obj.maritalStatus : '',
    educationLevel: obj && obj.educationLevel ? obj.educationLevel : '',
    nationality: obj && obj.nationality ? obj.nationality : '',
    countryOfBirth: obj && obj.countryOfBirth ? obj.countryOfBirth : '',
    race: obj && obj.race ? obj.race : '',
  }
}

export const changeGenderOption = (value) => {
  return {
    type: types.PERSONALDETAILS_CHANGE_GENDER_OPTION,
    value
  }
}

export const setPersonalDetailsGenderOptionError = (errorMsg) => {
  return {
    type: types.PERSONALDETAILS_SET_PERSONAL_GENDER_OPTION_ERROR,
    errorMsg
  }
}

export const setPreviousPersonalData = (obj) => {
  return {
    type: types.PERSONALDETAILS_PREVIOUS_DATA,
    countryOfResidence : obj && obj.countryOfResidence ? obj.countryOfResidence : 'SG',
    hasDualNationality: obj && obj.hasDualNationality ? obj.hasDualNationality : false,
    additionalLegalIdCountry: obj && obj.additionalLegalIdCountry ? obj.additionalLegalIdCountry : '',
    additionalLegalId: obj && obj.additionalLegalId ? obj.additionalLegalId : '',
    additionalLegalIdExpiryDate: obj && obj.additionalLegalIdExpiryDate ? obj.additionalLegalIdExpiryDate : '',
    additionalLegalIdIssueCountry: obj && obj.additionalLegalIdIssueCountry ? obj.additionalLegalIdIssueCountry : '',
  }
}

export const setToggleOption = (isToggled , field) => {
  return(dispatch) => {
    dispatch ({
      type: types.SET_TOGGLE_OPTION,
      field,
      isToggled : !isToggled
    })
  }
}
