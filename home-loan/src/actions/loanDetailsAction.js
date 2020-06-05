import * as types from './actionTypes';
import { setErrorMessage, handleErrorMessage, handleClearErrorMessage } from './commonAction';
// import { setErrorWithValue } from './applicationAction'
import moment from 'moment';
// import { Config } from './../api/httpApi';
// import { setMyInfoFlowStatus } from './commonAction';

// set data
export const setLoanDetailsData = (loanDetailsObj, propertyDetailsObj) => {
  const year = moment().year() + 2;
  const isdirectPurchase = propertyDetailsObj && propertyDetailsObj.isDirectPurchaseFromDeveloper && propertyDetailsObj.isDirectPurchaseFromDeveloper === 'N' ? false : true;
  const requestType = loanDetailsObj && loanDetailsObj.requestType ? loanDetailsObj.requestType : '';
  const completionStatus = propertyDetailsObj && propertyDetailsObj.completionStatus ? propertyDetailsObj.completionStatus : '';
  let loanType = '';
  if(requestType === 'N' && completionStatus === '0' ){
    loanType = '0';
  } else if (requestType === 'N' && completionStatus === '1'){
    loanType = '1';
  } else if (requestType === 'R' && completionStatus === '0'){
    loanType = '2';
  } else if (requestType === 'R' && completionStatus === '1') {
    loanType = '3';
  }

  const loanPropertyType = propertyDetailsObj &&  propertyDetailsObj.developmentType ? propertyDetailsObj.developmentType : '' ;
  return (dispatch) => {
    dispatch({
      type: types.SET_LOAN_DETAILS_DATA,
      loanType,
      loanPropertyType,
      propertyUsage: propertyDetailsObj && propertyDetailsObj.usage ? propertyDetailsObj.usage : '0',
      purchasePrice: loanDetailsObj && loanDetailsObj.purchasePrice ? (loanDetailsObj.purchasePrice).toString() : '',
      dateOfTOP: propertyDetailsObj && propertyDetailsObj.topDate ? propertyDetailsObj.topDate : `01/01/${year}`,
      homeLoanOutstanding: loanDetailsObj && loanDetailsObj.loanAmount && (loanType === '2' || loanType === '3') ? (loanDetailsObj.loanAmount).toString() : '',
      loanAmount: loanDetailsObj && loanDetailsObj.loanAmount ? (loanDetailsObj.loanAmount).toString() : '',
      isdirectPurchase,
      loanPackage: loanDetailsObj && loanDetailsObj.loanPackage ? loanDetailsObj.loanPackage : '',
      firstDisbursementYear: loanDetailsObj && loanDetailsObj.firstDisbursementYear ? loanDetailsObj.firstDisbursementYear : ''
    });

    dispatch(filterLoanPackage(loanPropertyType, loanType))
  }
}


export const setJointApplicantData = (jointApplicantObj) => {
  return {
    type: types.SET_LOAN_DETAILS_JOINT_APPLICANT_DATA,
    jointBorrower: true,
    jointBorrowerFullName: jointApplicantObj && jointApplicantObj.basicInfo.names.principalName ? jointApplicantObj.basicInfo.names.principalName: '',
    jointBorrowerNric: jointApplicantObj && jointApplicantObj.basicInfo.idDetails.legalId ? jointApplicantObj.basicInfo.idDetails.legalId : '',
    jointBorrowerEmail: jointApplicantObj && jointApplicantObj.basicInfo.emailAddress ? jointApplicantObj.basicInfo.emailAddress : '',
    jointBorrowerMobileNumber: jointApplicantObj && jointApplicantObj.basicInfo.mobileNumber ? jointApplicantObj.basicInfo.mobileNumber.substr(3) : ''
  }
}

export const setAdditionalDetailsLoan = (additionalDetailsObj) => {
  return {
    type: types.SET_LOAN_DETAILS_ADDITIONAL_DETAILS_DATA,
    sourceOfFundsMLR: additionalDetailsObj && additionalDetailsObj.sourceOfFundForRepayment && additionalDetailsObj.sourceOfFundForRepayment !== [] ? additionalDetailsObj.sourceOfFundForRepayment  : ["1"],
    sourceOfWealth: additionalDetailsObj && additionalDetailsObj.sourceOfWealth && additionalDetailsObj.sourceOfWealth !== [] ? additionalDetailsObj.sourceOfWealth : ["1"],
    sourceOfFundsDP: additionalDetailsObj && additionalDetailsObj.sourceOfFundForDownPayment && additionalDetailsObj.sourceOfFundForDownPayment !== [] ? additionalDetailsObj.sourceOfFundForDownPayment : ["1"]
  }
}

