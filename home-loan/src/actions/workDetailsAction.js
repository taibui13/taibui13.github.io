import * as types from './actionTypes';
import { groupByCode, getValueByCode } from './../common/utils';
import { handleClearErrorMessage } from './commonAction';

//handle work Details
export const handleTextInputChange = (data, field) => {
  return (dispatch, getState) => {
    const lengthOfEmploymentYears = getState().workDetailsReducer.lengthOfEmploymentYears;
    const lengthOfEmploymentMonths = getState().workDetailsReducer.lengthOfEmploymentMonths;
    const givesAll = getState().workDetailsReducer.givesAll;

    const less16 = ((lengthOfEmploymentYears.isValid
      && lengthOfEmploymentYears.value !== ''
      && parseInt(lengthOfEmploymentYears.value, 10) <= 1)
      && (lengthOfEmploymentMonths.isValid
        && lengthOfEmploymentMonths.value !== ''
        && parseInt(lengthOfEmploymentMonths.value, 10) < 4)) ? true : false;

    let isValid = data.isValid;
    let errorMsg = data.errorMsg;
    if (field === 'monthlyRentalIncome' && data.value.length < 1) {
      isValid = true;
      errorMsg = '';
    }

    if (field === 'eligibleFinancialAssets' && data.value.length < 1) {
      isValid = true;
      errorMsg = '';
    }

    if (field === 'monthlyVariableIncome' && data.value.length < 1) {
      isValid = true;
      errorMsg = '';
    }

    if (field === 'monthlyFixedIncome' && data.value.length < 1 && givesAll && !less16) {
      isValid = true;
      errorMsg = '';
    }

    dispatch({
      type: types.WORK_TEXT_INPUT_CHANGE,
      value: data.value,
      field,
      isValid: isValid,
      errorMsg: errorMsg,
      isInitial: data.isInitial
    });
  };
}

export const handleIstoggled = (field, isToggled) => {
  return (dispatch) => {
    dispatch({
      type: types.WORK_IS_TOGGLED,
      field,
      isToggled: !isToggled
    })
  }
}

export const workDropdownFocus = (field, isFocus) => {
  return (dispatch) => {
    dispatch({
      type: types.WORK_DROPDOWN_FOCUS,
      field,
      isFocus
    })
  }
}

export const workSelectDropdownItem = (value, description, field, key) => {
  return (dispatch, getState) => {
    const keys = key ? key : '';
    dispatch({
      type: types.WORK_DROPDOWN_ITEM_SELECT,
      value,
      description,
      field,
      key: keys
    });
  }
}

export const changeSearchInputValue = (searchValue, field) => {
  return (dispatch) => {
    dispatch({
      type: types.WORK_DROPDOWN_SEARCH_INPUT_CHANGE,
      searchValue,
      field
    });
  };
}

