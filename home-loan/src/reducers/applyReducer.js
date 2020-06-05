import * as types from './../actions/actionTypes';

const initialState = {
  link: ''
};

const verifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.STORE_REDIRECT_URL:
      return {
        ...state,
        link: action.link
      }

    default:
      return state;
  }
}

export default verifyReducer;
