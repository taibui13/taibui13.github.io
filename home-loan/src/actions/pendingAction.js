import * as types from './actionTypes';

export const retrieveApplication = (handleToApplication) => {
  return (dispatch) => {
    // dispatch(setPreviousApplication());
    handleToApplication && handleToApplication();
  }
}