export const setWorkDetailData = (obj, incomeObj, allowFutureDate) => {
  return (dispatch) => {

    const yearlyIncome = incomeObj && incomeObj.incomeVerified && incomeObj.incomeVerified !== [] && incomeObj.incomeVerified.length > 0 ? [groupByCode(incomeObj.incomeVerified, 'year')] : [];

    let givesAll = false;
    let onlyNOA = false;
    let noData = false;
    let displayOnlyNOA = false;
    let assessableIncome = '';
    let assessYear = '';
    let rentalIncome = '';
    let isThereRental = false;
    let isThereCatergory = false;
    let isThereTaxClearance = '';

    yearlyIncome.map((row, i) => {
      const objects = Object.keys(row);
      const objSort = objects.sort((a, b) => {
        return b - a;
      });

      const assessableIncomeData = getValueByCode("YearlyAssessableIncome", row[objSort[0]]) ? getValueByCode("YearlyAssessableIncome", row[objSort[0]]) : '';
      const employmentIncomeData = getValueByCode("YearlyEmploymentIncome", row[objSort[0]]) ? getValueByCode("YearlyEmploymentIncome", row[objSort[0]]) : '';
      const tradeIncomeData = getValueByCode("YearlyTradeIncome", row[objSort[0]]) ? getValueByCode("YearlyTradeIncome", row[objSort[0]]) : '';
      const rentalIncomeData = getValueByCode("YearlyRentIncome", row[objSort[0]]) ? getValueByCode("YearlyRentIncome", row[objSort[0]]) : '';
      const catergoryData = getValueByCode("YearlyCategory", row[objSort[0]]) ? getValueByCode("YearlyCategory", row[objSort[0]]) : '';
      const taxClearanceData = getValueByCode("YearlyTaxClearance", row[objSort[0]]) ? getValueByCode("YearlyTaxClearance", row[objSort[0]]) : '';
      const interestIncomeData = getValueByCode("YearlyInterestIncome", row[objSort[0]]) ? getValueByCode("YearlyInterestIncome", row[objSort[0]]) : '';

      const assessableIncomeDataYearTwo = objects.length > 1 && getValueByCode("YearlyAssessableIncome", row[objSort[1]]) ? getValueByCode("YearlyAssessableIncome", row[objSort[1]]) : '';
      const employmentIncomeDataYearTwo = objects.length > 1 && getValueByCode("YearlyEmploymentIncome", row[objSort[1]]) ? getValueByCode("YearlyEmploymentIncome", row[objSort[1]]) : '';
      const tradeIncomeDataYearTwo = objects.length > 1 && getValueByCode("YearlyTradeIncome", row[objSort[1]]) ? getValueByCode("YearlyTradeIncome", row[objSort[1]]) : '';
      const rentalIncomeDataYearTwo = objects.length > 1 && getValueByCode("YearlyRentIncome", row[objSort[1]]) ? getValueByCode("YearlyRentIncome", row[objSort[1]]) : '';
      const catergoryDataYearTwo = objects.length > 1 && getValueByCode("YearlyCategory", row[objSort[1]]) ? getValueByCode("YearlyCategory", row[objSort[1]]) : '';
      // const taxClearanceDataYearTwo = objects.length > 1 && getValueByCode("YearlyTaxClearance",  row[objSort[1]]) ? getValueByCode("YearlyTaxClearance",  row[objSort[1]]) : '';
      const interestIncomeDataYearTwo = objects.length > 1 && getValueByCode("YearlyInterestIncome", row[objSort[1]]) ? getValueByCode("YearlyInterestIncome", row[objSort[1]]) : '';

      const givesAllData = assessableIncomeData !== '' && (employmentIncomeData !== '' || tradeIncomeData !== '' || rentalIncomeData !== '' || taxClearanceData !== '' || interestIncomeData !== '');

      const onlyNOAData = assessableIncomeData !== '' && employmentIncomeData === '' && tradeIncomeData === '' && rentalIncomeData === '' && taxClearanceData === '' && interestIncomeData === '';
      const onlyNOADataYearTwo = assessableIncomeDataYearTwo !== '' && employmentIncomeDataYearTwo === '' && tradeIncomeDataYearTwo === '' && rentalIncomeDataYearTwo === '' && interestIncomeDataYearTwo !== '';

      const noDataGiven = assessableIncomeData === '' && employmentIncomeData === '' && tradeIncomeData === '' && rentalIncomeData === '' && taxClearanceData === '' && interestIncomeData === '';
      const noDataGivenYearTwo = assessableIncomeDataYearTwo === '' && employmentIncomeDataYearTwo === '' && tradeIncomeDataYearTwo === '' && rentalIncomeDataYearTwo === '' && taxClearanceData === '' && interestIncomeDataYearTwo === '';

      isThereRental = rentalIncomeData !== "" || rentalIncomeDataYearTwo !== "" ? true : false;
      isThereCatergory = catergoryData !== "" || catergoryDataYearTwo !== "" ? true : false;

      if (givesAllData) {
        givesAll = true;
        assessableIncome = assessableIncomeData;
        assessYear = objSort[0] ? objSort[0] : '';
        isThereTaxClearance = taxClearanceData === "YES" ? true : false;
        const newDate = new Date();
        const getCurrentFullYear = (newDate.getFullYear()).toString();
        const getPreviousFullYear = (newDate.getFullYear() - 1).toString();


        if (allowFutureDate && allowFutureDate === true ) {
          // Rental Income no current year and previous year
          if (parseInt(rentalIncomeData, 10) > 0) {
            rentalIncome = parseInt(rentalIncomeData, 10) > 0 ? parseInt((parseInt(rentalIncomeData, 10) / 12), 10).toString() : "";
          }
        } else {
          if (parseInt(rentalIncomeData, 10) > 0 && (assessYear === getCurrentFullYear || assessYear === getPreviousFullYear)) {
            rentalIncome = parseInt(rentalIncomeData, 10) > 0 ? parseInt((parseInt(rentalIncomeData, 10) / 12), 10).toString() : "";
          }
        }

        if (rentalIncome !== "") {
          dispatch(handleCheckToggled("declareIncome", true))
        }
      } else {
        if (assessableIncomeData !== '') {
          onlyNOA = true;
          assessableIncome = assessableIncomeData;
          assessYear = objSort[0] ? objSort[0] : '';
        } else {
          if (assessableIncomeDataYearTwo !== '') {
            onlyNOA = true;
            assessableIncome = assessableIncomeDataYearTwo;
            assessYear = objSort[1] ? objSort[1] : '';
          } else {
            noData = true;
          }
        }
      }

      if (onlyNOAData && noDataGivenYearTwo) {
        displayOnlyNOA = true;
      } else if (noDataGiven && onlyNOADataYearTwo) {
        displayOnlyNOA = true;
      }

      return { givesAll, onlyNOA, noData, displayOnlyNOA, assessYear, assessableIncome, rentalIncome, isThereRental, isThereCatergory, isThereTaxClearance }
    });

    if (yearlyIncome.length < 1) {
      noData = true;
    }

    dispatch({
      type: types.MYINFO_SET_WORK_DETAIL_DATA,
      cpfcontributions: obj && obj.cpfContributions ? obj.cpfContributions : [],
      incomeVerified: incomeObj && incomeObj.incomeVerified ? incomeObj.incomeVerified : [],
      yearlyIncome,
      givesAll,
      onlyNOA,
      noData,
      assessYear: assessYear !== '' && assessYear !== null && assessYear.toLowerCase() !== 'null' && assessYear.toLowerCase() !== 'na' ? assessYear : '',
      assessableIncome,
      displayOnlyNOA,
      rentalIncome,
      isThereRental,
      isThereCatergory,
      isThereTaxClearance
    })
  }
}

