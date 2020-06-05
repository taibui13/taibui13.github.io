import * as types from './../actions/actionTypes';

const initialState = {
  isPreviousApplication: false,
  serivceUnavailale: false,
  linkExpired: false,
  identifier: ''
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_IS_PREVIOUS_APPLICATION:
      return {
        ...state,
        isPreviousApplication: true
      };

    case types.SET_IDENTIFIER:
      return {
        ...state,
        identifier: action.identifier
      };

    default:
      return state;
  }
}

export default homeReducer;