//button option
export const changeButtonOptionValue = (data, field) => {
  const value = data.value;
  const description = data.description;
  return (dispatch) => {
    dispatch(setErrorMessage(""));
    dispatch({
      type: types.LOANDETAILS_BUTTON_OPTION_CHANGE,
      value,
      field,
      description
    });
  };
}

export const setButtonOptionError = (field, errorMsg) => {
  return {
    type: types.LOANDETAILS_SET_BUTTON_OPTION_ERROR,
    field,
    errorMsg
  }
}

export const changeMultipleButtonOptionValue = (data, field) => {
  const value = data.value;
  const description = data.description;
  return (dispatch, getState) => {
    let valueArray = getState().loanDetailsReducer[field].value;
    valueArray.push(value);
    let descriptionArray = getState().loanDetailsReducer[field].description;
    descriptionArray.push(description)
    dispatch(setErrorMessage(""));
    dispatch({
      type: types.LOANDETAILS_MULTIPLE_BUTTON_OPTION_CHANGE,
      valueArray,
      descriptionArray,
      field
    });
  };
}

export const deleteMultipleButtonOptionValue = (data, field) => {
  return (dispatch, getState) => {
    // const value = data.value;
    let valueArray = getState().loanDetailsReducer[field].value;
    let descriptionArray = getState().loanDetailsReducer[field].description;

    const toRemoveValue = data.value;
    const index = valueArray.indexOf(toRemoveValue);
    valueArray.splice(index, 1);

    const toRemoveDescription = data.description;
    const indexDescription = descriptionArray.indexOf(toRemoveDescription);
    descriptionArray.splice(indexDescription, 1);

    dispatch({
      type: types.LOANDETAILS_DELETE_MULTIPLE_BUTTON_OPTION_CHANGE,
      value: valueArray,
      description: descriptionArray,
      field
    });
  };
}

//handle dropdown focus
export const setDropdownFocusStatus = (isFocus, field) => {
  return (dispatch) => {
    dispatch({
      type: types.LOANDETAILS_DROPDOWN_FOCUS,
      isFocus,
      field
    });
  };
}

//choose item from dropdown
export const selectDropdownItem = (value, description, field) => {
  return (dispatch, getState) => {
    let errorMsg = '';
    const purchasePrice = getState().loanDetailsReducer.purchasePrice.value;
    const loanAmount = getState().loanDetailsReducer.loanAmount.value;
    const homeLoanOutstanding = getState().loanDetailsReducer.homeLoanOutstanding.value;
    const formData = getState().commonReducer.appData;
    const errorMsgList = formData.errorMsgs;
    const loanDetailsData = formData.loanDetails.labels;
    const minHDBPurchase = loanDetailsData.hdbMinPurchasePrice;
    const minCondoPurchase = loanDetailsData.condoMinPurchasePrice;
    const minPriceCondo = parseFloat(minCondoPurchase).toFixed(2);
    const minPriceHDB = parseFloat(minHDBPurchase).toFixed(2) ;
    const loanPropertyType = getState().loanDetailsReducer.loanPropertyType.value;
    const loanType = getState().loanDetailsReducer.loanType.value;
    const onOffLoanPackage = getState().commonReducer.appData.loanDetails.loanPackage.onOffLoanPackage;
    // const loanPackage = getState().loanDetailsReducer.loanPackage;
    // const filteredLoanPackageList = getState().loanDetailsReducer.filteredLoanPackageList;

    if (description === 'HDB' && parseFloat(purchasePrice) < minPriceHDB) {
      errorMsg = errorMsgList.minAmountMsg.replace("{number}", minPriceHDB);
      dispatch(handleErrorMessage("purchasePrice" , errorMsg));
    } else if ( description !== 'HDB' && parseFloat(purchasePrice) < minPriceCondo ) {
      errorMsg = errorMsgList.minAmountMsg.replace("{number}", minPriceCondo);
      dispatch(handleErrorMessage("purchasePrice" , errorMsg));
    } else {
      dispatch(handleClearErrorMessage('purchasePrice'));
    }

    if ( description === 'HDB' && parseInt(loanAmount, 10) < parseInt(loanDetailsData.hdbMinLoanAmount, 10) ) {
      errorMsg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.hdbMinLoanAmount);
      dispatch(handleErrorMessage("loanAmount" , errorMsg));
    } else if ( description !== 'HDB' && parseInt(loanAmount, 10) < parseInt(loanDetailsData.condoMinLoanAmount, 10) ) {
      errorMsg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.condoMinLoanAmount);
      dispatch(handleErrorMessage("loanAmount" , errorMsg));
    } else {
      dispatch(handleClearErrorMessage('loanAmount'));
    }


    if ( description === 'HDB' && parseInt(homeLoanOutstanding, 10) < parseInt(loanDetailsData.hdbMinLoanAmount, 10) ) {
      errorMsg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.hdbMinLoanAmount);
      dispatch(handleErrorMessage("homeLoanOutstanding" , errorMsg));
    } else if ( description !== 'HDB' && parseInt(homeLoanOutstanding, 10) < parseInt(loanDetailsData.condoMinLoanAmount, 10) ) {
      errorMsg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.condoMinLoanAmount);
      dispatch(handleErrorMessage("homeLoanOutstanding" , errorMsg));
    } else {
      dispatch(handleClearErrorMessage('homeLoanOutstanding'));
    }

    dispatch({
      type: types.LOANDETAILS_DROPDOWN_ITEM_SELECT,
      value,
      field,
      description
    })

    if(onOffLoanPackage && field === "loanPropertyType" && loanType === ""){
      dispatch(filterLoanPackage(value, ""));
    } else if ( onOffLoanPackage && field === "loanPropertyType" && loanType !== ""){
      dispatch(filterLoanPackage(value, loanType));
    }

    if(onOffLoanPackage && field === "loanType" && loanPropertyType === "") {
      dispatch(filterLoanPackage("", value))
    } else if ( onOffLoanPackage && field === "loanType" && loanPropertyType !== "") {
      dispatch(filterLoanPackage(loanPropertyType, value))
    }

    if(!onOffLoanPackage && field === "loanPropertyType") {
      dispatch(setDefaulLoanPackage(value));
    }
  };
}

