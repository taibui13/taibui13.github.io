import React, { Component } from 'react';
import { connect } from 'react-redux';
import PrimaryButton from './../components/PrimaryButton/PrimaryButton';
import ToggleInput from './../components/ToggleInput/ToggleInput';
import ConfirmDetails from './../components/ConfirmDetails/ConfirmDetails';
import { scrollBackToSection } from './../actions/commonAction';
import { handleIstoggled, setToggleErrorMsg } from './../actions/confirmDetailsAction'
import { mapValueToDescriptionDuplicate, getDescriptionByIds } from './../common/utils';
import * as CONSTANT from '../common/contant';

class ConfirmDetailsPage extends Component {

  handleScrollTo(section) {
    const { dispatch } = this.props;
    dispatch(scrollBackToSection(section));
  }

  handleOnClick(isToggled , field){
    const { dispatch } = this.props;
    dispatch(handleIstoggled(isToggled , field));
  }

  handleSubmitApplication(){
    const {
      dispatch,
      commonReducer,
      confirmDetailsReducer
    } = this.props;

    const { acknowledgement } = confirmDetailsReducer;
    const errorMsg = commonReducer.appData.errorMsgs.termsRequired;
    if (!acknowledgement.isToggled) {
      dispatch(setToggleErrorMsg('acknowledgement', errorMsg));
      return;
    }

    this.props.onContinue();
  }

  showUploadedDocuments() {
      const { commonReducer, workDetailsReducer, uploadDocumentsReducer } = this.props;
      const { bankStatement, paySlip, tenancyAgreement, additionalPassport } = uploadDocumentsReducer;
      const { hasDualNationality } = this.props.personalDetailsReducer
      const { monthlyFixedIncome, monthlyRentalIncome, monthlyVariableIncome, eligibleFinancialAssets, natureOfEmployment, onlyNOA} = workDetailsReducer;
      const uploadDocumentsValue = commonReducer.appData.uploadDocuments;
      const labels = uploadDocumentsValue.labels;
      // const descriptions = uploadDocumentsValue.descriptions;
      const isMonthlyFixed = parseFloat(monthlyFixedIncome.value) > 0 ? true : false;
      const isMonthlyVariable = parseFloat(monthlyVariableIncome.value) > 0  ? true : false;
      const isMonthlyRental = parseFloat(monthlyRentalIncome.value) > 0  ? true : false;
      const isEFA = parseFloat(eligibleFinancialAssets.value) > 0  ? true : false;

      const isSalary = natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE2'
       ? true : false;
      const isSelf = (natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === "BUSSV" || natureOfEmployment.value === 'SELFE') ? true : false;

      let items = [];
      if (paySlip.inputValue !== '' && ((((onlyNOA && isSelf) || isSalary) && isMonthlyVariable) || (isSalary && isMonthlyFixed))) {
        items.push({
          label: labels.uploadPayslipDoc,
          value: paySlip.inputValue,
          object: paySlip
        });
      }

      if (tenancyAgreement.inputValue !== '' && isMonthlyRental) {
        items.push({
          label: labels.uploadTenancyAgreement,
          value: tenancyAgreement.inputValue,
          object: tenancyAgreement
        });
      }

      if (bankStatement.inputValue !== '' && isEFA) {
        items.push({
          label: labels.uploadBankStatement,
          value: bankStatement.inputValue,
          object: bankStatement
        });
      }

      if (hasDualNationality.isToggled) {
        items.push({
          label: labels.uploadAdditionalPassport,
          value: additionalPassport.inputValue,
          object: additionalPassport
        });
      }

      return (
        <div>
        <div className='uob-input-separator'/>
          <ConfirmDetails
            hasEdit={true}
            title={uploadDocumentsValue.title}
            onClick={() => this.handleScrollTo('uploadDocuments')}
            items={items}
          />
        </div>
      );
  }

