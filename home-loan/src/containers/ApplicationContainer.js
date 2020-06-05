import React, { Component } from 'react';
import { connect } from 'react-redux';
import WrapContainer from './WrapContainer';
import PendingPage from './../pages/PendingPage';
import ThankYouPage from './../pages/ThankYouPage';
import ErrorMessagePage from './../pages/ErrorMessagePage';
import UploadDocumentsPage from './../pages/UploadDocumentsPage';
import ConfirmDetailsPage from './../pages/ConfirmDetailsPage';
import BasicDetailsPage from './../pages/BasicDetailsPage';
import LoanDetailsPage from './../pages/LoanDetailsPage';
import PersonalDetailsPage from './../pages/PersonalDetailsPage';
import ResidentialDetailsPage from './../pages/ResidentialDetailsPage';
import WorkDetailsPage from './../pages/WorkDetailsPage';
import OtpPage from './../pages/OtpPage';
import Loader from './../components/Loader/Loader';
import { handleErrorMessage, scrollBackToSection, scrollToSection, setErrorMessage, scrollToElement } from './../actions/commonAction';
import { setLoanPackageRequired } from './../actions/loanDetailsAction';
import { dispatchErrorMsg, setShowUploadDocument } from './../actions/uploadDocumentsAction';
import { submitApplication } from './../actions/confirmDetailsAction';
import { sendOtp } from './../actions/otpAction';
import { retrieveMyInfoDetails, submitPartialApplication, retrieveApplicationId } from './../actions/applicationAction';
import { sendDataToSparkline, getURLParameter } from './../common/utils';

class ApplicationContainer extends Component {

  componentWillMount() {
    const { dispatch } = this.props;
    const parameter = this.props.location.search;
    dispatch(retrieveMyInfoDetails(() => this.redirectToErrorPage() , parameter));
  }

  redirectToErrorPage(){
    const { commonReducer, applicationReducer: {errorCode, error} } = this.props;
    let parameter = "";
    let code = errorCode;
    let subError = "";
    if (commonReducer.parameter) {
      parameter = '&' + (commonReducer.parameter).substring(1)
    };
    if (error && error.errorCode) {
      code = error.errorCode;
      subError = error.errorMsg;
    }
    this.props.history.push({ pathname : "error", search :  "code=" + code + parameter, state: {subError: subError} });
  }

