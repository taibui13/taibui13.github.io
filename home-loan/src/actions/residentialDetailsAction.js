import * as types from './actionTypes';

//handle residential Details
export const handleTextInputChange = (data, field) => {
  return (dispatch) => {
    dispatch({
      type: types.RESIDENTIALDETAILS_TEXT_INPUT_CHANGE,
      value: data.value,
      field,
      isValid: data.isValid,
      errorMsg: data.errorMsg,
      isInitial: data.isInitial
    });
  };
}

export const handleIstoggled = (isToggled) => {
  return(dispatch) => {
    dispatch({
      type: types.RESIDENTIALDETAILS_IS_TOGGLED,
      isToggled : !isToggled
    })
  }
}

export const setResidentialDetailData = (obj) => {
  return {
    type: types.MYINFO_SET_RESIDENTIAL_DETAIL_DATA,
    propertyType: obj && obj.propertyType ? obj.propertyType : ''
  }
}

export const setMailingAddressData = (obj) => {
  return {
    type: types.MYINFO_SET_RESIDENTIAL_DETAIL_MAILING_DATA,
    country: obj && obj.country ? obj.country : '',
    propertyType: obj && obj.propertyType ? obj.propertyType : '',
    city: obj && obj.city ? obj.city : '',
    overseasAddress1: obj && obj.line1 ? obj.line1 : '',
    overseasAddress2: obj && obj.line2 ? obj.line2 : '',
    overseasAddress3: obj && obj.line3 ? obj.line3 : '',
    overseasAddress4: obj && obj.line4 ? obj.line4 : ''
  }
}


//choose item from dropdown
export const selectDropdownItem = (value, field, description) => {
  return (dispatch) => {
    dispatch({
      type: types.RESIDENTIALDETAILS_DROPDOWN_ITEM_SELECT,
      value,
      field,
      description
    })
  };
}

export const changeSearchInputValue = (searchValue, field) => {
  return (dispatch) => {
    dispatch({
      type: types.RESIDENTIALDETAILS_DROPDOWN_SEARCH_INPUT_CHANGE,
      searchValue,
      field
    });
  };
}

//handle dropdown focus
export const setDropdownFocusStatus = (isFocus, field) => {
  return (dispatch) => {
    dispatch({
      type: types.RESIDENTIALDETAILS_DROPDOWN_FOCUS,
      isFocus,
      field
    });
  };
}