  render(){
    const { basicDetailsReducer, commonReducer, personalDetailsReducer, loanDetailsReducer, residentialDetailsReducer, workDetailsReducer, localAddressInputReducer, confirmDetailsReducer, uploadDocumentsReducer, applicationReducer} = this.props;
    const confirmDetailsValue = commonReducer.appData.confirmDetails
    const basicDetailsValue = commonReducer.appData.basicDetails
    const loanDetailsValue = commonReducer.appData.loanDetails
    const personalDetailsValue = commonReducer.appData.personalDetails
    const residentialDetailsValue = commonReducer.appData.residentialDetails
    const workDetailsValue = commonReducer.appData.workDetails

    const bLabels = basicDetailsValue.labels;
    const lLabels = loanDetailsValue.labels;
    const pLabels = personalDetailsValue.labels;
    const rLabels = residentialDetailsValue.labels;
    const wLabels = workDetailsValue.labels;
    const cLabels = confirmDetailsValue.labels;
    const wToggle = workDetailsValue.toggle;

    const inputValues = commonReducer.appData.inputValues;
    const optionInputValues = commonReducer.appData.optionInput;
    const countriesNamesMap = inputValues.countriesNamesMap;
    const genderList = inputValues.gender;
    const maritalStatusList = inputValues.maritalStatus;
    const raceList = inputValues.race;
    const natureOfEmploymentList= inputValues.natureOfEmployment;
    const industryValueList= inputValues.industry;
   
    const loanPropertyTypeList = inputValues.propertyType;
    const propertyTypeList = inputValues.propertyTypeAddress;
    const residentialStatus = basicDetailsReducer.residentialStatus;
    const occupationList = inputValues.occupation;
    const educationLevelList = inputValues.educationLevel;
    const loanTypeList = inputValues.loanType;
    const propertyUsageList = optionInputValues.propertyUsage;
    const industryList = mapValueToDescriptionDuplicate(industryValueList);

    const getDescriptionByCode = (code, list) => {
      const item = list.find(x => x.value === code);
      return item ? item.description : '';
    }

    const mapValueToLabelDuplicate = (code, list) => {
      const item = list.find((x) => x.value.substr(0, code.length) === code);
      return item ? item.description : code;
    };

    const propertyTypeS = (residentialDetailsReducer.mailingPropertyType.value !== "BG"
      && residentialDetailsReducer.mailingPropertyType.value !== "SM"
      && residentialDetailsReducer.mailingPropertyType.value !== "TE");

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
      overseasAddress1,
      overseasAddress2,
      overseasAddress3,
      overseasAddress4,
      country,
      city,
      propertyType,
      mailingPropertyType
    } = residentialDetailsReducer;

    const {
      homePostalCode,
      homeStreet,
      homeBuilding,
      homeBlock,
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
      hanYuPinYinName,
      alias,
      hanYuPinYinAliasName,
      marriedName,
      fullName,
      nric,
      email,
      mobileNumber
    } = basicDetailsReducer;

    const {
      loanType,
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
      sourceOfFundsMLR,
      sourceOfFundsDP,
      sourceOfWealth,
      loanPackage,
      filteredLoanPackageList
    } = loanDetailsReducer;

    const {
      natureOfEmployment,
      nameOfEmployer,
      jobTitle,
      industry,
      lengthOfEmploymentYears,
      lengthOfEmploymentMonths,
      nameOfPreviousCompany,
      lengthOfPreviousEmploymentYears,
      lengthOfPreviousEmploymentMonths,
      previousJobTitle,
      previousIndustry,
      monthlyFixedIncome,
      monthlyRentalIncome,
      monthlyTradeIncome,
      monthlyVariableIncome,
      eligibleFinancialAssets,
      declareIncome,
      previousCompany,
      givesAll,
      onlyNOA,
      noData,
      isThereTaxClearance
    } = workDetailsReducer;

    const {
      acknowledgement
    } = confirmDetailsReducer;

    const isSelfOrSalary = (natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === 'SELFE2' || natureOfEmployment.value === 'BUSSV' || natureOfEmployment.value === 'SELFE') ? true : false;
    const isSalary = natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE2'
     ? true : false;
    const isSelf = (natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === "BUSSV" || natureOfEmployment.value === 'SELFE') ? true : false;
    const showPreviousEmploy = (lengthOfEmploymentYears.isValid
      && lengthOfEmploymentYears.value !== ''
      && parseInt(lengthOfEmploymentYears.value, 10) < 3) ? true : false;

