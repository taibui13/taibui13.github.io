import { combineReducers } from 'redux';
import commonReducer from './commonReducer';
import basicDetailsReducer from './basicDetailsReducer';
import localAddressInputReducer from './localAddressInputReducer';
import personalDetailsReducer from './personalDetailsReducer';
import loanDetailsReducer from './loanDetailsReducer';
import verifyReducer from './verifyReducer';
import residentialDetailsReducer from './residentialDetailsReducer';
import workDetailsReducer from './workDetailsReducer';
import uploadDocumentsReducer from './uploadDocumentsReducer';
import confirmDetailsReducer from './confirmDetailsReducer';
import applicationReducer from './applicationReducer';
import applyReducer from './applyReducer';
import otpReducer from './otpReducer';

export default combineReducers({
    commonReducer,
    localAddressInputReducer,
    basicDetailsReducer,
    personalDetailsReducer,
    loanDetailsReducer,
    verifyReducer,
    residentialDetailsReducer,
    workDetailsReducer,
    uploadDocumentsReducer,
    confirmDetailsReducer,
    applicationReducer,
    applyReducer,
    otpReducer
});