export const setNameOfBusiness = (obj) => {
  let nameOfEmployer = '';
  if (nameOfEmployer === '') {
    const cpfcontributions = obj.cpfContributions && obj ? obj.cpfContributions : [];
    if (cpfcontributions.length > 0) {
      nameOfEmployer = cpfcontributions[0].employer;
    }
  }
  return {
    type: types.MYINFO_SET_WORK_NAME_OF_EMPLOYER,
    nameOfEmployer
  }
}

export const setPreviousApplicationWorkDetails = (incomeObj, employersObj, additionalDetailsObj) => {
  let currentJobYears = '';
  let currentJobMonths = '';
  let prevJobYears = '';
  let prevJobMonths = '';

  const getObjectByCode = (code, list) => {
    const item = list.find(x => x.type === code);
    return item ? item : null;
  }

  const currentEmployment = employersObj && getObjectByCode("C", employersObj);
  const previousEmployment = employersObj && getObjectByCode("P", employersObj);

  if (currentEmployment.length > 0) {
    currentJobYears = (Math.floor(currentEmployment.length / 12)).toString();
    currentJobMonths = (currentEmployment.length % 12).toString();
  }

  if (previousEmployment && previousEmployment.length > 0) {
    prevJobYears = (Math.floor(previousEmployment.length / 12)).toString();
    prevJobMonths = (previousEmployment.length % 12).toString();
  }

  let incomeDeclare = false;
  if (incomeObj.incomeSelfDeclare &&
    ((incomeObj.incomeSelfDeclare.monthlyFixed !== '' && incomeObj.incomeSelfDeclare.monthlyFixed !== null)
      || (incomeObj.incomeSelfDeclare.monthlyTrade !== '' && incomeObj.incomeSelfDeclare.monthlyTrade !== null)
      || (incomeObj.incomeSelfDeclare.monthlyVariabl !== '' && incomeObj.incomeSelfDeclare.monthlyVariable !== null))) {
    incomeDeclare = true;
  }

  let previousCompany = false;
  // if(previousEmployment && parseInt(currentJobYears, 10) < 3 ) {
  //   previousCompany = false;
  // }

  const workingInSg = additionalDetailsObj && additionalDetailsObj.workingInSg && additionalDetailsObj.workingInSg === 'N' ? false : true;
  const incomeFromMoreThanOnejob = additionalDetailsObj && additionalDetailsObj.incomeFromMoreThanOnejob && additionalDetailsObj.incomeFromMoreThanOnejob === 'N' ? false : true;

  const withJobTitleC = employersObj && (currentEmployment.natureOfEmployment === "SALARIED" || currentEmployment.natureOfEmployment === "SELFE2" || currentEmployment.natureOfEmployment === "SELFE")

  return {
    type: types.SET_WORK_DETAILS_PREVIOUS_DATA,
    natureOfEmployment: currentEmployment && currentEmployment.natureOfEmployment ? currentEmployment.natureOfEmployment : '',
    jobTitle: currentEmployment && currentEmployment.jobTitle && withJobTitleC ? currentEmployment.jobTitle : '',
    industry: currentEmployment && currentEmployment.industry !== "NOINC" && currentEmployment.industry ? currentEmployment.industry : '',
    lengthOfEmploymentYears: currentJobYears,
    lengthOfEmploymentMonths: currentJobMonths,
    incomeDeclare,
    monthlyFixedIncome: incomeObj && incomeObj.incomeSelfDeclare && incomeObj.incomeSelfDeclare.monthlyFixed !== null ? (incomeObj.incomeSelfDeclare.monthlyFixed).toString() : '',
    monthlyRentalIncome: incomeObj && incomeObj.incomeSelfDeclare && incomeObj.incomeSelfDeclare.monthlyRental !== null ? (incomeObj.incomeSelfDeclare.monthlyRental).toString() : '',
    monthlyTradeIncome: incomeObj && incomeObj.incomeSelfDeclare && incomeObj.incomeSelfDeclare.monthlyTrade !== null ? (incomeObj.incomeSelfDeclare.monthlyTrade).toString() : '',
    monthlyVariableIncome: incomeObj && incomeObj.incomeSelfDeclare && incomeObj.incomeSelfDeclare.monthlyVariable !== null ? (incomeObj.incomeSelfDeclare.monthlyVariable).toString() : '',
    eligibleFinancialAssets: incomeObj && incomeObj.incomeSelfDeclare && incomeObj.incomeSelfDeclare.eligibleFinancialAsset !== null ? (incomeObj.incomeSelfDeclare.eligibleFinancialAsset).toString() : '',
    workingInSg,
    anotherJob: incomeFromMoreThanOnejob,
    previousJobTitle: employersObj && previousEmployment && previousEmployment.jobTitle ? previousEmployment.jobTitle : '',
    previousIndustry: employersObj && previousEmployment && previousEmployment.industry && previousEmployment.industry !== "NOINC" ? previousEmployment.industry : '',
    lengthOfPreviousEmploymentYears: prevJobYears,
    lengthOfPreviousEmploymentMonths: prevJobMonths,
    nameOfPreviousCompany: employersObj && previousEmployment && previousEmployment.name ? previousEmployment.name : '',
    previousCompany,
    nameOfEmployer: currentEmployment && currentEmployment.name && currentEmployment.name !== 'NA' ? currentEmployment.name : ''
  }
}