    const less16 = ((lengthOfEmploymentYears.isValid
      && lengthOfEmploymentYears.value !== ''
      && parseInt(lengthOfEmploymentYears.value, 10) <= 1)
      && (lengthOfEmploymentMonths.isValid
      && lengthOfEmploymentMonths.value !== ''
      && parseInt(lengthOfEmploymentMonths.value, 10) < 4)) ? true : false;

    let mustDeclare = true;
    let showDeclare = true;
    if (natureOfEmployment.value !== ''){
      if (onlyNOA){
        if(!isSelfOrSalary){
          mustDeclare = false;
          showDeclare = false
        }
      } else if (givesAll) {
        if (!isSelfOrSalary || isSelf){
          mustDeclare = false;
          showDeclare = false
        } else if (isSalary && !less16 && !isThereTaxClearance){
          mustDeclare = false;
        }
      }else if (noData) {
        if (!isSalary) {
          mustDeclare = false;
          showDeclare = false
        }
      }
    }

    const getResidentialStatusLabel = () => {
      const rs = inputValues.residentialStatus[residentialStatus];
      return rs ? rs : '';
    };

    const onOffLoanPackage = commonReducer.appData.loanDetails.loanPackage.onOffLoanPackage;
    const duplicateIndustryValue = applicationReducer.withApplicationId && industry.isInitial ? mapValueToLabelDuplicate(industry.value, industryList) : getDescriptionByCode(industry.value, industryList);
    const duplicatePreviousValue = applicationReducer.withApplicationId && previousIndustry.isInitial? mapValueToLabelDuplicate(previousIndustry.value, industryList) : getDescriptionByCode(previousIndustry.value, industryList);

    const Basicitems = [
      {
        label: bLabels.fullName,
        value: fullName.value
      },
      {
        label: `${bLabels.nric} (${getResidentialStatusLabel()})` ,
        value: nric.value
      },
      {
        label: bLabels.emailAddress,
        value: email.value
      },
      {
        label: bLabels.mobileNumber,
        value: mobileNumber.value.includes("+") ? mobileNumber.value : `+65 ${mobileNumber.value}`
      }
    ];

    const Loanitems = [
    {
      label: lLabels.propertyType,
      value: loanPropertyTypeList[loanPropertyType.value]
    },
    {
      label: lLabels.loanType,
      value: loanTypeList[loanType.value]
    },
    {
      label: lLabels.propertyUsage,
      value: getDescriptionByCode(propertyUsage.value, propertyUsageList)
    },
    {
      label: loanType.value === '0' || loanType.value === '1'  ? lLabels.purchasePrice : '',
      value: loanType.value === '0' || loanType.value === '1'  ? purchasePrice.value : ''
    },
    {
      label: loanType.value === '0' || loanType.value === '1'  ? lLabels.loanAmount: '',
      value: loanType.value === '0' || loanType.value === '1'  ? loanAmount.value: ''
    },
    {
      label: loanPropertyType.value === 'EC' ?  lLabels.dateOfTOP : '',
      value: loanPropertyType.value === 'EC' ?  dateOfTOP.value: ''
    },
    {
      label: loanType.value === '2' || loanType.value === '3' ?  lLabels.disbursementYear : '',
      value: loanType.value === '2' || loanType.value === '3' ?  disbursementYear.value : ''
    },
    {
      label: loanType.value === '2' || loanType.value === '3' ?  lLabels.homeLoanOutstanding : '',
      value: loanType.value === '2' || loanType.value === '3' ?  homeLoanOutstanding.value : ''
    },
    {
      label: lLabels.sourceOfFundsMLR,
      value: sourceOfFundsMLR.value.length > 0 ? getDescriptionByIds(sourceOfFundsMLR.value, optionInputValues.sourceOfFundsMLR) : ''
    },
    {
      label: lLabels.sourceOfFundsDP,
      value: sourceOfFundsDP.value.length > 0 && (loanType.value === '0' || loanType.value === '1') ? getDescriptionByIds(sourceOfFundsDP.value, optionInputValues.sourceOfFundsDP) : ''
    },
    {
      label: lLabels.sourceOfWealth,
      value: sourceOfWealth.value.length > 0 ? getDescriptionByIds(sourceOfWealth.value, optionInputValues.sourceOfWealth) : ''
    },
    {
      label: lLabels.loanPackageConfirmDetails,
      value: loanPackage.description !== "" && onOffLoanPackage && filteredLoanPackageList.length > 0 ? loanPackage.description : ''
    }
    ];