  checkisValidFields(fields) {
    const { dispatch } = this.props;
    let errorCount = 0;
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].isValid) {
        const fieldError = fields.find(x => x.isValid === false);
        dispatch(scrollToElement(fieldError.name))
        errorCount++;
      }
    }
    if (errorCount > 0) {
      return false;
    }
    return true;
  }

  checkEmptyFields(fields, errorMsg, action) {
    const { dispatch } = this.props;
    let errorCount = 0;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].value === "" ) {
        dispatch(action(fields[i].name, errorMsg));
        const fieldError = fields.find(x => x.value === '');
        dispatch(scrollToElement(fieldError.name))
        errorCount++;
      }
    }
    if (errorCount > 0) {
      return false;
    }
    return true;
  }

  checkArrayEmptyFields(fields, errorMsg, action) {
    const { dispatch } = this.props;
    let errorCount = 0;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].value.length < 1) {
        dispatch(action(fields[i].name, errorMsg));
        const fieldError = fields.find(x => x.value.length < 1);
        dispatch(scrollToElement(fieldError.name));
        errorCount++;
      }
    }
    if (errorCount > 0) {
      return false;
    }
    return true;
  }

  isBasicDetailsPassChecking() {
    const { basicDetailsReducer, commonReducer } = this.props;
    const { email, mobileNumber} = basicDetailsReducer;
    const errorMsgs = commonReducer.appData.errorMsgs;
    const requiredMsg = errorMsgs.fieldEmpty;

    if (!this.checkEmptyFields([email], requiredMsg, handleErrorMessage)) {
       return;
    }

    if(!email.isValid || email.value === '') {
      return;
    }
    if(!mobileNumber.isValid) {
      return;
    }

    return true;
  }

  handleToLoanDetails() {
    const { dispatch } = this.props;
    if (!this.isBasicDetailsPassChecking()) {
      return;
    }
    this.handleTracking("basicDetails");
    this.handleSubmitPartialApplication();
    dispatch(scrollToSection('loanDetails'));
  }

  isLoanDetailsPassChecking(){
    const { dispatch, loanDetailsReducer, basicDetailsReducer, commonReducer } = this.props;
    const {
      loanPropertyType,
      propertyUsage,
      purchasePrice,
      dateOfTOP,
      loanAmount,
      homeLoanOutstanding,
      disbursementYear,
      jointBorrower,
      jointBorrowerFullName,
      jointBorrowerNric,
      jointBorrowerEmail,
      jointBorrowerMobileNumber,
      sourceOfWealth,
      sourceOfFundsDP,
      sourceOfFundsMLR,
      loanType,
      loanPackage,
      filteredLoanPackageList
    } = loanDetailsReducer;

    const { nric, mobileNumber } = basicDetailsReducer;
    let errorCount = 0;
    const errorMsgs = commonReducer.appData.errorMsgs;
    const requiredMsg = errorMsgs.fieldEmpty;
    const loanPackageRequired = commonReducer.appData.loanDetails.loanPackage.loanPackageRequired;
    const onOffLoanPackage = commonReducer.appData.loanDetails.loanPackage.onOffLoanPackage;

    if (jointBorrower.isToggled){
      if (!this.checkEmptyFields([jointBorrowerFullName, jointBorrowerNric, jointBorrowerEmail, jointBorrowerMobileNumber], requiredMsg, handleErrorMessage )) {
        errorCount++ ;
      }

      if (nric.value === jointBorrowerNric.value || mobileNumber.value.replace(/ +/g, "") === jointBorrowerMobileNumber.value.replace(/ +/g, "")) {
        const globalErrors = commonReducer.appData.globalErrors;
        dispatch(setErrorMessage(globalErrors.sameApplicantAndJointApplicant));
        errorCount++ ;
      }

      if(!this.checkisValidFields([jointBorrowerNric, jointBorrowerMobileNumber, jointBorrowerFullName])){
        errorCount++;
      }
    }

    if(loanType.value === '0' || loanType.value === '1'){
      if (!this.checkEmptyFields([purchasePrice, loanAmount, sourceOfFundsDP], requiredMsg, handleErrorMessage )) {
        errorCount++ ;
      }

      if (!this.checkArrayEmptyFields([sourceOfFundsDP], requiredMsg, handleErrorMessage )) {
        errorCount++ ;
      }

      if(!this.checkisValidFields([purchasePrice, loanAmount, sourceOfFundsDP])){
        errorCount++;
      }
    }

    if (loanType.value === '2' || loanType.value === '3') {
      if (!this.checkEmptyFields([disbursementYear, homeLoanOutstanding], requiredMsg, handleErrorMessage )) {
        errorCount++ ;
      }

      if(!this.checkisValidFields([disbursementYear, homeLoanOutstanding])){
        errorCount++;
      }
    }

    if (!this.checkEmptyFields([loanPropertyType, loanType,  propertyUsage], requiredMsg, handleErrorMessage )) {
      errorCount++ ;
    }

    if (!this.checkArrayEmptyFields([sourceOfFundsMLR, sourceOfWealth], requiredMsg, handleErrorMessage )) {
      errorCount++ ;
    }

    if (loanPropertyType.value === 'EC'){
      if (!this.checkEmptyFields([dateOfTOP], requiredMsg, handleErrorMessage )) {
        errorCount++ ;
      }

      if (!this.checkisValidFields([dateOfTOP], requiredMsg, handleErrorMessage )) {
        errorCount++ ;
      }
    }

    if(!this.checkisValidFields([loanType, loanPropertyType, sourceOfFundsMLR, sourceOfWealth])){
      errorCount++;
    }

    if (onOffLoanPackage && filteredLoanPackageList.length > 0  && (loanPackage.packageCode === "" || !loanPackage.isValid )) {
      dispatch(setLoanPackageRequired("loanPackage", false, loanPackageRequired));
      errorCount ++;
    }

    if (errorCount > 0) {
      return false;
    }

    return true;
  }

  handleToPersonalDetails() {
    const { dispatch } = this.props;
    if (!this.isBasicDetailsPassChecking()) {
      dispatch(scrollBackToSection('basicDetails'));
      return false;
    }

    if (!this.isLoanDetailsPassChecking()) {
      return;
    }

    this.handleTracking("loanDetails");
    this.handleSubmitPartialApplication();
    dispatch(scrollToSection('personalDetails'));
  }

  isPersonalDetailsPassChecking(){
    const { personalDetailsReducer, commonReducer } = this.props;
    const {
      dateOfBirth,
      gender,
      maritalStatus,
      educationLevel,
      race,
      nationality,
      countryOfBirth,
      countryOfResidence,
      hasDualNationality,
      additionalLegalIdCountry,
      additionalLegalId,
      additionalLegalIdExpiryDate,
      additionalLegalIdIssueCountry,
    } = personalDetailsReducer;

    const errorMsgs = commonReducer.appData.errorMsgs;
    const requiredMsg = errorMsgs.fieldEmpty;
    let errorCount = 0;

    if (!this.checkEmptyFields([dateOfBirth, gender, maritalStatus, educationLevel, race, nationality, countryOfBirth, countryOfResidence], requiredMsg, handleErrorMessage )) {
      errorCount++ ;
    }

    if(!this.checkisValidFields([dateOfBirth, gender, maritalStatus, educationLevel, race, nationality, countryOfBirth, countryOfResidence])){
      errorCount++;
    }

    if (hasDualNationality.isToggled) {
      if (!this.checkEmptyFields([additionalLegalIdCountry, additionalLegalId, additionalLegalIdExpiryDate, additionalLegalIdIssueCountry], requiredMsg, handleErrorMessage )) {
        errorCount++ ;
      }

      if(!this.checkisValidFields([additionalLegalIdCountry, additionalLegalId, additionalLegalIdExpiryDate, additionalLegalIdIssueCountry])){
        errorCount++;
      }


    }

    if (errorCount > 0) {
      return false;
    }

    return true;
  }

  handleToResidentialDetails() {
    const { dispatch } = this.props;
    if (!this.isBasicDetailsPassChecking()) {
      dispatch(scrollBackToSection('basicDetails'));
      return false;
    }

    if (!this.isLoanDetailsPassChecking()) {
      dispatch(scrollBackToSection('loanDetails'));
      return;
    }

    if (!this.isPersonalDetailsPassChecking()) {
      return;
    }
    this.handleTracking("personalDetails");
    this.handleSubmitPartialApplication();
    dispatch(scrollToSection('residentialDetails'));
  }

  isResidentialDetailsPassChecking(){
    const { dispatch, residentialDetailsReducer, localAddressInputReducer, commonReducer } = this.props;
    const {
      homePostalCode,
      homeBlock,
      homeStreet,
      homeLevel,
      homeUnit,
      mailingPostalCode,
      mailingBlock,
      mailingStreet,
      mailingLevel,
      mailingUnit
    } = localAddressInputReducer;

    const {
      propertyType,
      mailingAddress,
      country,
      overseasAddress1,
      city,
      mailingPropertyType
    } = residentialDetailsReducer;

    const errorMsgs = commonReducer.appData.errorMsgs;
    const requiredMsg = errorMsgs.fieldEmpty;
    let errorCount = 0;
    const notRequiredUnitLevel = propertyType.value !== 'BG' && propertyType.value !== 'SM' && propertyType.value !== 'TE';
    const requiredUnitLevelMailing = mailingPropertyType.value !== 'BG' && mailingPropertyType.value !== 'SM' && mailingPropertyType.value !== 'TE';
    //Residential
    if (!this.checkEmptyFields([homePostalCode, homeBlock, homeStreet], requiredMsg, handleErrorMessage )) {
      errorCount++ ;
    }

    if (!this.checkisValidFields([homePostalCode, homeBlock, homeStreet])) {
      errorCount++ ;
    }

    if ( notRequiredUnitLevel && !this.checkEmptyFields([homeLevel,homeUnit], requiredMsg, handleErrorMessage)) {
      errorCount++;
    }

    if (notRequiredUnitLevel && !this.checkisValidFields([homeLevel, homeUnit])) {
      errorCount++ ;
    }

    //Mailing
    if (mailingAddress.isToggled) {
      if (!this.checkEmptyFields([country], requiredMsg, handleErrorMessage )) {
        errorCount++ ;
      }

      if (!country.isValid) {
        errorCount++;
      }

      if (country.value === 'SG'){
        if ( requiredUnitLevelMailing && !this.checkEmptyFields([mailingUnit,mailingLevel], requiredMsg, handleErrorMessage)) {
          errorCount++;
        }

        if ( requiredUnitLevelMailing && !this.checkisValidFields([mailingUnit,mailingLevel])) {
          errorCount++;
        }

        if (!this.checkEmptyFields([mailingPostalCode, mailingBlock, mailingStreet], requiredMsg, handleErrorMessage)) {
          errorCount++;
        }

        if (!this.checkisValidFields([mailingPostalCode, mailingBlock, mailingStreet])) {
          errorCount++;
        }

      } else {
        if (!this.checkEmptyFields([overseasAddress1, city], requiredMsg, handleErrorMessage )) {
          errorCount++ ;
        }

        if (!this.checkisValidFields([overseasAddress1, city])) {
          errorCount++ ;
        }
      }
    }

    if (mailingAddress.isToggled && country.value === 'SG' &&
        homePostalCode.value === mailingPostalCode.value &&
        homeLevel.value === mailingLevel.value &&
        homeUnit.value === mailingUnit.value
    ) {
        const globalErrors = commonReducer.appData.globalErrors;
        dispatch(setErrorMessage(globalErrors.sameResidentialAndMailingAddress));
        return false;
    }

    if (errorCount > 0) {
      return false;
    }

    return true;
  }

  handleToWorkDetails() {
    const { dispatch } = this.props;
    if (!this.isBasicDetailsPassChecking()) {
      dispatch(scrollBackToSection('basicDetails'));
      return false;
    }

    if (!this.isLoanDetailsPassChecking()) {
      dispatch(scrollBackToSection('loanDetails'));
      return false;
    }

    if (!this.isPersonalDetailsPassChecking()) {
      dispatch(scrollBackToSection('personalDetails'));
      return false;
    }

    if (!this.isResidentialDetailsPassChecking()) {
      return;
    }
    this.handleTracking("residentialDetails");
    this.handleSubmitPartialApplication();
    dispatch(scrollToSection('workDetails'));
  }

  handleSubmitPartialApplication () {
  const { dispatch, applicationReducer } = this.props;
  const applicationId = applicationReducer.applicationID;
  const dataObj = this.getDataForSubmission();
  dispatch(submitPartialApplication(dataObj, applicationId, () => this.redirectToErrorPage()));
  }


  isWorkDetailsPassChecking() {
    const { dispatch, workDetailsReducer, commonReducer } = this.props;
    const {
      natureOfEmployment,
      jobTitle,
      nameOfEmployer,
      industry,
      lengthOfEmploymentYears,
      lengthOfEmploymentMonths,
      nameOfPreviousCompany,
      lengthOfPreviousEmploymentYears,
      lengthOfPreviousEmploymentMonths,
      previousJobTitle,
      previousIndustry,
      monthlyFixedIncome,
      monthlyVariableIncome,
      monthlyTradeIncome,
      previousCompany,
      givesAll,
      onlyNOA,
      noData,
      assessableIncome,
      isThereTaxClearance
    } = workDetailsReducer;

    let errorCount = 0;
    const errorMsgs = commonReducer.appData.errorMsgs;
    const requiredMsg = errorMsgs.fieldEmpty;
    const maxLength = errorMsgs.invalidMaxSize;
    const globalErrors = commonReducer.appData.globalErrors;

    const less16 = ((lengthOfEmploymentYears.isValid
      && lengthOfEmploymentYears.value !== ''
      && parseInt(lengthOfEmploymentYears.value, 10) <= 1)
      && (lengthOfEmploymentMonths.isValid
      && lengthOfEmploymentMonths.value !== ''
      && parseInt(lengthOfEmploymentMonths.value, 10) < 4)) ? true : false;

    const isSelfOrSalary = (natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === 'SELFE2' || natureOfEmployment.value === 'BUSSV' || natureOfEmployment.value === 'SELFE') ? true : false;

    const isSalary = natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE2'
     ? true : false;

    const isSelf = (natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === "BUSSV" || natureOfEmployment.value === 'SELFE') ? true : false;

    if (isSelf) {
        if(nameOfEmployer.value.length > 35){
          const maxLengthMsg = maxLength.replace("{number}", "35");
          dispatch(handleErrorMessage("nameOfEmployer", maxLengthMsg));
          dispatch(scrollToElement("nameOfEmployer"))
          errorCount++;
        }
        if (onlyNOA){
          if (!this.checkEmptyFields([monthlyTradeIncome], requiredMsg, handleErrorMessage )) {
            errorCount++ ;
          }

          if (!this.checkisValidFields([monthlyTradeIncome])) {
            errorCount++ ;
          }
        }

        if (!this.checkEmptyFields([nameOfEmployer, industry, lengthOfEmploymentYears, lengthOfEmploymentMonths], requiredMsg, handleErrorMessage )) {
          errorCount++;
        }

        if (!this.checkisValidFields([nameOfEmployer, industry, lengthOfEmploymentYears, lengthOfEmploymentMonths])) {
          errorCount++;
        }

      }

    if (natureOfEmployment.value === 'SELFE'){
      if (!this.checkEmptyFields([jobTitle], requiredMsg, handleErrorMessage )) {
        errorCount++ ;
      }

      if (!this.checkisValidFields([jobTitle])) {
        errorCount++ ;
      }
    }

    if ((isSalary) && (givesAll && !(!less16 && !isThereTaxClearance))) {
      if (!this.checkEmptyFields([monthlyFixedIncome], requiredMsg, handleErrorMessage )) {
        errorCount++ ;
      }

      if (!this.checkisValidFields([monthlyFixedIncome])) {
        errorCount++ ;
      }
    }

    if ((isSalary) && (onlyNOA || givesAll || noData)) {
      if(nameOfEmployer.value.length > 35){
        const maxLengthMsg = maxLength.replace("{number}", "35");
        dispatch(handleErrorMessage("nameOfEmployer", maxLengthMsg));
        dispatch(scrollToElement("nameOfEmployer"))
        errorCount++;
      }
      if (!this.checkEmptyFields([jobTitle, industry, nameOfEmployer, lengthOfEmploymentYears, lengthOfEmploymentMonths], requiredMsg, handleErrorMessage )) {
        errorCount++ ;
      }

      if (!this.checkisValidFields([jobTitle, industry, nameOfEmployer, lengthOfEmploymentYears, lengthOfEmploymentMonths])) {
        errorCount++ ;
      }
    }

    if (!this.checkEmptyFields([natureOfEmployment], requiredMsg, handleErrorMessage)) {
      errorCount++;
    }

    if (!this.checkisValidFields([natureOfEmployment])) {
      errorCount++;
    }

    if ((isSelf) && monthlyTradeIncome.value !== '' && monthlyVariableIncome.valueOfNatureOfEmployment !== '' && onlyNOA && parseInt(assessableIncome.value, 10)){
      const calcualateAssessableIncome = (parseFloat(monthlyTradeIncome.value) + parseFloat(monthlyVariableIncome.value)) * 12 ;
      if(calcualateAssessableIncome > parseInt(assessableIncome.value, 10)){
        dispatch(setErrorMessage(globalErrors.invalidAssessableIncome));
        errorCount++;
      }
    }

    if((lengthOfEmploymentYears.isValid && lengthOfEmploymentYears.value !== '' && !previousCompany.isToggled && parseInt(lengthOfEmploymentYears.value, 10) < 3) && (isSelfOrSalary)) {
      if (!this.checkEmptyFields([nameOfPreviousCompany, lengthOfPreviousEmploymentYears, lengthOfPreviousEmploymentMonths, previousJobTitle, previousIndustry], requiredMsg, handleErrorMessage)) {
        errorCount++;
      }

      if (!this.checkisValidFields([previousIndustry, previousJobTitle, nameOfPreviousCompany, lengthOfPreviousEmploymentYears, lengthOfPreviousEmploymentMonths])) {
        errorCount++;
      }
    }

    if (errorCount > 0) {
      return false;
    }

    return true;
  };

  showUploadDocuments() {
    const { workDetailsReducer, uploadDocumentsReducer, personalDetailsReducer} = this.props;
    const { monthlyFixedIncome, monthlyVariableIncome, monthlyRentalIncome, eligibleFinancialAssets, natureOfEmployment, lengthOfEmploymentYears, lengthOfEmploymentMonths, declareIncome, givesAll, onlyNOA, noData, isThereTaxClearance} = workDetailsReducer;
    const { hasDualNationality } = personalDetailsReducer;

    const isSelfOrSalary = (natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === 'SELFE2' || natureOfEmployment.value === 'BUSSV' || natureOfEmployment.value === 'SELFE' ) ? true : false;

    const isSalary = natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE2'
     ? true : false;

    const isSelf = (natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === "BUSSV" || natureOfEmployment.value === 'SELFE') ? true : false;

    const less16 = ((lengthOfEmploymentYears.isValid
      && lengthOfEmploymentYears.value !== ''
      && parseInt(lengthOfEmploymentYears.value, 10) <= 1)
      && (lengthOfEmploymentMonths.isValid
      && lengthOfEmploymentMonths.value !== ''
      && parseInt(lengthOfEmploymentMonths.value, 10) < 4)) ? true : false;

    let mustDeclare = true;
    if (natureOfEmployment.value !== ''){
      if (onlyNOA){
        if(!isSelfOrSalary){
          mustDeclare = false;
        }
      } else if (givesAll) {
        if (!isSelfOrSalary || isSelf){
          mustDeclare = false;
        } else if (isSalary && !less16 && !isThereTaxClearance){
          mustDeclare = false;
        }
      } else if (noData) {
        if (!isSalary) {
          mustDeclare = false;
        }
      }
    }


    let showUploadDocuments = false;

    if(uploadDocumentsReducer.showUploadDocuments) {
      if(mustDeclare || declareIncome.isToggled) {
        showUploadDocuments = (isSalary && (monthlyFixedIncome.isValid && parseFloat(monthlyFixedIncome.value) > 0 ))
          || (((onlyNOA && isSelf) || isSalary) && (monthlyVariableIncome.isValid && parseFloat(monthlyVariableIncome.value) > 0))
          || (monthlyRentalIncome.isValid && parseFloat(monthlyRentalIncome.value) > 0 ) ;
      } else {
        showUploadDocuments = (eligibleFinancialAssets.isValid && parseFloat(eligibleFinancialAssets.value) > 0)
      }
    }
    
    if(hasDualNationality.isToggled) {
      showUploadDocuments = true;
    }

    // const showUploadDocuments = uploadDocumentsReducer.showUploadDocuments
    //   && ((((isSalary && (monthlyFixedIncome.isValid && parseFloat(monthlyFixedIncome.value) > 0 ))
    //   || (((onlyNOA && isSelf) || isSalary) && (monthlyVariableIncome.isValid && parseFloat(monthlyVariableIncome.value) > 0)))
    //   && (mustDeclare || declareIncome.isToggled))
    //   || (monthlyRentalIncome.isValid && parseFloat(monthlyRentalIncome.value) > 0 )
    //   || (eligibleFinancialAssets.isValid && parseFloat(eligibleFinancialAssets.value) > 0)) ;

    return showUploadDocuments;

  }

  handleToUploadOrConfirm() {
    const { dispatch } = this.props;
    if (!this.isBasicDetailsPassChecking()) {
      dispatch(scrollBackToSection('basicDetails'));
      return false;
    }

    if (!this.isLoanDetailsPassChecking()) {
      dispatch(scrollBackToSection('loanDetails'));
      return false;
    }

    if (!this.isPersonalDetailsPassChecking()) {
      dispatch(scrollBackToSection('personalDetails'));
      return false;
    }

    if (!this.isResidentialDetailsPassChecking()) {
      dispatch(scrollBackToSection('residentialDetails'));
      return false;
    }

    if (!this.isWorkDetailsPassChecking()) {
      return;
    }
    this.handleTracking("workDetails");
    this.handleSubmitPartialApplication();

    if(this.showUploadDocuments()){
      dispatch(scrollToSection('uploadDocuments'));
    } else {
      dispatch(scrollToSection('confirmDetails'));
    }
  }


  isUploadDocumentsPassChecking() {
    const { dispatch, uploadDocumentsReducer, workDetailsReducer, commonReducer, personalDetailsReducer } = this.props;
    const { monthlyFixedIncome, monthlyVariableIncome, monthlyRentalIncome, eligibleFinancialAssets, declareIncome, onlyNOA, givesAll, noData, natureOfEmployment, lengthOfEmploymentYears, lengthOfEmploymentMonths, isThereTaxClearance} = workDetailsReducer;
    const { paySlip, tenancyAgreement, bankStatement, additionalPassport } = uploadDocumentsReducer;
    const { hasDualNationality } = personalDetailsReducer;
    let errorCount = 0;
    const errorMsgs = commonReducer.appData.errorMsgs;
    const requiredMsg = errorMsgs.fieldEmpty;
    const paySlipCheck = commonReducer.appData.uploadDocuments.paySlipCheck;
    const tenancyAgreementCheck = commonReducer.appData.uploadDocuments.tenancyAgreementCheck;
    const bankStatmentCheck = commonReducer.appData.uploadDocuments.bankStatmentCheck;

    const isSelfOrSalary = (natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === 'SELFE2' || natureOfEmployment.value === 'BUSSV' || natureOfEmployment.value === 'SELFE' ) ? true : false;

    const isSalary = natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE2'
     ? true : false;

    const isSelf = (natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === "BUSSV" || natureOfEmployment.value === 'SELFE') ? true : false;

    const less16 = ((lengthOfEmploymentYears.isValid
      && lengthOfEmploymentYears.value !== ''
      && parseInt(lengthOfEmploymentYears.value, 10) <= 1)
      && (lengthOfEmploymentMonths.isValid
      && lengthOfEmploymentMonths.value !== ''
      && parseInt(lengthOfEmploymentMonths.value, 10) < 4)) ? true : false;

    let mustDeclare = true;
    if (natureOfEmployment.value !== ''){
      if (onlyNOA){
        if(!isSelfOrSalary){
          mustDeclare = false;
        }
      } else if (givesAll) {
        if (!isSelfOrSalary || isSelf){
          mustDeclare = false;
        } else if (isSalary && !less16 && !isThereTaxClearance){
          mustDeclare = false;
        }
      } else if (noData) {
        if (!isSalary) {
          mustDeclare = false;
        }
      }
    }


    if((mustDeclare || declareIncome.isToggled) && paySlipCheck && ((monthlyFixedIncome.isValid && monthlyFixedIncome.value !=='') || (monthlyVariableIncome.isValid && monthlyVariableIncome.value !==''))){
      if (!paySlip.isValid || paySlip.progress === 0) {
        dispatch(dispatchErrorMsg('paySlip', requiredMsg));
        errorCount++;
      }
    }

    if ((mustDeclare || declareIncome.isToggled) && tenancyAgreementCheck && (monthlyRentalIncome.isValid && monthlyRentalIncome.value !=='')) {
      if (!tenancyAgreement.isValid || tenancyAgreement.progress === 0) {
        dispatch(dispatchErrorMsg('tenancyAgreement', requiredMsg));
        errorCount++;
      }
    }

    if ((mustDeclare || declareIncome.isToggled) && bankStatmentCheck && (eligibleFinancialAssets.isValid && eligibleFinancialAssets.value !=='')) {
      if (!bankStatement.isValid || bankStatement.progress === 0) {
        dispatch(dispatchErrorMsg('bankStatement', requiredMsg));
        errorCount++;
      }
    }

    if(hasDualNationality.isToggled) {
      if (!additionalPassport.isValid || additionalPassport.progress === 0) {
        dispatch(dispatchErrorMsg('additionalPassport', requiredMsg));
        errorCount++;
      }
    }

    if (errorCount > 0) {
      return false;
    }

    return true;
  }

  handleToConfirmDetails() {
    const { dispatch } = this.props;
    if (!this.isBasicDetailsPassChecking()) {
      dispatch(scrollBackToSection('basicDetails'));
      return false;
    }

    if (!this.isLoanDetailsPassChecking()) {
      dispatch(scrollBackToSection('loanDetails'));
      return false;
    }

    if (!this.isPersonalDetailsPassChecking()) {
      dispatch(scrollBackToSection('personalDetails'));
      return false;
    }

    if (!this.isResidentialDetailsPassChecking()) {
      dispatch(scrollBackToSection('residentialDetails'));
      return false;
    }

    if (!this.isWorkDetailsPassChecking()) {
      dispatch(scrollBackToSection('workDetails'));
      return false;
    }

    if (!this.isUploadDocumentsPassChecking()) {
      return;
    }

    this.handleTracking("uploadDocuments");
    this.handleSubmitPartialApplication();
    dispatch(scrollToSection('confirmDetails'));
  }

  getDataForSubmission () {
    const { commonReducer, applicationReducer, basicDetailsReducer, loanDetailsReducer, personalDetailsReducer, residentialDetailsReducer, localAddressInputReducer, workDetailsReducer, uploadDocumentsReducer } = this.props;
    const currentSection = commonReducer.currentSection;
    const steps = ['basicDetails', 'loanDetails', 'personalDetails', 'residentialDetails', 'workDetails', 'uploadDocuments', 'confirmDetails', 'acknowledgement'];
    const indexOfSteps = steps.indexOf(currentSection);
    const isMyInfoFlow = commonReducer.isMyInfoFlow;

    const {
      applicationID,
      isPreviousApplication
    } = applicationReducer;

    const {
      fullName,
      nric,
      hanYuPinYinName,
      alias,
      hanYuPinYinAliasName,
      marriedName,
      email,
      mobileNumber,
      residentialStatus,
      otpVerified
    } = basicDetailsReducer;

    const {
      loanPropertyType,
      propertyUsage,
      purchasePrice,
      dateOfTOP,
      loanAmount,
      isdirectPurchase,
      loanPackage,
      disbursementYear,
      jointBorrowerNric,
      jointBorrowerEmail,
      jointBorrowerMobileNumber,
      jointBorrowerFullName,
      jointBorrower,
      sourceOfFundsDP,
      sourceOfFundsMLR,
      sourceOfWealth,
      homeLoanOutstanding,
      loanType
    } = loanDetailsReducer;

    const {
      dateOfBirth,
      gender,
      maritalStatus,
      educationLevel,
      race,
      nationality,
      countryOfBirth,
      countryOfResidence,
      hasDualNationality,
      additionalLegalIdCountry,
      additionalLegalId,
      additionalLegalIdExpiryDate,
      additionalLegalIdIssueCountry,
    } = personalDetailsReducer;

    const {
      country,
      mailingAddress,
      propertyType,
      mailingPropertyType,
      city,
      overseasAddress1,
      overseasAddress2,
      overseasAddress3,
      overseasAddress4
    } = residentialDetailsReducer;

    const {
      homePostalCode,
      homeStreet,
      homeBlock,
      homeBuilding,
      homeLevel,
      homeUnit,
      mailingPostalCode,
      mailingStreet,
      mailingBlock,
      mailingLevel,
      mailingUnit,
      mailingBuilding
    } = localAddressInputReducer;

    const {
      natureOfEmployment,
      jobTitle,
      nameOfEmployer,
      industry,
      lengthOfEmploymentYears,
      lengthOfEmploymentMonths,
      nameOfPreviousCompany,
      lengthOfPreviousEmploymentYears,
      lengthOfPreviousEmploymentMonths,
      previousJobTitle,
      previousIndustry,
      cpfcontributions,
      monthlyFixedIncome,
      monthlyRentalIncome,
      monthlyTradeIncome,
      monthlyVariableIncome,
      workInSG,
      anotherJob,
      eligibleFinancialAssets,
      incomeVerified,
      previousCompany,
      givesAll,
      noData,
      onlyNOA,
      isThereTaxClearance,
      declareIncome
    } = workDetailsReducer;

    const { paySlip , bankStatement, tenancyAgreement, showUploadDocuments, additionalPassport} = uploadDocumentsReducer;

    const percentageOfOwnership = natureOfEmployment.value === 'SELFE1' ? 1 : (natureOfEmployment.value === 'SELFE2' ? 2 : 0);

    let valueOfNatureOfEmployment = natureOfEmployment.value;

    const employmentMapping = commonReducer.appData.employmentMapping;
    let occupation = jobTitle.value;
    let industryValue = industry.key;
    if (natureOfEmployment.value === 'HWIFE') {
      occupation = employmentMapping['HWIFE'].occupation;
      industryValue = employmentMapping['HWIFE'].industry;
    } else if (natureOfEmployment.value === 'RETIREE') {
      occupation = employmentMapping['RETIREE'].occupation;
      industryValue = employmentMapping['RETIREE'].industry;
    } else if (natureOfEmployment.value === 'NOINC') {
      occupation = employmentMapping['NOINC'].occupation;
      industryValue = employmentMapping['NOINC'].industry;
    } else if (natureOfEmployment.value === 'STUDT') {
      occupation = employmentMapping['STUDT'].occupation;
      industryValue = employmentMapping['STUDT'].industry;
    } else if (natureOfEmployment.value === 'SELFE4') {
      occupation = employmentMapping['SELFE4'].occupation;
    } else if (natureOfEmployment.value === 'SELFE1') {
      occupation = employmentMapping['SELFE1'].occupation;
    } else if (natureOfEmployment.value === 'BUSSV') {
      occupation = employmentMapping['BUSSV'].occupation;
    } else if (natureOfEmployment.value === 'SELFE3') {
      occupation = employmentMapping['SELFE3'].occupation;
      industryValue = employmentMapping['SELFE3'].industry;
    }

    const isNameOfEmployerRequired = natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === 'SELFE2' || natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'BUSSV' || natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE';
    const showPreviousEmploy = !previousCompany.isToggled && (lengthOfEmploymentYears.isValid && lengthOfEmploymentYears.value !== '' && parseInt(lengthOfEmploymentYears.value, 10) < 3) ? true : false;
    const unemployed = natureOfEmployment.value === "STUDT" || natureOfEmployment.value === "HWIFE" || natureOfEmployment.value === "RETIREE" || natureOfEmployment.value === "NOINC";
    const useJobTitleValue = natureOfEmployment.value === "SALARIED" || natureOfEmployment.value === "SELFE2" ;

    const basicDetailsObj = {
      residentialStatus: residentialStatus,
      emailAddress: email.value,
      mobileNumber: mobileNumber.value.includes("+") ? mobileNumber.value.replace(/ +/g, "") : `+65${mobileNumber.value.replace(/ +/g, "")}`,
      idDetails: {
        legalId: nric.value,
        legalIdType: "IC",
        legalIdIssueDate: '',
        legalIdExpiryDate: '',
        legalIdIssueCountry: 'SG'
      },
      names: {
          principalName: fullName.value,
          hanYuPinYinName: hanYuPinYinName,
          hanYuPinYinAliasName: hanYuPinYinAliasName,
          marriedName: marriedName,
          alias: alias
      }
    };

    const jointBorrowerObj = {
      basicInfo : {
        emailAddress: jointBorrowerEmail.value,
        mobileNumber: `+65${jointBorrowerMobileNumber.value.replace(/ +/g, "")}`,
        idDetails: {
          legalId: jointBorrowerNric.value
        },
        names: {
            principalName: jointBorrowerFullName.value
        }
      }
    }

    const loanTypeMapping = commonReducer.appData.loanTypeMapping;

    let requestType = '';
    let completionStatus = ''
    if(loanType.value === '0' ){
      requestType = loanTypeMapping['0'].requestType;
      completionStatus = loanTypeMapping['0'].completionStatus;
    } else if (loanType.value === '1') {
      requestType = loanTypeMapping['1'].requestType;
      completionStatus = loanTypeMapping['1'].completionStatus;
    } else if (loanType.value === '2') {
      requestType = loanTypeMapping['2'].requestType;
      completionStatus = loanTypeMapping['2'].completionStatus;
    } else if (loanType.value === '3') {
      requestType = loanTypeMapping['3'].requestType;
      completionStatus = loanTypeMapping['3'].completionStatus;
    }

    const loanDetailsObj = {
        purchasePrice: (loanType.value === '0' || loanType.value === '1') ? purchasePrice.value : '',
        loanAmount: (loanType.value === '0' || loanType.value === '1')  ? loanAmount.value: homeLoanOutstanding.value ,
        requestType: requestType,
        packageID: loanPackage.packageCode,
        packageDescription: loanPackage.description,
        firstDisbursementYear: (loanType.value === '2' || loanType.value === '3')  ? disbursementYear.value : ''
    };

    const propertyDetailsObj = {
        completionStatus: completionStatus,
        usage: propertyUsage.value ,
        isDirectPurchaseFromDeveloper: loanPropertyType.value === 'EC' && isdirectPurchase.isToggled ? 'Y' : 'N',
        developmentType: loanPropertyType.value,
        builtInArea: '',
        topDate: loanPropertyType.value === 'EC' ? dateOfTOP.value : ''
    }

    let personalDetailsObj = {
      dateOfBirth: dateOfBirth.value,
      gender: gender.value,
      maritalStatus: maritalStatus.value,
      educationLevel: educationLevel.value,
      race: race.value,
      nationality: nationality.value,
      countryOfBirth: countryOfBirth.value,
      countryOfResidence: countryOfResidence.value
    };

    const enableCAS = commonReducer.appData.configuration && commonReducer.appData.configuration.personalDetails && commonReducer.appData.configuration.personalDetails.enableDualNationality;
    if (enableCAS) {
      personalDetailsObj.hasDualNationality = hasDualNationality.isToggled,
      personalDetailsObj.additionalLegalIdType = hasDualNationality.isToggled ? 'PP' : '',
      personalDetailsObj.additionalLegalIdCountry = additionalLegalIdCountry.value,
      personalDetailsObj.additionalLegalId = additionalLegalId.value,
      personalDetailsObj.additionalLegalIdExpiryDate = additionalLegalIdExpiryDate.value,
      personalDetailsObj.additionalLegalIdIssueCountry = additionalLegalIdIssueCountry.value
    }

    const residentialAddressObj = {
      type: 'R',
      unitNo: homeUnit.value,
      street: homeStreet.value,
      block: homeBlock.value,
      postalCode: homePostalCode.value,
      floor: homeLevel.value,
      building: homeBuilding.value,
      country: 'SG',
      propertyType: propertyType.value,
      city:  '',
      line1: '',
      line2: '',
      line3: '',
      line4: ''
    };

    const propertyTypeS = (residentialDetailsReducer.mailingPropertyType.value !== "BG"
      && residentialDetailsReducer.mailingPropertyType.value !== "SM"
      && residentialDetailsReducer.mailingPropertyType.value !== "TE");

    const mailingAddressObj = {
      type: 'M',
      unitNo: mailingAddress.isToggled && propertyTypeS ? mailingUnit.value : '',
      street: mailingAddress.isToggled ? mailingStreet.value : '',
      block: mailingAddress.isToggled ? mailingBlock.value : '',
      postalCode: mailingAddress.isToggled ? mailingPostalCode.value : '',
      floor: mailingAddress.isToggled && propertyTypeS ? mailingLevel.value : '',
      building: mailingAddress.isToggled ? mailingBuilding.value : '',
      propertyType: mailingAddress.isToggled ? mailingPropertyType.value : '',
      country: mailingAddress.isToggled ? country.value : '',
      city: mailingAddress.isToggled && country.value !== 'SG' ? city.value : '',
      line1: mailingAddress.isToggled && country.value !== 'SG' ? overseasAddress1.value : '',
      line2: mailingAddress.isToggled && country.value !== 'SG' ? overseasAddress2.value : '',
      line3: mailingAddress.isToggled && country.value !== 'SG' ? overseasAddress3.value : '',
      line4: mailingAddress.isToggled && country.value !== 'SG' ? overseasAddress4.value : '',
    };

    const currentEmployer = {
      type: 'C',
      natureOfEmployment: valueOfNatureOfEmployment,
      percentageOfOwnership,
      name: isNameOfEmployerRequired ? nameOfEmployer.value : 'NA',
      jobTitle: useJobTitleValue ? jobTitle.value : occupation,
      industry: industryValue,
      length: unemployed ? "" : parseInt(lengthOfEmploymentYears.value, 10) * 12 + parseInt(lengthOfEmploymentMonths.value, 10)
    };

    const previousEmployer = {
      type: 'P',
      name: nameOfPreviousCompany.value,
      jobTitle: previousJobTitle.value,
      industry: previousIndustry.key,
      length: parseInt(lengthOfPreviousEmploymentYears.value, 10) * 12 + parseInt(lengthOfPreviousEmploymentMonths.value, 10)
    };

    let employers = [currentEmployer];
    if (showPreviousEmploy) {
      employers.push(previousEmployer);
    }

    const isSelfOrSalary = (natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === 'SELFE2' || natureOfEmployment.value === 'BUSSV' ) ? true : false;
    const isSalary = natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE2' ? true : false;
    const isSelf = (natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === "BUSSV" || natureOfEmployment.value === 'SELFE') ? true : false;

    const less16 = ((lengthOfEmploymentYears.isValid
      && lengthOfEmploymentYears.value !== ''
      && parseInt(lengthOfEmploymentYears.value, 10) <= 1)
      && (lengthOfEmploymentMonths.isValid
      && lengthOfEmploymentMonths.value !== ''
      && parseInt(lengthOfEmploymentMonths.value, 10) < 4)) ? true : false;

    let mustDeclare = true;
    if (natureOfEmployment.value !== ''){
      if (onlyNOA){
        if(!isSelfOrSalary){
          mustDeclare = false;
        }
      } else if (givesAll) {
        if (!isSelfOrSalary || isSelf){
          mustDeclare = false;
        } else if (isSalary && !less16 && !isThereTaxClearance){
          mustDeclare = false;
        }
      } else if (noData) {
        if (!isSalary) {
          mustDeclare = false;
        }
      }
    }


    const incomeDetailsObj = {
      incomeVerified,
      incomeSelfDeclare: {
        monthlyFixed: isSalary ? monthlyFixedIncome.value : '',
        monthlyTrade: onlyNOA && isSelf ? monthlyTradeIncome.value: '',
        monthlyRental: (mustDeclare || declareIncome.isToggled) ? monthlyRentalIncome.value : '',
        monthlyVariable: (onlyNOA && isSelfOrSalary) || (givesAll && isSalary) || (noData && isSalary) ?  monthlyVariableIncome.value : '' ,
        eligibleFinancialAsset: eligibleFinancialAssets.value
      }
    };

    const workDetailsObj = {
      employers,
      income: null,
      employmentPassExpiry: null,
      cpfContributions: cpfcontributions.value
    };

    const isMonthlyFixed = parseFloat(monthlyFixedIncome.value) > 0;
    const isMonthlyVariable = parseFloat(monthlyVariableIncome.value) > 0;
    const isMonthlyRental = parseFloat(monthlyRentalIncome.value) > 0;
    const isEFA = parseFloat(eligibleFinancialAssets.value) > 0 ;

    const incomeDocArray = [];
    let uploadedDocument = false;
    if(showUploadDocuments) {
        if(((((onlyNOA && isSelf) || isSalary) && isMonthlyVariable) || (isSalary && isMonthlyFixed))) {
          if(paySlip.inputValue !== '' || paySlip.progress !== 0){
            incomeDocArray.push("incomedocument1");
            uploadedDocument = true;
          }
        }

        if(isMonthlyRental){
          if(tenancyAgreement.inputValue !== '' || tenancyAgreement.progress !== 0){
            incomeDocArray.push("incomedocument2");
            uploadedDocument = true;
          }
        }

        if(isEFA){
          if(bankStatement.inputValue !== '' || bankStatement.progress !== 0 ){
            incomeDocArray.push("incomedocument3");
            uploadedDocument = true;
          }
        }

        if(hasDualNationality.isToggled) {
          if(additionalPassport.inputValue !== '' || additionalPassport.progress !== 0 ){
            incomeDocArray.push("additionalpassport")
            uploadedDocument = true;
          }
        }
    }

    const additionalDetailsObj = {
      sourceOfFundForRepayment: sourceOfFundsMLR.value,
      sourceOfFundForDownPayment: (loanType.value === '0' || loanType.value === '1') ? sourceOfFundsDP.value : [],
      sourceOfWealth:sourceOfWealth.value,
      workingInSg: workInSG.isToggled ? 'Y' : 'N',
      incomeFromMoreThanOnejob: anotherJob.isToggled ? 'Y' : 'N',
      uploadedDocument: uploadedDocument ? 'Y': null,
      uploadedDocumentType: incomeDocArray.length > 0 ? incomeDocArray.join(',') : null
    }

    let addressObjs = [residentialAddressObj];
    if (mailingAddress.isToggled) {
      addressObjs.push(mailingAddressObj);
    }

    const dataObjBasicDetails = {
                                jointApplicant: jointBorrower.isToggled ? jointBorrowerObj : null,
                                loanDetails: indexOfSteps >= 1 ? loanDetailsObj : null,
                                propertyDetails: indexOfSteps >= 1 ? propertyDetailsObj : null
                                };
    const dataObj = {
                      applicationId: applicationID,
                      jointApplicant: jointBorrower.isToggled ? jointBorrowerObj : null,
                      loanDetails: indexOfSteps >= 1 ? loanDetailsObj : null,
                      propertyDetails: indexOfSteps >= 1 ? propertyDetailsObj : null
                    };
    let  obj = dataObj;
    if (currentSection === "basicDetails" && !isPreviousApplication) {
      obj = dataObjBasicDetails;
    }
    obj.applicant = {
      basicInfo: basicDetailsObj,
      personalInfo: isMyInfoFlow || indexOfSteps >= 2 ? personalDetailsObj : null,
      addresses: isMyInfoFlow || indexOfSteps >= 3 ? addressObjs : null,
      employmentInfo: isMyInfoFlow || indexOfSteps >= 4 ? workDetailsObj : null,
      incomeDetails: isMyInfoFlow || indexOfSteps >= 4 ? incomeDetailsObj : null,
      additionalDetails: isMyInfoFlow || indexOfSteps >= 1 ? additionalDetailsObj : null,
      otpVerified: otpVerified,
      mcid: !!window._satellite ? window._satellite.getVar("visitorId") : "",
      vid: getURLParameter("vid"),
      pid: getURLParameter("pid")
    }
    return obj;
    
  }

  isAllCheckingPass() {
    const { dispatch, uploadDocumentsReducer } = this.props;

    if (!this.isBasicDetailsPassChecking()) {
      dispatch(scrollBackToSection('basicDetails'));
      return false;
    }

    if (!this.isLoanDetailsPassChecking()) {
      dispatch(scrollBackToSection('loanDetails'));
      return false;
    }

    if (!this.isPersonalDetailsPassChecking()) {
      dispatch(scrollBackToSection('personalDetails'));
      return false;
    }

    if (!this.isResidentialDetailsPassChecking()) {
      dispatch(scrollBackToSection('residentialDetails'));
      return false;
    }

    if (!this.isWorkDetailsPassChecking()) {
      dispatch(scrollBackToSection('workDetails'));
      return false;
    }

    if (!this.isUploadDocumentsPassChecking() && uploadDocumentsReducer.showUploadDocuments) {
      dispatch(scrollBackToSection('uploadDocuments'));
      return false;
    }

    return true;
  }

  handleSubmitApplication() {
    const {
      dispatch,
      applicationReducer
    } = this.props;

    if (!this.isAllCheckingPass()) {
      return;
    }
    const applicationId = applicationReducer.applicationID;
    const dataObj = this.getDataForSubmission();
    dispatch(submitApplication(dataObj, applicationId, () => this.redirectToErrorPage()));
  }

  retrieveApplicationID() {
    const {dispatch} = this.props;

    if (!this.isBasicDetailsPassChecking()) {
      return false;
    }
    const dataObj = this.getDataForSubmission();
    dispatch(retrieveApplicationId(dataObj, () => this.handleToLoanDetails() ,() => this.redirectToErrorPage()));
  }

  handleToRetrieveOrLoan(step){
    const {applicationReducer, basicDetailsReducer, dispatch} = this.props;
    const {isPreviousApplication, data} = applicationReducer;
    const mobileNumber = basicDetailsReducer.mobileNumber;
    if (!this.isBasicDetailsPassChecking()) {
      return;
    }
    if (step === "OTP") {
      dispatch(sendOtp(mobileNumber, false));
      return;
    }
    if (data.applicant.verifiedData === 'A' || (data.applicant.verifiedData === 'S' && isPreviousApplication)) {
      this.handleToLoanDetails()
    } else {
      this.retrieveApplicationID();
    }
  }

  handleTracking(step) {
    const {
      commonReducer,
      verifyReducer
    } = this.props;
    const { isMyInfoFlow } = commonReducer;
    const dataElement = commonReducer.appData.dataElement;
    let stepNo = 0;
    switch (step) {
      case 'basicDetails':
        stepNo = 1;
        break;
      case 'loanDetails':
        stepNo = 4;
        break;
      case 'personalDetails':
        stepNo = 5;
        break;
      case 'residentialDetails':
        stepNo = 6;
        break;
      case 'workDetails':
        stepNo = 7;
        break;
      case 'uploadDocuments':
        stepNo = 9;
        break;
      case 'confirmDetails':
        stepNo = 11;
        break;
      default:
        stepNo = 1;
      }
      const agency = verifyReducer.agency;
      const ceaid = verifyReducer.ceaid;
      const source = verifyReducer.source;
      const isAgency = agency !== "" && agency !== null  && agency !== undefined && ceaid !== "" && ceaid !== null  && ceaid !== undefined && source !== "" && source !== null  && source !== undefined
      sendDataToSparkline(dataElement, stepNo, isMyInfoFlow, '', false, false, "", "", false, isAgency, source, agency, ceaid);
    }

  componentDidUpdate(prevState) {
    const {dispatch, commonReducer, verifyReducer} = this.props;
    if(prevState.commonReducer.appData !== commonReducer.appData){
      const showUploadDocuments = commonReducer.appData.uploadDocuments.showUploadDocuments;
      dispatch(setShowUploadDocument(showUploadDocuments));
      if(commonReducer.isMyInfoFlow){
        const dataElement = commonReducer.appData.dataElement
        const agency = verifyReducer.agency;
        const ceaid = verifyReducer.ceaid;
        const source = verifyReducer.source;
        const isAgency = agency !== "" && agency !== null  && agency !== undefined && ceaid !== "" && ceaid !== null  && ceaid !== undefined && source !== "" && source !== null  && source !== undefined
        sendDataToSparkline(dataElement, 0, true, '', true, false, "", "", false, isAgency, source, agency, ceaid);
      }
    }
  }

  render() {
    const { commonReducer, applicationReducer } = this.props;
    const currentSection = commonReducer.currentSection;
    const steps = ['basicDetails', 'otpPage', 'loanDetails', 'personalDetails', 'residentialDetails', 'workDetails', 'uploadDocuments', 'confirmDetails', 'acknowledgement'];
    const indexOfSteps = steps.indexOf(currentSection);
    const retrievingData = applicationReducer.isLoading;
    const dataLoaded = applicationReducer.dataLoaded;
    const hasError = applicationReducer.hasError;
    const errorCode = applicationReducer.errorCode;
    const withApplicationId = applicationReducer.withApplicationId;
    const viewPendingPage = applicationReducer.viewPendingPage;
    const showUploadDocuments = this.showUploadDocuments()

    return (
      <WrapContainer {...this.props}>
        {retrievingData && <Loader/>}
        {hasError && <ErrorMessagePage {...this.props} errorCode={errorCode}/> }
        {withApplicationId && viewPendingPage && <PendingPage />}
        {dataLoaded && !hasError && !viewPendingPage && (
          currentSection === 'thankyou' ? <ThankYouPage /> :
          <div>
            <BasicDetailsPage {...this.props} onContinue={(step) => this.handleToRetrieveOrLoan(step)} />
            { indexOfSteps === 1 && <OtpPage {...this.props} onContinue={() => this.handleToRetrieveOrLoan()}  /> }
            { indexOfSteps >= 2 && <LoanDetailsPage {...this.props} onContinue={() => this.handleToPersonalDetails()} /> }
            { indexOfSteps >= 3 && <PersonalDetailsPage {...this.props} onContinue={() => this.handleToResidentialDetails()} /> }
            { indexOfSteps >= 4 && <ResidentialDetailsPage {...this.props} onContinue={() => this.handleToWorkDetails()} /> }
            { indexOfSteps >= 5 && <WorkDetailsPage {...this.props}  onContinue={() => this.handleToUploadOrConfirm()}/> }
            { showUploadDocuments && indexOfSteps >= 6 && <UploadDocumentsPage {...this.props}  onContinue={() => this.handleToConfirmDetails()}/> }
            { indexOfSteps >= 7 && <ConfirmDetailsPage {...this.props} onContinue={() => this.handleSubmitApplication()}/>}
          </div>
        )}
      </WrapContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { commonReducer,
          homeReducer,
          basicDetailsReducer,
          loanDetailsReducer,
          workDetailsReducer,
          personalDetailsReducer,
          residentialDetailsReducer,
          localAddressInputReducer,
          applicationReducer,
          uploadDocumentsReducer,
          verifyReducer,
          otpReducer } = state;
  return {  commonReducer,
            homeReducer,
            basicDetailsReducer,
            loanDetailsReducer,
            workDetailsReducer,
            personalDetailsReducer,
            residentialDetailsReducer,
            localAddressInputReducer,
            applicationReducer,
            uploadDocumentsReducer,
            verifyReducer,
            otpReducer
          };
}

export default connect(mapStateToProps)(ApplicationContainer);
