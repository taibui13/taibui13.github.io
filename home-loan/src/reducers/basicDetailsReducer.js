import * as types from './../actions/actionTypes';

const initialState = {
  alias: '',
  hanYuPinYinName: '',
  hanYuPinYinAliasName: '',
  marriedName: '',
  residentialStatus: '',
  fullName: {
    name: 'fullName',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true
  },
  nric: {
    name: 'nric',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true
  },
  email: {
    name: 'email',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true
  },
  mobileNumber: {
    name: 'mobileNumber',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true
  },
  isUpdateMobileNumber: true,
  otpVerified: "N"
};

const basicDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.BASICDETAILS_HANDLE_TEXT_INPUT_CHANGE:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.value,
          isValid: action.isValid,
          errorMsg: action.errorMsg,
          isInitial: false
        }
      };

    case types.MYINFO_SET_BASIC_DETAIL_DATA:
      return {
        ...state,
        fullName: { ...state.fullName, value: action.fullName, isMyInfo: true, isInitial: false },
        nric: { ...state.nric, value: action.nric, isMyInfo: true, isInitial: false },
        email: { ...state.email, value: action.email, isMyInfo: true, isInitial: false },
        mobileNumber: { ...state.mobileNumber, value: action.mobileNumber, isMyInfo: true, isInitial: false },
        alias: action.alias,
        hanYuPinYinName: action.hanYuPinYinName,
        hanYuPinYinAliasName: action.hanYuPinYinAliasName,
        marriedName: action.marriedName,
        residentialStatus: action.residentialStatus,
        otpVerified: action.otpVerified
      };

    case types.SET_ERROR_MESSAGE_INPUT:
      return {
        ...state,
        [action.field]: {...state[action.field], errorMsg: action.errorMsg, isValid: false}
      };
    case types.BASIC_DETAILS_UPDATE_OBJECT:
      return {
        ...state,
        [action.obj.field]: action.obj.value
      }; 
    default:
      return state;
  }
}

export default basicDetailsReducer;
