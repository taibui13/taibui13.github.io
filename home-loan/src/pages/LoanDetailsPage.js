import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import './../assets/css/slick.css';
import ButtonOption from './../components/ButtonOption/ButtonOption';
import MultipleButtonOption from './../components/MultipleButtonOption/MultipleButtonOption';
import Dropdown from './../components/Dropdown/Dropdown';
import RadioOption from './../components/RadioOption/RadioOption';
import TextInput from './../components/TextInput/TextInput';
import ToggleInput from './../components/ToggleInput/ToggleInput';
import PrimaryButton from './../components/PrimaryButton/PrimaryButton';
import { mapValueToDescription } from './../common/utils';
import moment from 'moment';
import { allowFutureDate } from './../api/httpApi';

import {
  setDropdownFocusStatus,
  selectDropdownItem,
  handleTextInputChange,
  changeButtonOptionValue,
  handleIstoggled,
  changeMultipleButtonOptionValue,
  deleteMultipleButtonOptionValue,
  setDateOfTop,
  changeRadioOptionValue
  // clearSliderError
} from './../actions/loanDetailsAction'

const responsive = [
  { breakpoint: 320,
    settings: {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1.1,
      slidesToScroll: 1
    }
  },
  { breakpoint: 414,
    settings: {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1.1,
      slidesToScroll: 1
    }
  },
  { breakpoint: 100000,
    settings: {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1
    }
  }
];

export class LoanDetailsPage extends Component {
  componentDidMount() {
    const {dispatch, applicationReducer} = this.props;
    const year = moment().year() + 2;

    if(!applicationReducer.isPreviousApplication) {
      dispatch(setDateOfTop(`01/01/${year}`));
    }
  }

    handleToPersonalDetails(){
      this.props.onContinue();
    }

    handleOnChange(data, field) {
      const { dispatch } = this.props;
      dispatch(handleTextInputChange(data, field));
    }

    handleButtonOptionClick(data, field) {
      const { dispatch } = this.props;
      dispatch(changeButtonOptionValue(data, field));
    }

    handleDropdownBlur(field) {
      const { dispatch } = this.props;
      dispatch(setDropdownFocusStatus(false, field));
    }

    handleDropdownFocus(field) {
      const { dispatch } = this.props;
      dispatch(setDropdownFocusStatus(true, field));
    }

    handleDropdownClick(data, field) {
      const { dispatch, loanDetailsReducer } = this.props;
      if (loanDetailsReducer[field].value === data.value) {
        return;
      }
      dispatch(selectDropdownItem(data.value, data.description, field));
    }

    handleOnClick(field, isToggled){
      const { dispatch } = this.props;
      dispatch(handleIstoggled(field , isToggled));
    }

    handleMulitpleSection(data, field) {
      const { dispatch } = this.props;
      dispatch(changeMultipleButtonOptionValue(data, field));
    }

    handleDeleteMulitpleSection(data, field) {
      const { dispatch } = this.props;
      dispatch(deleteMultipleButtonOptionValue(data, field));
    }

    handleRadioOptionClick(packageCode, description,  field) {
      const { dispatch} = this.props;
      dispatch(changeRadioOptionValue(packageCode, description, field));
    }

    renderSlideItems(items, packageCode) {
      const { commonReducer } = this.props;
      const labels = commonReducer.appData.loanDetails.loanPackage;
      const tmpArray = [];
      items.map((item, index) => {
        tmpArray.push(
          <div key={index}>
            <RadioOption
              inputID={`loanPackage${index}`}
              lengthOfItem={items.length}
              isSelected={item.loanPackageCode === packageCode}
              option={item}
              label={labels}
              colTitles={labels.colTitles}
              tableContent={item.businessTerms}
              onClick={(packageCode, description) => this.handleRadioOptionClick(packageCode, description, 'loanPackage')}
            />
          </div>
        );
        return tmpArray;
      });
      return tmpArray;
    }

