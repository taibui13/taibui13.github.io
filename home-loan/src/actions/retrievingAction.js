// import * as types from './actionTypes';
import { Config } from './../api/httpApi';
import { setErrorWithValue } from './applicationAction';


export const callCallbackURL = (redirectToErrorPage,redirectToSuccessfulPage, parameter) => {;
  return (dispatch) => {
    Config.callCallbackURL(parameter).then(response => {
      redirectToSuccessfulPage && redirectToSuccessfulPage(response)
    }).catch(e => {
      dispatch(setErrorWithValue("badRequest"));
      redirectToErrorPage && redirectToErrorPage();
    });
  };
}
