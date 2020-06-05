import * as types from './../actions/actionTypes';

const initialState = {
  natureOfEmployment: {
    name: 'natureOfEmployment',
    isValid: true,
    isFocus: false,
    value: '',
    searchValue:'',
    errorMsg: '',
    isInitial: true,
    description: ''
  },
  jobTitle: {
    name: 'jobTitle',
    isValid: true,
    isFocus: false,
    value: '',
    searchValue:'',
    errorMsg: '',
    isInitial: true,
    description: '',
    key:''
  },
  nameOfEmployer: {
    name: 'nameOfEmployer',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isReadOnly: false
  },
  industry: {
    name: 'industry',
    isValid: true,
    isFocus: false,
    value: '',
    searchValue:'',
    errorMsg: '',
    isInitial: true,
    description: '',
    key:''
  },
  isThereCatergory: false,
  isThereRental: false,
  assessYear: '',
  assessYearEmployment: '',
  assessYearTrade: '',
  assessableIncome: {
    name: 'assessableIncome',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    assessYear: ''
  },
  employmentIncome: {
    name: 'employmentIncome',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    assessYear: ''
  },
  tradeIncome: {
    name: 'tradeIncome',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    assessYear: ''
  },
  lengthOfEmploymentYears: {
    name: 'lengthOfEmploymentYears',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },

  lengthOfEmploymentMonths: {
    name: 'lengthOfEmploymentMonths',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  nameOfPreviousCompany: {
    name: 'nameOfPreviousCompany',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  lengthOfPreviousEmploymentYears: {
    name: 'lengthOfPreviousEmploymentYears',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  lengthOfPreviousEmploymentMonths: {
    name: 'lengthOfPreviousEmploymentMonths',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  previousJobTitle: {
    name: 'previousJobTitle',
    isValid: true,
    isFocus: false,
    value: '',
    searchValue:'',
    errorMsg: '',
    isInitial: true,
    key:''
  },
  previousIndustry: {
    name: 'previousIndustry',
    isValid: true,
    isFocus: false,
    value: '',
    searchValue:'',
    errorMsg: '',
    isInitial: true,
    key:''
  },
  monthlyFixedIncome: {
    name: 'monthlyFixedIncome',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  monthlyRentalIncome: {
    name: 'monthlyRentalIncome',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  monthlyTradeIncome: {
    name: 'monthlyTradeIncome',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  annualTradeIncome: {
    name: 'annualTradeIncome',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  monthlyVariableIncome: {
    name: 'monthlyVariableIncome',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  eligibleFinancialAssets: {
    name: 'eligibleFinancialAssets',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  cpfcontributions: {
    name: 'cpfcontributions',
    openRows: [],
    value: []
  },
  yearlyIncome: {
    name: 'yearlyIncome',
    openRows: [0, 1],
    value: []
  },
  incomeVerified: [],
  assessableIncomeArray: [],
  employmentIncomeArray: [],
  tradeIncomeArray: [],
  givesAll: false,
  onlyNOA: false,
  noData: false,
  displayOnlyNOA: false,
  anotherJob: {
    isToggled: false,
    isValid: true,
    errorMsg: ''
  },
  workInSG: {
    isToggled: false,
    isValid: true,
    errorMsg: ''
  },
  declareIncome: {
    isToggled: false,
    isValid: true,
    errorMsg: ''
  },
  declareIncomeY: {
    isToggled: true,
    isValid: true,
    errorMsg: ''
  },
  previousCompany: {
    isToggled: false,
    isValid: true,
    errorMsg: ''
  },
  isThereTaxClearance: ''
};

const workDetailsReducer = (state= initialState , action) => {
  switch (action.type) {
    case types.WORK_DROPDOWN_FOCUS:
    return { ...state, [action.field]: { ...state[action.field], isFocus: action.isFocus }};

    case types.WORK_DROPDOWN_ITEM_SELECT:
      return { ...state, [action.field]: { ...state[action.field], value: action.value, isValid: true, errorMsg: '', description: action.description , key: action.key , isInitial: false}};

    case types.WORK_DROPDOWN_SEARCH_INPUT_CHANGE:
       return { ...state, [action.field]: { ...state[action.field], searchValue: action.searchValue }};

    case types.WORK_TEXT_INPUT_CHANGE:
     return {
       ...state,
       [action.field]: {
         ...state[action.field],
         value: action.value,
         isValid: action.isValid,
         errorMsg: action.errorMsg,
         isInitial: false
       }
     };

     case types.MYINFO_SET_WORK_DETAIL_DATA:
       return {
           ...state,
           assessYear: action.assessYear,
           assessableIncome: { ...state.assessableIncome, value:action.assessableIncome, isInitial: false },
           monthlyRentalIncome: {...state.monthlyRentalIncome, value:action.rentalIncome, isInitial: false},
           nameOfEmployer: { ...state.nameOfEmployer, value:action.nameOfEmployer, isInitial: false },
           cpfcontributions: { ...state.cpfcontributions, value: action.cpfcontributions },
           yearlyIncome: { ...state.yearlyIncome, value: action.yearlyIncome },
           incomeVerified: action.incomeVerified,
           assessableIncomeArray : action.assessableIncomeArray,
           employmentIncomeArray: action.employmentIncomeArray,
           tradeIncomeArray: action.tradeIncomeArray,
           givesAll: action.givesAll,
           onlyNOA: action.onlyNOA,
           noData: action.noData,
           displayOnlyNOA: action.displayOnlyNOA,
           isThereRental: action.isThereRental,
           isThereCatergory: action.isThereCatergory,
           isThereTaxClearance: action.isThereTaxClearance
         };

    case types.SET_WORK_DETAILS_PREVIOUS_DATA:
      return {
        ...state,
        natureOfEmployment: { ...state.natureOfEmployment, value: action.natureOfEmployment , isInitial: false },
        jobTitle: { ...state.jobTitle, value: action.jobTitle , isInitial: false },
        industry: { ...state.industry, value: action.industry , key: action.industry , isInitial: true },
        lengthOfEmploymentYears: { ...state.lengthOfEmploymentYears, value: action.lengthOfEmploymentYears , isInitial: false },
        lengthOfEmploymentMonths: { ...state.lengthOfEmploymentMonths, value: action.lengthOfEmploymentMonths , isInitial: false },
        monthlyVariableIncome: { ...state.monthlyVariableIncome, value: action.monthlyVariableIncome , isInitial: false },
        monthlyRentalIncome: { ...state.monthlyRentalIncome, value: action.monthlyRentalIncome , isInitial: false },
        monthlyTradeIncome: { ...state.monthlyTradeIncome, value: action.monthlyTradeIncome , isInitial: false },
        monthlyFixedIncome: { ...state.monthlyFixedIncome, value: action.monthlyFixedIncome , isInitial: false },
        eligibleFinancialAssets: { ...state.eligibleFinancialAssets, value: action.eligibleFinancialAssets , isInitial: false },
        declareIncome: {...state.declareIncome, isToggled: action.incomeDeclare},
        workInSG: {...state.workInSG, isToggled: action.workingInSg},
        anotherJob: {...state.anotherJob, isToggled: action.anotherJob},
        previousJobTitle: { ...state.previousJobTitle, value: action.previousJobTitle, isInitial: false },
        previousIndustry: { ...state.previousIndustry, value: action.previousIndustry , isInitial: true , key: action.previousIndustry },
        lengthOfPreviousEmploymentYears: { ...state.lengthOfPreviousEmploymentYears, value: action.lengthOfPreviousEmploymentYears , isInitial: false },
        lengthOfPreviousEmploymentMonths: { ...state.lengthOfPreviousEmploymentMonths, value: action.lengthOfPreviousEmploymentMonths , isInitial: false },
        nameOfPreviousCompany: { ...state.nameOfPreviousCompany, value: action.nameOfPreviousCompany , isInitial: false },
        previousCompany: {...state.previousCompany, isToggled: action.previousCompany, isInitial: false },
        nameOfEmployer: {...state.nameOfEmployer, value: action.nameOfEmployer, isInitial: false },
      };

    case types.WORK_SET_CPF_TABLE_EXPANDED_ROW:
      return { ...state, [action.field]: { ...state[action.field], openRows: action.openRows}};

    case types.WORK_DETAILS_SET_DROPDOWN_ERROR:
      return {
        ...state,
        [action.field]: { ...state[action.field], errorMsg: action.errorMsg, isValid: false }
      };

    case types.WORK_DETAILS_SET_TEXT_INPUT_REQUIRED_ERROR:
      return {
        ...state,
        [action.field]: { ...state[action.field], errorMsg: action.errorMsg, isValid: false }
      };

    case types.MYINFO_SET_WORK_NAME_OF_EMPLOYER:
      return {
        ...state,
        nameOfEmployer: { ...state.nameOfEmployer, value:action.nameOfEmployer, isInitial: false },
      };

      case types.WORK_IS_TOGGLED:
        return {
          ...state,
          [action.field]:{...state[action.field] , isToggled: action.isToggled, isValid: true, errorMsg: ''}
        };

      case types.WORK_DETAILS_SET_TOGGLE_ERROR:
        return {
          ...state,
          [action.field]: {
            ...state[action.field],
            isValid: false,
            errorMsg: action.errorMsg
          }
        };
    case types.SET_ERROR_MESSAGE_INPUT:
      return {
        ...state,
        [action.field]: {...state[action.field], errorMsg: action.errorMsg, isValid: false}
      }
    case types.WORK_DETAILS_SET_WORKING_SG:
      return {
        ...state,
        workInSG : {...state.workInSG, isToggled: action.status}
      }

    case types.CLEAR_ERROR_MESSAGE_INPUT:
      return {
        ...state,
        [action.field]: {...state[action.field] , errorMsg: '' , isValid: true}
      }

    case types.WORK_DETAILS_SET_TOGGLE:
      return {
        ...state,
        [action.field]: {...state[action.field], isToggled: action.status}
      }
    default:
      return state;
  }
}

export default workDetailsReducer;
