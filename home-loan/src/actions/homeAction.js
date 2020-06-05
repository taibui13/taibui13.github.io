import * as types from './actionTypes';

export const retrieveApplication = (handleToApplication) => {
  return (dispatch) => {
    // dispatch(setPreviousApplication());
    handleToApplication && handleToApplication();
  }
}

export const setPreviousApplication = () => {
  return ( dispatch ) => {
    dispatch({
      type : types.SET_IS_PREVIOUS_APPLICATION
    })
  }
}

export const setIdentifier = (identifier) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_IDENTIFIER,
      identifier
    })
  }
}