//change search in dropdown
export const changeSearchInputValue = (searchValue, field) => {
  return (dispatch) => {
    dispatch({
      type: types.LOANDETAILS_DROPDOWN_SEARCH_INPUT_CHANGE,
      searchValue,
      field
    });
  };
}

// handle on text change
export const handleTextInputChange = (data, field) => {
  return (dispatch, getState) => {
    const loanType = getState().loanDetailsReducer.loanType;
    const propertyType = getState().loanDetailsReducer.loanPropertyType.value;
    const formData = getState().commonReducer.appData;
    const errorMsgList = formData.errorMsgs;
    const loanDetailsData = formData.loanDetails.labels;
    const purchasePrice = getState().loanDetailsReducer.purchasePrice.value;
    const maxLoanAmount = getState().loanDetailsReducer.loanAmount.maxAmount;
    let errorMsg = data.errorMsg;
    let isValid = data.isValid;
    const minHDBPurchase = loanDetailsData.hdbMinPurchasePrice;
    const minCondoPurchase = loanDetailsData.condoMinPurchasePrice;
    const loanRate = parseFloat(loanDetailsData.loanRate);

    if ( field === 'purchasePrice' && (propertyType === 'EC' || propertyType === 'PC')) {
        const minPriceCondo = parseFloat(minCondoPurchase).toFixed(2);
        if(parseFloat(data.value, 10) < minPriceCondo) {
          errorMsg = errorMsgList.minAmountMsg.replace("{number}", minPriceCondo);
          isValid = false;
        }
      }

    if ( field === 'purchasePrice' && (propertyType === 'HDB' )) {
        const minPriceHDB = parseFloat(minHDBPurchase).toFixed(2) ;
        if(parseFloat(data.value, 10) < minPriceHDB) {
          errorMsg = errorMsgList.minAmountMsg.replace("{number}", minPriceHDB);
          isValid = false;
        }
      }

    if ( field === 'loanAmount' && (purchasePrice === '' || purchasePrice === '0')) {
      return;
    }

    if ( field === "purchasePrice" && propertyType === '') {
      return;
    }

    if( field === 'purchasePrice' && data.isValid) {
        const loanAmount = parseInt((parseFloat(data.value) / 100) * (loanRate * 100) , 10);
        dispatch(setLoanAmountValue(loanAmount.toString()));

        if(parseInt(data.value, 10) === 0  || parseInt(loanAmount,10) === 0) {
          dispatch(clearLoanAmountValue())
        }

        if ((propertyType === 'EC' || propertyType === 'PC') && loanAmount < parseInt(loanDetailsData.condoMinLoanAmount, 10)) {
          const msg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.condoMinLoanAmount);
          dispatch(handleErrorMessage("loanAmount" , msg))
        }

        if ((propertyType === 'HDB' ) && loanAmount < parseInt(loanDetailsData.hdbMinLoanAmount,10)) {
          const msg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.hdbMinLoanAmount);
          dispatch(handleErrorMessage("loanAmount" , msg))
        }
    }

    if (field === 'loanAmount') {
      if ((propertyType === 'EC' || propertyType === 'PC') && data.value < parseInt(loanDetailsData.condoMinLoanAmount, 10)) {
        const msg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.condoMinLoanAmount);
        dispatch(handleErrorMessage("loanAmount" , msg))
      }

      if ((propertyType === 'HDB' ) && data.value  < parseInt(loanDetailsData.hdbMinLoanAmount,10)) {
        const msg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.hdbMinLoanAmount);
        dispatch(handleErrorMessage("loanAmount" , msg))
      }
    }

    if (field === 'loanAmount' && data.isValid && parseInt((data.value),10) > parseInt((maxLoanAmount),10)) {
      isValid = false;
      errorMsg = errorMsgList.maxAmountMsg.replace("{number}", maxLoanAmount);
    }

    if (field === 'loanAmount') {
      if ((propertyType === 'EC' || propertyType === 'PC') && parseInt(data.value,10) < parseInt(loanDetailsData.condoMinLoanAmount , 10)) {
        errorMsg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.condoMinLoanAmount);
        isValid = false;
      }

      if ((propertyType === 'HDB' ) && parseInt(data.value,10) < parseInt(loanDetailsData.hdbMinLoanAmount,10)) {
        errorMsg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.hdbMinLoanAmount);
        isValid = false;
      }
    }

    if(field === 'homeLoanOutstanding' && (loanType.value === '2' || loanType.value === '3')) {
      if ((propertyType === 'EC' || propertyType === 'PC') && parseInt(data.value,10) < parseInt(loanDetailsData.condoMinLoanAmount , 10)) {
        errorMsg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.condoMinLoanAmount);
        isValid = false;
      }

      if ((propertyType === 'HDB' ) && parseInt(data.value,10) < parseInt(loanDetailsData.hdbMinLoanAmount,10)) {
        errorMsg = errorMsgList.minAmountMsg.replace("{number}", loanDetailsData.hdbMinLoanAmount);
        isValid = false;
      }
    }

    dispatch({
      type: types.LOANDETAILS_TEXT_INPUT_CHANGE,
      value: data.value,
      field,
      isValid: isValid,
      errorMsg: errorMsg,
      isInitial: data.isInitial
    });
  };
}

