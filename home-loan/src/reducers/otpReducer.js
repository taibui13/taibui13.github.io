import * as types from './../actions/actionTypes';

const initialState = {
  isCountingDown: true,
  prefix: '',
  requestIdentity: '',
  code: '',
  otpTriedCount: 0,
  isLoading: false,
  isVerified: false
};

const otpReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.OTP_SET_COUNT_DOWN_STATUS:
      return { ...state, isCountingDown: action.status };

    case types.OTP_SET_PREFIX:
      return { ...state, prefix: action.prefix, requestIdentity: action.requestIdentity };

    case types.OTP_SET_TRIED_COUNT:
      return { ...state, otpTriedCount: action.otpTriedCount };

    case types.OTP_INPUT_CHANGE:
      return { ...state, code: action.code };

    case types.OTP_IS_SENDING_OTP:
      return { ...state, isLoading: action.status };

    case types.RESET_OTP_CODE_TO_EMPTY:
      return { ...state, code: '' };

    case types.SET_OTP_VERIFIED:
      return {...state, isVerified: true};

    default:
      return state;
  }
}

export default otpReducer;
