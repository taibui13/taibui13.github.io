import * as types from './actionTypes';
import { Address } from './../api/httpApi';
import { setErrorMessage } from './commonAction';

export const handleAddressInputChange = (data, field) => {
  return (dispatch, getState) => {
    dispatch({
      type: types.LOCAL_ADDRESS_INPUT_CHANGE,
      value: data.value,
      field,
      isValid: data.isValid,
      errorMsg: data.errorMsg,
      isInitial: data.isInitial
    });
  };
}

export const autoGetLocalAddress = (value, addressType, field) => {
  return (dispatch, getState) => {
    const postalCode = getState().localAddressInputReducer[field];
    const postCodeError = getState().commonReducer.appData.globalErrors.addressServiceDown;
    if (postalCode.isValid && postalCode.count < 5 && postalCode.value.length === 6) {
      //auto get and fill block, street and house no
      dispatch(isGettingLocalAddress(true, addressType));
      Address.getAddressByCode(value).then((res) => {
        if (res.status === 200) {
          const address = res.data;
          dispatch({
            type: types.LOCAL_ADDRESS_INPUT_AUTO_FILL_IN,
            addressType,
            street: address.streetAddress,
            block: address.blockNumber,
            building: address.buildingName,
            addressFormat: address.addressFormat,
            count: postalCode.count + 1
          });
        } else {
          const incrementCount = postalCode.count + 1;
          dispatch(autoFillInFailed(addressType, incrementCount));
        }
      }).catch(e => {
        if (e.response && e.response.status === 400) {
          const incrementCount = postalCode.count + 1;
          dispatch(autoFillInFailed(addressType, incrementCount));
        } else {
          dispatch(setErrorMessage(postCodeError));
          dispatch(addressServiceDown(addressType));
        }
      });
    } else if (postalCode.isValid && postalCode.count === 5) {
      dispatch(resetAutoFillInStatus(addressType));
    }
  }
}

const autoFillInFailed = (addressType, count) => {
  return {
    type: types.LOCAL_ADDRESS_INPUT_AUTO_FILL_IN_FAIL,
    addressType,
    count
  };
}

const resetAutoFillInStatus = (addressType) => {
  return {
    type: types.LOCAL_ADDRESS_INPUT_RESET_AUTO_FILL_IN_STATUS,
    addressType
  }
}

const addressServiceDown = (addressType) => {
  return {
    type: types.LOCAL_ADDRESS_INPUT_SERVICE_DOWN,
    addressType
  }
}

const isGettingLocalAddress = (isLoading, addressType) => {
  return {
    type: types.IS_GETTING_LOCAL_ADDRESS,
    isLoading,
    addressType
  };
}

export const setLocalAddressTextInputRequiredError = (field, errorMsg) => {
  return (dispatch) => {
    dispatch({
      type: types.LOCAL_ADDRESS_SET_TEXT_INPUT_REQUIRED_ERROR,
      errorMsg,
      field
    });
  };
}

export const setLocalAddressHomeData = (obj) => {
  return {
    type: types.LOCAL_ADDRESS_MYINFO_SET_DATA,
    homeStreet: obj && obj.street ? obj.street : '',
    homeBlock: obj && obj.block ? obj.block : '',
    homePostalCode: obj && obj.postalCode ? obj.postalCode : '',
    homeLevel: obj && obj.floor ? obj.floor : '',
    homeUnit: obj && obj.unitNo ? obj.unitNo : '',
    homeBuilding: obj && obj.building ? obj.building : ''
  }
}

export const setMailingAddressHomeData = (obj) => {
  return {
    type: types.MAILING_ADDRESS_MYINFO_SET_DATA,
    mailingStreet: obj && obj.street ? obj.street : '',
    mailingBlock: obj && obj.block ? obj.block : '',
    mailingPostalCode: obj && obj.postalCode ? obj.postalCode : '',
    mailingLevel: obj && obj.floor ? obj.floor : '',
    mailingUnit: obj && obj.unitNo ? obj.unitNo : '',
    mailingBuilding: obj && obj.building ? obj.building : ''
  }
}

//Set to not required
export const setToNotRequired = (field) =>{
  return (dispatch) => {
    dispatch({
      type: types.LOCAL_ADDRESS_SET_NOT_REQUIRED,
      field
    })
  };
}