// handle toggle
export const handleIstoggled = (field, isToggled) => {
  return(dispatch) => {
    dispatch({
      type: types.LOANDETAILS_IS_TOGGLE,
      field,
      isToggled : !isToggled
    })
  }
}

export const setLoanAmountValue = (value) => {
  return {
    type: types.LOANDETAILS_SET_LOAN_AMOUNT_VALUE,
    value
  }
}

export const clearLoanAmountValue = () => {
  return (dispatch) => {
    dispatch({
      type: types.LOANDETAILS_CLEAR_LOAN_AMOUNT_VALUE
    })
  }
}

export const clearMaxAmountValue = () => {
  return (dispatch) => {
    dispatch({
      type: types.LOANDETAILS_CLEAR_LOAN_MAX_AMOUNT_VALUE
    })
  }
}

export const setDateOfTop = (date) => {
  return (dispatch) => {
    dispatch({
      type: types.LOANDETAILS_SET_DATE_OF_TOP,
      date
    })
  }
}

export const changeRadioOptionValue = (packageCode, description, field) => {
  return (dispatch) => {
    dispatch(setErrorMessage(""));
    dispatch({
      type: types.LOANDETAILS_RADIO_OPTION_CHANGE,
      packageCode,
      description,
      field
    });
  };
}