    const JointBorroweritem = [
      {
        label: lLabels.fullName,
        value: jointBorrowerFullName.value
      },
      {
        label: lLabels.nric,
        value: jointBorrowerNric.value
      },
      {
        label: lLabels.emailAddress,
        value: jointBorrowerEmail.value
      },
      {
        label: lLabels.mobileNumber,
        value: jointBorrowerMobileNumber.value.includes("+") ? jointBorrowerMobileNumber.value : `+65 ${jointBorrowerMobileNumber.value}`
      },
    ]

    const AdditionalId = [{
      label: pLabels.additionalLegalIdCountry,
      value: countriesNamesMap[additionalLegalIdCountry.value] || " "
    },
    {
      label: pLabels.additionalLegalId,
      value: additionalLegalId.value || " "
    },
    {
      label: pLabels.additionalLegalIdExpiryDate,
      value: additionalLegalIdExpiryDate.value || " "
    },
    {
      label: pLabels.additionalLegalIdIssueCountry,
      value: countriesNamesMap[additionalLegalIdIssueCountry.value] || " "
    }]

    const Personalitems = [
      {
        label: pLabels.dateOfBirth,
        value: dateOfBirth.value
      },
      {
        label: pLabels.gender,
        value: genderList[gender.value]
      },
      {
        label: pLabels.maritalStatus,
        value: maritalStatusList[maritalStatus.value]
      },
      {
        label: pLabels.highestQualification,
        value: educationLevelList[educationLevel.value]
      },
      {
        label: pLabels.race,
        value: raceList[race.value]
      },
      {
        label: pLabels.nationality,
        value: countriesNamesMap[nationality.value] || nationality.value
      },
      {
        label: pLabels.countryOfBirth,
        value: countriesNamesMap[countryOfBirth.value] || countryOfBirth.value
      },
      {
        label: pLabels.countryOfResidence,
        value: countriesNamesMap[countryOfResidence.value] || countryOfResidence.value
      }
    ];

    const Residentialitems = [
      {
        label: rLabels.homePostalCode,
        value: homePostalCode.value
      },
      {
        label: rLabels.homeBlock,
        value: homeBlock.value
      },
      {
        label: rLabels.homeStreet,
        value: homeStreet.value
      },
      {
        label: rLabels.homeBuilding,
        value: homeBuilding.value
      },
      {
        label: rLabels.homeLevel,
        value: homeLevel.value
      },
      {
        label: rLabels.homeUnit,
        value: homeUnit.value
      },
      {
        label: rLabels.propertyType,
        value: propertyTypeList[propertyType.value]
      }
    ];

    const Workitems = [
      {
        label: wLabels.natureOfEmployment,
        value: natureOfEmploymentList[natureOfEmployment.value]
      },
      {
        label: wLabels.jobTitle,
        value: isSalary || natureOfEmployment.value === 'SELFE' ? occupationList[jobTitle.value] : ''
      },
      {
        label: natureOfEmployment.value === 'SALARIED' ? wLabels.nameOfEmployer : wLabels.companyName,
        value: isSelfOrSalary ? nameOfEmployer.value : ''
      },
      {
        label: wLabels.industry,
        value: isSelfOrSalary ? duplicateIndustryValue  : ''
      },
      {
        label: wLabels.lengthOfEmploymentYears,
        value: isSelfOrSalary ? lengthOfEmploymentYears.value : ''
      },
      {
        label: wLabels.lengthOfEmploymentMonths,
        value: isSelfOrSalary ? lengthOfEmploymentMonths.value : ''
      }
    ];

