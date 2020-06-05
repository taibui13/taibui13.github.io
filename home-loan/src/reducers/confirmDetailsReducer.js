import * as types from './../actions/actionTypes';

const initialState = {
  acknowledgement: {
    isToggled: false,
    isValid: true,
    errorMsg: ''
  }
}

const confirmDetailsReducer = (state = initialState, action) =>{
  switch (action.type) {
    case types.CONFIRMDETAILS_IS_TOGGLED:
      return {
        ...state,
        [action.field]: {...state[action.field], isToggled: action.isToggled, isValid: true, errorMsg: ''}
      };

    case types.CONFIRMDETAILS_SET_TOGGLE_ERROR_MESSAGE:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          isValid: false,
          errorMsg: action.errorMsg
        }
      };

    default:
      return state;
  }
}

export default confirmDetailsReducer;
