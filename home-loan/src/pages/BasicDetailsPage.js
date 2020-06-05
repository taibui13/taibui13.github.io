import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInput from './../components/TextInput/TextInput';
import PrimaryButton from './../components/PrimaryButton/PrimaryButton';
import { handleTextInputChange } from './../actions/basicDetailsAction';
import { setErrorMessage, updateObject } from './../actions/commonAction';
import * as types from '../actions/actionTypes';
import {validateInfor, gotoPage} from '../common/utils';
import {checkEmail, validatePhoneNumber} from '../common/validations';
import {COUNTRY_CODE} from '../common/contant';

export class BasicDetailsPage extends Component {

  constructor(props) {
    super(props);
    this.invalidNumber = true;
  }

  componentWillMount() {
    this.countryCode = COUNTRY_CODE.SINGAPORE;
    const obj = validateInfor(this.props);
    if (!obj.isValid) {
      gotoPage(this.props, obj.errorCode);
    }
  }

  componentDidMount() {
    this.validateMobile();
    this.validateEmail();
  }

  validateEmail() {
    const { commonReducer: {appData, isMyInfoFlow}, basicDetailsReducer: {email}, dispatch } = this.props;
    if (isMyInfoFlow) {
      const obj = checkEmail(email.value);
      if (!obj.status) {
        const errMsg = appData.errorMsgs[obj.errorMsg];
        dispatch(handleTextInputChange({value: email.value, isValid: false, errorMsg: errMsg, isInitial: false}, email.name));
      }
    }
  }

  validateMobile() {
    const { commonReducer: {isMyInfoFlow, appData}, basicDetailsReducer: {mobileNumber, otpVerified, isUpdateMobileNumber}, dispatch } = this.props;
    if (isMyInfoFlow) {
      const obj = validatePhoneNumber(mobileNumber.value, COUNTRY_CODE.SINGAPORE);
      if (!obj.status) {
        this.invalidNumber = false;
        const errMsg = appData.errorMsgs[obj.errorMsg];
        this.countryCode = obj.countryCode;
        const mobile = mobileNumber.value.includes("+") ? mobileNumber.value.substr(3) : mobileNumber.value;
        dispatch(updateObject(types.BASIC_DETAILS_UPDATE_OBJECT, {field: Object.keys({isUpdateMobileNumber})[0], value: false}));
        dispatch(updateObject(types.BASIC_DETAILS_UPDATE_OBJECT, {field: Object.keys({otpVerified})[0], value: "Y"}));
        dispatch(handleTextInputChange({value: mobile, isValid: false, errorMsg: errMsg, isInitial: false}, mobileNumber.name));
      }
    }
    if (!isMyInfoFlow) {
      dispatch(updateObject(types.BASIC_DETAILS_UPDATE_OBJECT, {field: Object.keys({isUpdateMobileNumber})[0], value: false}));
    }

    if (otpVerified === "Y" && validatePhoneNumber(mobileNumber.value, COUNTRY_CODE.SINGAPORE).status) {
      const mobile = mobileNumber.value.includes("+") ? mobileNumber.value.substr(3) : mobileNumber.value;
      dispatch(updateObject(types.BASIC_DETAILS_UPDATE_OBJECT, {field: Object.keys({isUpdateMobileNumber})[0], value: false}));
      dispatch(handleTextInputChange({value: mobile, isValid: true, errorMsg: "", isInitial: false}, mobileNumber.name));
    }
  }

  handleToPersonalDetails(){
      const { commonReducer: {isMyInfoFlow}, dispatch, basicDetailsReducer: {isUpdateMobileNumber} } = this.props;
      let nextStep = "OTP"; 
      if (isMyInfoFlow && this.invalidNumber) {
        nextStep = "personalDetails";
      }
      if (isMyInfoFlow && !isUpdateMobileNumber) {
        dispatch(setErrorMessage("", 15));
      }
      this.props.onContinue(nextStep);
    }

    handleOnChangePhoneNumber(data, field) {
      this.countryCode = COUNTRY_CODE.SINGAPORE;
      this.handleOnChange(data, field);
    }

    handleOnChange(data, field) {
      const { dispatch } = this.props;
      dispatch(handleTextInputChange(data, field));
    }

    disableMobile() {
      const { basicDetailsReducer: { otpVerified }, commonReducer } = this.props;
      let isDisabled = (['basicDetails', 'otpPage'].includes(commonReducer.currentSection)) ? false : true;
      if (otpVerified === "Y" &&  this.invalidNumber) {
        isDisabled = true;
      }
      return isDisabled;
    }