// export const getLoanPackage = (redirectToErrorPage) => {
//   return (dispatch) => {
//   dispatch(setMyInfoFlowStatus(true));
//   Config.getPackage().then(response => {
//     const loanPackage = response;
//     dispatch({
//       type: types.STORE_LOAN_PACKAGE,
//       loanPackage
//     });
//     dispatch(setMyInfoFlowStatus(false));
//    }).catch(e => {
//      if (e.response && e.response.status === 400) {
//        dispatch(setErrorWithValue("linkExpired"));
//        redirectToErrorPage && redirectToErrorPage();
//      } else if (e.response && e.response.status === 500) {
//        dispatch(setErrorWithValue("serviceDown"));
//        redirectToErrorPage && redirectToErrorPage();
//      } else {
//        dispatch(setErrorWithValue("badRequest"));
//        redirectToErrorPage && redirectToErrorPage();
//      }
//      dispatch(setMyInfoFlowStatus(false));
//    });
//   }
// }

export const filterLoanPackage = (propertyType, loanType) => {
  return (dispatch, getState) => {
    const loanPackageList = getState().loanDetailsReducer.loanPackageList;
    let loanPackageTypeCode = 14;
    let loanPackageIpaIndicator = "001";
    switch (propertyType) {
      case "EC":
        loanPackageTypeCode = 3;
        break;

      case "PC":
        loanPackageTypeCode = 3;
        break;

      case "HDB":
        loanPackageTypeCode = 14;
        break;

      default:
        loanPackageTypeCode = 14;
        break;
    }

    switch (loanType.toString()) {
      case "0":
        if(propertyType === "EC"){
          loanPackageIpaIndicator = "004";
        } else {
          loanPackageIpaIndicator = "002";
        }
        break;

      case "1":
        if(propertyType === "EC"){
          loanPackageIpaIndicator = "005";
        } else {
          loanPackageIpaIndicator = "003";
        }
        break;
      case "2" :
        loanPackageIpaIndicator = "006";
        break;

      case "3" :
        loanPackageIpaIndicator = "006";
        break;

      default:
        loanPackageIpaIndicator = "001";
        break;
    }

    let filteredLoanPackageList = loanPackageList.filter(x => x.loanPackageTypeCode === loanPackageTypeCode && x.loanPackageIpaIndicator === loanPackageIpaIndicator);

    if (filteredLoanPackageList.length > 0 ) {
      dispatch(clearSelectedLoanPackage())
    }

    if ( filteredLoanPackageList.length === 0 ) {
      dispatch(setDefaulLoanPackage(propertyType))
    }

    dispatch({
      type: types.SET_FILTERED_LOAN_PACKAGE,
      filteredLoanPackageList
    });

  }
}

export const setLoanPackageRequired = (field, isValid, errorMsg) => {
  return (dispatch) => {
    dispatch ({
      type: types.SET_SLIDER_ERROR,
      field,
      errorMsg,
      isValid
    })
  }
}

export const clearSliderError = (field , isValid, errorMsg) => {
  return (dispatch) => {
    dispatch({
      type: types.CLEAR_SLIDER_ERROR,
      field,
      isValid,
      errorMsg
    })
  }
}

export const setDefaulLoanPackage = (propertyType) => {
  return (dispatch, getState) => {
    const loanPackageList = getState().loanDetailsReducer.loanPackageList;
    let loanPackageTypeCode = 14;
    let loanPackageIpaIndicator = "001";

    switch (propertyType) {
      case "EC":
        loanPackageTypeCode = 3;
        break;

      case "PC":
        loanPackageTypeCode = 3;
        break;

      case "HDB":
        loanPackageTypeCode = 14;
        break;

      default:
        loanPackageTypeCode = 14;
        break;
    }

    let filteredLoanPackageList = loanPackageList.filter(x => x.loanPackageTypeCode === loanPackageTypeCode && x.loanPackageIpaIndicator === loanPackageIpaIndicator);

    const defaultPackageCode = filteredLoanPackageList && filteredLoanPackageList.length > 0 && filteredLoanPackageList[0] && filteredLoanPackageList[0].loanPackageCode ? filteredLoanPackageList[0].loanPackageCode : '';
    const defaultPackageDesc = filteredLoanPackageList && filteredLoanPackageList.length > 0 && filteredLoanPackageList[0] && filteredLoanPackageList[0].loanPackageDescription ? filteredLoanPackageList[0].loanPackageDescription : '' ;

    dispatch({
      type: types.SET_DEFAULT_LOAN_PACKAGE,
      defaultPackageCode,
      defaultPackageDesc
    })
  }
}

const clearSelectedLoanPackage = () => {
  return {
    type: types.CLEAR_SELECTED_LOAN_PACKAGE
  }
}