export const setExpandedTableRow = (i, status, field) => {
  return (dispatch, getState) => {
    Promise.resolve().then(() => {
      let openRows = getState().workDetailsReducer[field].openRows;
      if (status) {
        openRows.push(i);
      } else {
        const index = openRows.indexOf(i);
        openRows.splice(index, 1);
      }
      dispatch({
        type: types.WORK_SET_CPF_TABLE_EXPANDED_ROW,
        openRows,
        field
      });
    })
  }
}


export const setWorkDetailsDropdownError = (field, errorMsg) => {
  return (dispatch) => {
    dispatch({
      type: types.WORK_DETAILS_SET_DROPDOWN_ERROR,
      errorMsg,
      field
    });
  };
}

export const setWorkDetailsTextInputRequiredError = (field, errorMsg) => {
  return (dispatch) => {
    dispatch({
      type: types.WORK_DETAILS_SET_TEXT_INPUT_REQUIRED_ERROR,
      errorMsg,
      field
    });
  };
}

export const setWorkDetailsToggleError = (field, errorMsg) => {
  return {
    type: types.WORK_DETAILS_SET_TOGGLE_ERROR,
    field,
    errorMsg
  }
}

export const setWorkDetailsWorkingSg = (status) => {
  return (dispatch) => {
    dispatch({
      type: types.WORK_DETAILS_SET_WORKING_SG,
      status
    })
  }
}

export const clearOptionalField = () => {
  return (dispatch, getState) => {
    const lengthOfEmploymentYears = getState().workDetailsReducer.lengthOfEmploymentYears;
    const lengthOfEmploymentMonths = getState().workDetailsReducer.lengthOfEmploymentMonths;
    const givesAll = getState().workDetailsReducer.givesAll;

    const less16 = ((lengthOfEmploymentYears.isValid
      && lengthOfEmploymentYears.value !== ''
      && parseInt(lengthOfEmploymentYears.value, 10) <= 1)
      && (lengthOfEmploymentMonths.isValid
        && lengthOfEmploymentMonths.value !== ''
        && parseInt(lengthOfEmploymentMonths.value, 10) < 4)) ? true : false;

    if (lengthOfEmploymentYears.value !== '' && lengthOfEmploymentMonths.value !== '' && givesAll && !less16) {
      dispatch(handleClearErrorMessage("monthlyFixedIncome"))
    }
  }
}


export const handleCheckToggled = (field, status) => {
  return (dispatch) => {
    dispatch({
      type: types.WORK_DETAILS_SET_TOGGLE,
      field,
      status
    })
  }
}