    handlePackageOnClick(field){
      // const { dispatch, loanDetailsReducer } = this.props;
      // if( field === "loanPackage" && !loanDetailsReducer[field].isValid && !loanDetailsReducer[field].packageCode !== "" ){
      //   // dispatch(clearSliderError("loanPackage", true, ""));
      // }
    }
    render() {
      const { loanDetailsReducer, commonReducer } = this.props;
      const {
        loanPropertyType,
        propertyUsage,
        purchasePrice,
        dateOfTOP,
        loanAmount,
        disbursementYear,
        homeLoanOutstanding,
        isdirectPurchase,
        jointBorrower,
        jointBorrowerFullName,
        jointBorrowerNric,
        jointBorrowerEmail,
        jointBorrowerMobileNumber,
        sourceOfFundsMLR,
        sourceOfFundsDP,
        sourceOfWealth,
        loanType,
        loanPackage,
        filteredLoanPackageList
      } = loanDetailsReducer;

      const loanDetailsValue = commonReducer.appData.loanDetails;
      const labels = loanDetailsValue.labels;
      const inputValues = commonReducer.appData.inputValues ? commonReducer.appData.inputValues : '';
      const errorMsgList = commonReducer.appData.errorMsgs;
      const isProcessing = commonReducer.isProcessing;
      const propertyUsages = commonReducer.appData.optionInput.propertyUsage;
      const sourceOfFundsMLRList = commonReducer.appData.optionInput.sourceOfFundsMLR;
      const sourceOfFundsDPList = commonReducer.appData.optionInput.sourceOfFundsDP;
      const sourceOfWealthList = commonReducer.appData.optionInput.sourceOfWealth;

      const propertyTypeList = inputValues.propertyType;
      const loanTypeList = inputValues.loanType;
      const sliderError = loanDetailsValue.loanPackage.onOffLoanPackage && loanPackage.packageCode === "" && !loanPackage.isValid ? "slider-error" : "";

      const displayLoanPackage = filteredLoanPackageList.length > 0 && loanDetailsValue.loanPackage.onOffLoanPackage && loanPropertyType.value !== "" && loanType.value !== "";

      let yearLoanValidator = ["required", "yearNotBeforeYear|1900", "yearNotOverCurrentYear"]
      if(allowFutureDate && allowFutureDate === true) {
        yearLoanValidator = ["required", "yearNotBeforeYear|1900"]
      }

      return(
          <div className='uob-content' id='loanDetails-section'>
            <h1>{loanDetailsValue.title}</h1>
            <div className='uob-form-separator'/>
            <p className='uob-headline'>{loanDetailsValue.subtitle}</p>
            <div className='uob-input-separator'/>
              <Dropdown
                inputID='loanPropertyType'
                isFocus={loanPropertyType.isFocus}
                focusOutItem={true}
                label={labels.propertyType}
                value={loanPropertyType.value}
                isValid={loanPropertyType.isValid}
                errorMsg={loanPropertyType.errorMsg}
                dropdownItems={mapValueToDescription(propertyTypeList)}
                onBlur={this.handleDropdownBlur.bind(this, 'loanPropertyType')}
                onFocus={this.handleDropdownFocus.bind(this, 'loanPropertyType')}
                onClick={(data) => this.handleDropdownClick(data, 'loanPropertyType')}
                onSearchChange={(event) => this.handleOnSearchChange(event, 'loanPropertyType')}
                exampleLabels={labels.loanPropertyTypeEg}
              />

            <div className='uob-input-separator'/>
              <Dropdown
                inputID='loanType'
                isFocus={loanType.isFocus}
                focusOutItem={true}
                label={labels.loanType}
                value={loanType.value}
                isValid={loanType.isValid}
                errorMsg={loanType.errorMsg}
                dropdownItems={mapValueToDescription(loanTypeList)}
                onBlur={this.handleDropdownBlur.bind(this, 'loanType')}
                onFocus={this.handleDropdownFocus.bind(this, 'loanType')}
                onClick={(data) => this.handleDropdownClick(data, 'loanType')}
                onSearchChange={(event) => this.handleOnSearchChange(event, 'loanType')}
                exampleLabels={labels.loanTypeEg}
              />

            <div className='uob-input-separator'/>
              <ButtonOption
                inputID={"propertyUsage"}
                label={labels.propertyUsage}
                options={propertyUsages}
                value={propertyUsage.value}
                isValid={propertyUsage.isValid}
                errorMsg={propertyUsage.errorMsg}
                onClick={(data) => this.handleButtonOptionClick(data, 'propertyUsage')}
                exampleLabels={labels.propertyUsageEg}
              />

            { loanPropertyType.value === 'EC' &&
              <div className='uob-input-separator'>
                <TextInput
                  inputID='dateOfTOP'
                  isValid={dateOfTOP.isValid}
                  errorMsg={dateOfTOP.errorMsg}
                  label={labels.dateOfTOP}
                  value={dateOfTOP.value}
                  onChange={(data) => this.handleOnChange(data,'dateOfTOP')}
                  isDateFormat
                  validator={["required" , "checkDateFormat", "validateDate"]}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.dateOfTOPEg}
                />
              </div>
            }

            { (loanType.value === '0' || loanType.value === '1') &&
              <div className='uob-input-separator'>
                <TextInput
                  isDecimal
                  inputID='purchasePrice'
                  isValid={purchasePrice.isValid}
                  errorMsg={purchasePrice.errorMsg}
                  label={labels.purchasePrice}
                  value={purchasePrice.value}
                  onChange={(data) => this.handleOnChange(data,'purchasePrice')}
                  validator={["required", "isDecimal|9"]}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.purchasePriceEg}
                />
              </div>
            }