    render() {
      const { basicDetailsReducer, commonReducer } = this.props;
      const {
        fullName,
        nric,
        email,
        mobileNumber,
        hanYuPinYinName,
        alias,
        hanYuPinYinAliasName,
        marriedName,
        residentialStatus,
        isUpdateMobileNumber,
      } = basicDetailsReducer;

      const readOnlyFields = commonReducer.appData.myInfoReadonlyFields;
      const isProcessing = commonReducer.isProcessing;
      const basicDetailsValue = commonReducer.appData.basicDetails;
      const labels = basicDetailsValue.labels;
      const inputValues = commonReducer.appData.inputValues ? commonReducer.appData.inputValues : '';

      const errorMsgList = commonReducer.appData.errorMsgs;

      const isReadOnlyField = (field) => {
        const isReadField = readOnlyFields[field] ? readOnlyFields[field] : false;
        return isReadField;
      }

      const isDisabled = (['basicDetails', 'otpPage'].includes(commonReducer.currentSection)) ? false : true;
      const getResidentialStatusLabel = () => {
          const rs = inputValues.residentialStatus[residentialStatus];
          return rs ? rs : '';
      };

      const otherNames = () => {
        const tmpArray = [];
        if(hanYuPinYinName !== '') tmpArray.push(<div key='key1' className='basicInfoOtherNames-items'>{hanYuPinYinName}</div>);
        if(hanYuPinYinAliasName !== '') tmpArray.push(<div key='key2' className='basicInfoOtherNames-items'>{hanYuPinYinAliasName}</div>);
        if(alias !== '') tmpArray.push(<div key='key3' className='basicInfoOtherNames-items'>{alias}</div>);
        if(marriedName !== '') tmpArray.push(<div key='key4' className='basicInfoOtherNames-items'>{marriedName}</div>);
        return tmpArray;
      }
      return(
          <div className='uob-content' id='basicDetails-section'>

            <h1>{basicDetailsValue.title}</h1>
            <div className='uob-form-separator'/>
            <p className='uob-headline'>{basicDetailsValue.subtitle}</p>
            <div className='uob-input-separator'/>
              <TextInput
                  inputID='fullName'
                  isReadOnly={isReadOnlyField('fullName')}
                  label={labels.fullName}
                  value={fullName.value}
                  errorMsg={fullName.errorMsg}
                  onChange={(data) => this.handleOnChange(data,'fullName')}
                  isValid={fullName.isValid}
                  validator={["required", "isFullName", "maxSize|70"]}
                  isDisabled={isDisabled}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.fullNameEg}
              />
              {otherNames().length > 0 && <div className='basicInfoOtherNames'>{otherNames()}</div>}

            <div className='uob-input-separator'/>
              <TextInput
                inputID='nric'
                isReadOnly={isReadOnlyField('nric')}
                label={labels.nric}
                value={nric.value}
                errorMsg={nric.errorMsg}
                onChange={(data) => this.handleOnChange(data,'nric')}
                isValid={nric.isValid}
                isUpperCase
                validator={["required", "isNRIC"]}
                isDisabled={isDisabled}
                errorMsgList={errorMsgList}
                exampleLabels={labels.nricEg}
              />
              {getResidentialStatusLabel() !== '' && <div className='basicInfoOtherNames'>{getResidentialStatusLabel()}</div>}

            <div className='uob-input-separator'/>
               <TextInput
                  inputID='email'
                  isReadOnly={isReadOnlyField('email')}
                  label={labels.emailAddress}
                  value={email.value}
                  errorMsg={email.errorMsg}
                  onChange={(data) => this.handleOnChange(data,'email')}
                  isValid={email.isValid}
                  validator={["required", "isEmail", "maxSize|30"]}
                  isDisabled={isDisabled}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.emailEg}
                />

            <div className='uob-input-separator'/>
                <TextInput
                  type='Phone'
                  inputID='mobileNumber'
                  isReadOnly={(isUpdateMobileNumber)}
                  label={labels.mobileNumber}
                  value={`${mobileNumber.value}`}
                  errorMsg={mobileNumber.errorMsg}
                  onChange={(data) => this.handleOnChangePhoneNumber(data,'mobileNumber')}
                  isValid={mobileNumber.isValid}
                  validator={["required", "isMobileNumber"]}
                  isFocus={true}
                  isFlag={true}
                  countryCode={this.countryCode}
                  isDisabled={this.disableMobile()}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.mobileNumberEg}
                />

            <div className='uob-input-separator'/>
            { basicDetailsValue.terms !== '' &&
                <div className="uob-terms" dangerouslySetInnerHTML={{__html: basicDetailsValue.terms}}/>
            }

            {
              commonReducer.currentSection === 'basicDetails' &&
                <div className='uob-input-separator'>
                  <PrimaryButton
                    label={labels.continueButton}
                    onClick={this.handleToPersonalDetails.bind(this)}
                    isLoading={isProcessing}
                  />
                </div>
            }
          </div>
      )
    }
}

const mapStateToProps = (state) => {
  const { basicDetailsReducer, commonReducer } = state;
  return { basicDetailsReducer, commonReducer };
}

export default connect(mapStateToProps)(BasicDetailsPage);