    const previousItems = [
      {
        label: wLabels.previousCompanyName,
        value: nameOfPreviousCompany.value
      },
      {
        label: wLabels.lengthOfPreviousEmploymentYears,
        value: isSelfOrSalary && showPreviousEmploy ? lengthOfPreviousEmploymentYears.value : ''
      },
      {
        label: wLabels.lengthOfPreviousEmploymentMonths,
        value: isSelfOrSalary && showPreviousEmploy ? lengthOfPreviousEmploymentMonths.value : ''
      },
      {
        label: wLabels.previousJobTitle,
        value: isSelfOrSalary && showPreviousEmploy ? occupationList[previousJobTitle.value] : ''
      },
      {
        label: wLabels.previousIndustry,
        value: isSelfOrSalary && showPreviousEmploy ? duplicatePreviousValue : ''
      }
    ]

    const monthlyWorkItem = [
      {
        label: wLabels.monthlyFixedIncome,
        value: isSalary && (mustDeclare || declareIncome.isToggled) ? monthlyFixedIncome.value : ''
      },
      {
        label: wLabels.monthlyVariableIncome,
        value: ((onlyNOA && isSelf) || isSalary) && (mustDeclare || declareIncome.isToggled) ? monthlyVariableIncome.value : ''
      },
      {
        label: wLabels.monthlyRentalIncome,
        value: (mustDeclare || declareIncome.isToggled) ? monthlyRentalIncome.value : ''
      },
      {
        label: wLabels.monthlyTradeIncome,
        value: (onlyNOA && isSelf) && (mustDeclare || declareIncome.isToggled) ? monthlyTradeIncome.value : ''
      },
      {
        label: wLabels.eligibleFinancialAssets,
        value: eligibleFinancialAssets.value
      }
    ];

    const overseasMailingItem = [
      {
        label: rLabels.country,
        value: countriesNamesMap[country.value] || country.value
      },
      {
        label: rLabels.overseasAddress1,
        value: overseasAddress1.value
      },
      {
        label: rLabels.overseasAddress2,
        value: overseasAddress2.value
      },
      {
        label: rLabels.overseasAddress3,
        value: overseasAddress3.value
      },
      {
        label: rLabels.overseasAddress4,
        value: overseasAddress4.value
      },
      {
        label: rLabels.city,
        value: city.value
      }
    ];

    const SGMailingItem = [
      {
        label: rLabels.country,
        value: countriesNamesMap[country.value] || country.value
      },
      {
        label: rLabels.propertyType,
        value: propertyTypeList[mailingPropertyType.value]
      },
      {
        label: rLabels.mailingPostalCode,
        value: mailingPostalCode ? mailingPostalCode.value : ''
      },
      {
        label: rLabels.mailingBlock,
        value: mailingBlock ? mailingBlock.value : ''
      },
      {
        label: rLabels.mailingStreet,
        value: mailingStreet ? mailingStreet.value : ''
      },
      {
        label: rLabels.mailingLevel,
        value: mailingLevel && propertyTypeS ? mailingLevel.value : ''
      },
      {
        label: rLabels.mailingUnit,
        value: mailingUnit && propertyTypeS ? mailingUnit.value : ''
      },
      {
        label: rLabels.mailingBuilding,
        value: mailingBuilding ? mailingBuilding.value : ''
      }
    ];

    let showUploadPortion = false;

    if(uploadDocumentsReducer.showUploadDocuments) {
      if(mustDeclare || declareIncome.isToggled) {
        showUploadPortion = (isSalary && (monthlyFixedIncome.isValid && parseFloat(monthlyFixedIncome.value) > 0 ))
          || (((onlyNOA && isSelf) || isSalary) && (monthlyVariableIncome.isValid && parseFloat(monthlyVariableIncome.value) > 0))
          || (monthlyRentalIncome.isValid && parseFloat(monthlyRentalIncome.value) > 0 ) ;
      } else {
        showUploadPortion = (eligibleFinancialAssets.isValid && parseFloat(eligibleFinancialAssets.value) > 0)
      }
    }