            {(loanType.value === '0' || loanType.value === '1') &&
              <div className='uob-input-separator'>
                <TextInput
                  isNumber
                  inputID='loanAmount'
                  isValid={loanAmount.isValid}
                  errorMsg={loanAmount.errorMsg}
                  label={labels.loanAmount}
                  isFocus={loanAmount.isFocus}
                  value={loanAmount.value}
                  onChange={(data) => this.handleOnChange(data,'loanAmount')}
                  validator={["required", "isNumber"]}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.loanAmountEg}
                />
              </div>
            }

            {(loanType.value === '2' || loanType.value === '3')  &&
              <div>
                <div className='uob-input-separator'/>
                <TextInput
                  isOnlyYYYY
                  inputID='disbursementYear'
                  isValid={disbursementYear.isValid}
                  errorMsg={disbursementYear.errorMsg}
                  label={labels.disbursementYear}
                  isFocus={disbursementYear.isFocus}
                  value={disbursementYear.value}
                  onChange={(data) => this.handleOnChange(data,'disbursementYear')}
                  validator={yearLoanValidator}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.disbursementYearEg}
                />

                <div className='uob-input-separator'/>
                <TextInput
                  isNumber
                  inputID='homeLoanOutstanding'
                  isValid={homeLoanOutstanding.isValid}
                  errorMsg={homeLoanOutstanding.errorMsg}
                  label={labels.homeLoanOutstanding}
                  isFocus={homeLoanOutstanding.isFocus}
                  value={homeLoanOutstanding.value}
                  onChange={(data) => this.handleOnChange(data,'homeLoanOutstanding')}
                  validator={["isNumber"]}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.homeLoanOutstandingEg}
                />
              </div>
            }

            { loanPropertyType.value === 'EC' &&
              <div className='uob-input-separator'>
                <ToggleInput
                  inputID={"isdirectPurchase"}
                  isValid={isdirectPurchase.isValid}
                  errorMsg={isdirectPurchase.errorMsg}
                  description={labels.directPurchase}
                  isToggled={isdirectPurchase.isToggled}
                  onClick={() => this.handleOnClick('isdirectPurchase', isdirectPurchase.isToggled )}
                  exampleLabels={labels.isdirectPurchaseEg}
                />
              </div>
            }

            <div className='uob-input-separator'/>
              <MultipleButtonOption
                inputID={"sourceOfFundsMLR"}
                label={labels.sourceOfFundsMLR}
                options={mapValueToDescription(sourceOfFundsMLRList)}
                value={sourceOfFundsMLR.value}
                isValid={sourceOfFundsMLR.isValid}
                errorMsg={sourceOfFundsMLR.errorMsg}
                onClick={(data) => this.handleMulitpleSection(data, 'sourceOfFundsMLR')}
                onClickDelete={(data) => this.handleDeleteMulitpleSection(data, 'sourceOfFundsMLR')}
                exampleLabels={labels.sourceOfFundsMLREg}
              />

            {(loanType.value === '0' || loanType.value === '1') &&
              <div>
                <div className='uob-input-separator'/>
                  <MultipleButtonOption
                    inputID={"sourceOfFundsDP"}
                    label={labels.sourceOfFundsDP}
                    options={mapValueToDescription(sourceOfFundsDPList)}
                    value={sourceOfFundsDP.value}
                    isValid={sourceOfFundsDP.isValid}
                    errorMsg={sourceOfFundsDP.errorMsg}
                    onClick={(data) => this.handleMulitpleSection(data, 'sourceOfFundsDP')}
                    onClickDelete={(data) => this.handleDeleteMulitpleSection(data, 'sourceOfFundsDP')}
                    exampleLabels={labels.sourceOfFundsDPEg}
                  />
              </div>
            }

            <div className='uob-input-separator'/>
              <MultipleButtonOption
                inputID={"sourceOfWealth"}
                lessThanThreecolumn={true}
                label={labels.sourceOfWealth}
                options={mapValueToDescription(sourceOfWealthList)}
                value={sourceOfWealth.value}
                isValid={sourceOfWealth.isValid}
                errorMsg={sourceOfWealth.errorMsg}
                onClick={(data) => this.handleMulitpleSection(data, 'sourceOfWealth')}
                onClickDelete={(data) => this.handleDeleteMulitpleSection(data, 'sourceOfWealth')}
                exampleLabels={labels.sourceOfWealthEg}
              />

              {
                displayLoanPackage && (
                  <div className='uob-input-separator'>
                    <p className='uob-headline'>{loanDetailsValue.loanPackage.title}</p>
                    <div className={`${sliderError}`} onClick={() => this.handlePackageOnClick("loanPackage")}>
                      <Slider responsive={responsive}>
                        {this.renderSlideItems(filteredLoanPackageList, loanPackage.packageCode)}
                      </Slider>
                    </div>
                    { loanPackage.errorMsg !== "" && <div className="package-error-text"> {loanPackage.errorMsg} </div>}
                    <div className='uob-input-separator'/>
                    <div className="uob-terms package-terms" dangerouslySetInnerHTML={{__html: loanDetailsValue.loanPackage.loanPackageTerms}}/>
                  </div>
                )
              }

            <div className='uob-input-separator'/>
              <ToggleInput
                inputID={"jointBorrower"}
                isValid={jointBorrower.isValid}
                errorMsg={jointBorrower.errorMsg}
                description={labels.jointBorrower}
                isToggled={jointBorrower.isToggled}
                onClick={() => this.handleOnClick('jointBorrower', jointBorrower.isToggled )}
                exampleLabels={labels.jointBorrowerEg}
              />

              <div className='uob-input-separator'/>
            { jointBorrower.isToggled &&
              <div>
                <div className='uob-input-white-board'>
                    <TextInput
                      inputID='jointBorrowerFullName'
                      isValid={jointBorrowerFullName.isValid}
                      errorMsg={jointBorrowerFullName.errorMsg}
                      label={labels.fullName}
                      value={jointBorrowerFullName.value}
                      onChange={(data) => this.handleOnChange(data,'jointBorrowerFullName')}
                      validator={["required", "isFullName", "maxSize|70"]}
                      errorMsgList={errorMsgList}
                      exampleLabels={labels.jointBorrowerFullNameEg}
                    />

                  <div className='uob-input-white-board-line-separator ' />
                    <TextInput
                      isUpperCase
                      inputID='jointBorrowerNric'
                      isValid={jointBorrowerNric.isValid}
                      errorMsg={jointBorrowerNric.errorMsg}
                      label={labels.nric}
                      value={jointBorrowerNric.value}
                      onChange={(data) => this.handleOnChange(data,'jointBorrowerNric')}
                      validator={["required", "isNRIC", "maxSize|15"]}
                      errorMsgList={errorMsgList}
                      exampleLabels={labels.jointBorrowerNricEg}
                    />

                 <div className='uob-input-white-board-line-separator ' />
                    <TextInput
                      inputID='jointBorrowerEmail'
                      isValid={jointBorrowerEmail.isValid}
                      errorMsg={jointBorrowerEmail.errorMsg}
                      label={labels.emailAddress}
                      value={jointBorrowerEmail.value}
                      onChange={(data) => this.handleOnChange(data,'jointBorrowerEmail')}
                      validator={["required", "isEmail" , "maxSize|30"]}
                      errorMsgList={errorMsgList}
                      exampleLabels={labels.jointBorrowerEmailEg}
                    />

                  <div className='uob-input-white-board-line-separator ' />
                    <TextInput
                      type='Phone'
                      inputID='jointBorrowerMobileNumber'
                      isValid={jointBorrowerMobileNumber.isValid}
                      isFocus={true}
                      errorMsg={jointBorrowerMobileNumber.errorMsg}
                      label={labels.mobileNumber}
                      value={jointBorrowerMobileNumber.value}
                      onChange={(data) => this.handleOnChange(data,'jointBorrowerMobileNumber')}
                      validator={["required", "isMobileNumber"]}
                      errorMsgList={errorMsgList}
                      countryCode={'+65'}
                      exampleLabels={labels.jointBorrowerMobileNumberEg}
                    />
                  </div>
                  <div className='uob-input-separator'/>
                  { loanDetailsValue.jointTerms !== '' &&
                    <div className="uob-terms" dangerouslySetInnerHTML={{__html: loanDetailsValue.jointTerms}}/>
                  }
                </div>
            }


            <div className='uob-input-separator'/>
              { loanDetailsValue.terms !== '' &&
                <div className="uob-terms" dangerouslySetInnerHTML={{__html: loanDetailsValue.terms}}/>
              }

            {
              commonReducer.currentSection === 'loanDetails' &&
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
  const { loanDetailsReducer, commonReducer } = state;
  return { loanDetailsReducer, commonReducer };
}

export default connect(mapStateToProps)(LoanDetailsPage);