    if (hasDualNationality.isToggled) {
      showUploadPortion = true;
    }
    const enableCAS = commonReducer.appData.configuration && commonReducer.appData.configuration.personalDetails && commonReducer.appData.configuration.personalDetails.enableDualNationality;

    return(
      <div className='uob-content' id='confirmDetails-section'>
        <h1>{confirmDetailsValue.title}</h1>
        <div className='uob-form-separator'/>
        <p className='uob-headline'>{confirmDetailsValue.subtitle}</p>
        <div className='uob-input-separator'/>
        <div className= 'confirmDetails-container'>

          <ConfirmDetails
            hasEdit={false}
            title={basicDetailsValue.title}
            items={Basicitems}
            others={[hanYuPinYinName,hanYuPinYinAliasName,alias,marriedName]}
          />

          <div className='uob-input-separator'/>

          <ConfirmDetails
           hasEdit={true}
           title={loanDetailsValue.title}
           items={Loanitems}
           onClick={() => this.handleScrollTo('loanDetails')}
           />
           { loanPropertyType.value === 'EC'  &&
             <div className='confirmDetails-flexContainer' id='diffMailingAdd'>
              <div className='confirmDetails-mailingAddress'> {lLabels.directPurchase} </div>
              <div className='confirmDetails-mailingToggle-CSS'> {loanDetailsReducer.isdirectPurchase.isToggled ? "Yes" : "No"}</div>
             </div>
           }

           <div className='confirmDetails-flexContainer' id='diffMailingAdd'>
            <div className='confirmDetails-mailingAddress'> {lLabels.jointBorrower} </div>
            <div className='confirmDetails-mailingToggle-CSS'> {loanDetailsReducer.jointBorrower.isToggled ? "Yes" : "No"}</div>
           </div>

           {jointBorrower.isToggled ?
             <ConfirmDetails
               gotTitle={true}
               hasEdit={false}
               items={JointBorroweritem}
             /> : null
           }

          <div className='uob-input-separator'/>

          <ConfirmDetails
            hasEdit={true}
            title={personalDetailsValue.title}
            items={Personalitems}
            onClick={() => this.handleScrollTo('personalDetails')}
          />
          {
             (nationality.value !== CONSTANT.SINGAPORIAN_ID) && enableCAS &&
             <div className="confirmDetails-flexContainer">
             <div className="confirmDetails-mailingAddress">{pLabels.hasDualNationality}</div>
             <div className="confirmDetails-mailingToggle-CSS">{hasDualNationality.isToggled ? "Yes" : "No"}</div>
           </div>
          }
          {hasDualNationality.isToggled && <ConfirmDetails
            hasEdit={false}
            gotTitle={true}
            items={AdditionalId}
            onClick={() => this.handleScrollTo('personalDetails')}
          />}

          <div className='uob-input-separator'/>

          <ConfirmDetails
            hasEdit={true}
            title={residentialDetailsValue.title}
            items={Residentialitems}
            onClick={() => this.handleScrollTo('residentialDetails')}
          />

          <div className='confirmDetails-flexContainer' id='diffMailingAdd'>
            <div className='confirmDetails-mailingAddress'> {residentialDetailsValue.mailingToggle.description} </div>
            <div className='confirmDetails-mailingToggle-CSS'> {residentialDetailsReducer.mailingAddress.isToggled ? "Yes" : "No"}</div>
          </div>

          {residentialDetailsReducer.mailingAddress.isToggled ?
            <ConfirmDetails
              gotTitle={true}
              hasEdit={false}
              items={residentialDetailsReducer.country.value === 'SG' ? SGMailingItem : overseasMailingItem}
            />
            : null
          }

          <div className='uob-input-separator'/>

          <ConfirmDetails
            hasEdit={true}
            title={workDetailsValue.title}
            items={Workitems}
            onClick={() => this.handleScrollTo('workDetails')}
          />

          { isSelfOrSalary && showPreviousEmploy &&
            <div className='confirmDetails-flexContainer' id='diffMailingAdd'>
              <div className='confirmDetails-mailingAddress'> {wToggle.previousCompany} </div>
              <div className='confirmDetails-mailingToggle-CSS'> {workDetailsReducer.previousCompany.isToggled ? "Yes" : "No"}</div>
            </div>
          }

          {isSelfOrSalary && showPreviousEmploy && !previousCompany.isToggled ?
            <div className='confirmDetails-previousEmploy'>
              <ConfirmDetails
                hasEdit={false}
                gotTitle = {true}
                items={previousItems}
                onClick={() => this.handleScrollTo('workDetails')}
              />
            </div> : null
          }

          { isSelfOrSalary &&
            <div>
              <div className='confirmDetails-flexContainer' id='diffMailingAdd'>
                <div className='confirmDetails-mailingAddress'> {wToggle.anotherJob} </div>
                <div className='confirmDetails-mailingToggle-CSS'> {workDetailsReducer.anotherJob.isToggled ? "Yes" : "No"}</div>
              </div>

              <div className='confirmDetails-flexContainer' id='diffMailingAdd'>
                <div className='confirmDetails-mailingAddress'> {wToggle.workInSG} </div>
                <div className='confirmDetails-mailingToggle-CSS'> {workDetailsReducer.workInSG.isToggled ? "Yes" : "No"}</div>
              </div>
            </div>
          }

          {showDeclare &&
            <div>
              <div className='confirmDetails-flexContainer declareIncome' id='diffMailingAdd'>
                <div className='confirmDetails-mailingAddress'> {wToggle.declareIncome} </div>
                <div className='confirmDetails-mailingToggle-CSS'> {workDetailsReducer.declareIncome.isToggled || mustDeclare ? "Yes" : "No"}</div>
              </div>
            </div>
          }

          {(eligibleFinancialAssets.value !== '' || monthlyRentalIncome.value !== '') && !showDeclare &&
            <div className='line-separator'/>
          }

          <ConfirmDetails
            hasEdit={false}
            gotTitle = {true}
            items={monthlyWorkItem}
            onClick={() => this.handleScrollTo('workDetails')}
          />

          {showUploadPortion && this.showUploadedDocuments()}

        </div>

        <div className='uob-input-separator'>
          <ToggleInput
            inputID='acknowledgement'
            isWithTitle={true}
            title={confirmDetailsValue.confirmToggle}
            isValid={acknowledgement.isValid}
            description={confirmDetailsValue.acknowledgementText}
            isToggled={acknowledgement.isToggled}
            onClick={() => this.handleOnClick(acknowledgement.isToggled, 'acknowledgement')}
            descriptionPosition='below'
            isTandC={true}
            errorMsg={acknowledgement.errorMsg}
            exampleLabels={confirmDetailsValue.acknowledgementEg}
          />
        </div>

        { confirmDetailsValue.terms !== '' &&
          <div className="uob-terms" dangerouslySetInnerHTML={{__html: confirmDetailsValue.terms}}/>
        }

        {commonReducer.currentSection === 'confirmDetails' &&
          <div className='uob-input-separator' >
            <PrimaryButton label={cLabels.submitButton}
            onClick={this.handleSubmitApplication.bind(this)}
            />
          </div>
        }
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const {
    confirmDetailsReducer ,
    localAddressInputReducer,
    acknowledgementDeclarationReducer,
    commonReducer,
    basicDetailsReducer,
    loanDetailsReducer,
    personalDetailsReducer,
    residentialDetailsReducer,
    workDetailsReducer,
    uploadDocumentsReducer,
    applicationReducer
  } = state;
  return {
    confirmDetailsReducer,
    localAddressInputReducer,
    acknowledgementDeclarationReducer,
    commonReducer,
    basicDetailsReducer,
    loanDetailsReducer,
    personalDetailsReducer,
    residentialDetailsReducer,
    workDetailsReducer,
    uploadDocumentsReducer,
    applicationReducer
  };
}

export default connect(mapStateToProps)(ConfirmDetailsPage);
