import * as types from './../actions/actionTypes';

const initialState = {
  loanPurpose: {
    name: 'loanPurpose',
    value: '0',
    isValid: true,
    errorMsg: ''
  },
  loanPropertyType: {
    name: 'loanPropertyType',
    isValid: true,
    isFocus: false,
    value: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false,
    description: ''
  },
  loanType: {
    name: 'loanType',
    isValid: true,
    isFocus: false,
    value: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false,
    description: ''
  },
  propertyUsage: {
    name: 'propertyUsage',
    value: '0',
    isValid: true,
    errorMsg: ''
  },
  purchasePrice: {
    name: 'purchasePrice',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true,
    isFocus: false
  },
  propertyConstructionStatus: {
    name: 'propertyConstructionStatus',
    value: '0',
    isValid: true,
    errorMsg: ''
  },
  dateOfTOP: {
    name: 'dateOfTOP',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true,
    isFocus: false
  },
  loanAmount: {
    name: 'loanAmount',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true,
    isFocus: false,
    maxAmount: ''
  },
  homeLoanOutstanding: {
    name: 'homeLoanOutstanding',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true,
    isFocus: false,
    maxAmount: ''
  },
  builtArea: {
    name: 'builtInArea',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true,
    isFocus: false
  },
  disbursementYear: {
    name: 'disbursementYear',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true,
    isFocus: false
  },
  isdirectPurchase: {
    isToggled: true
  },
  loanPackage: {
    description: '',
    packageCode: '',
    isValid: true,
    errorMsg: ''
  },
  loanPackageList: [],
  filteredLoanPackageList: [],
  jointBorrower: {
    isToggled: false
  },
  jointBorrowerFullName: {
    name: 'jointBorrowerFullName',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true
  },
  jointBorrowerNric: {
    name: 'jointBorrowerNric',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true
  },
  jointBorrowerEmail: {
    name: 'jointBorrowerEmail',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true
  },
  jointBorrowerMobileNumber: {
    name: 'jointBorrowerMobileNumber',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true
  },
  sourceOfFundsMLR: {
    name: 'sourceOfFundsMLR',
    value: ["1"],
    isValid: true,
    errorMsg: '',
    description: ["Personal Savings"]
  },
  sourceOfFundsDP: {
    name: 'sourceOfFundsDP',
    value: ["1"],
    isValid: true,
    errorMsg: '',
    description: ["Personal Savings"]
  },
  sourceOfWealth: {
    name: 'sourceOfWealth',
    value: ["1"],
    isValid: true,
    errorMsg: '',
    description: ["Business Ownership"]
  }
};

const loanDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOANDETAILS_BUTTON_OPTION_CHANGE:
      return { ...state, [action.field]: { ...state[action.field], value: action.value, isValid: true, errorMsg: '' }};

    case types.LOANDETAILS_MULTIPLE_BUTTON_OPTION_CHANGE:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.valueArray,
          description: action.descriptionArray,
          isValid: true,
          errorMsg: ''
        }
      };

    case types.LOANDETAILS_DELETE_MULTIPLE_BUTTON_OPTION_CHANGE:
      return {
        ...state ,
        [action.field] : {
          ...state[action.field],
          value : action.value,
          description: action.description,
          isValid: true,
          errorMsg: ''
        }
      };

    case types.LOANDETAILS_DROPDOWN_FOCUS:
      return { ...state, [action.field]: { ...state[action.field], isFocus: action.isFocus }};

    case types.LOANDETAILS_DROPDOWN_ITEM_SELECT:
      return { ...state, [action.field]: { ...state[action.field], value: action.value , description: action.description, isValid: true, errorMsg: '', isInitial: false }};

    case types.LOANDETAILS_DROPDOWN_SEARCH_INPUT_CHANGE:
      return { ...state, [action.field]: { ...state[action.field], searchValue: action.searchValue }};

    case types.LOANDETAILS_TEXT_INPUT_CHANGE:
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

    case types.LOANDETAILS_IS_TOGGLE:
      return {
        ...state,
        [action.field]: {...state[action.field] , isToggled: action.isToggled, isValid: true, errorMsg: ''}
      };

    case types.LOANDETAILS_SET_BUTTON_OPTION_ERROR:
      return {
        ...state,
        [action.field]: {...state[action.field], errorMsg: action.errorMsg, isValid: false}
      }

    case types.SET_ERROR_MESSAGE_INPUT:
      return {
        ...state,
        [action.field]: {...state[action.field], errorMsg: action.errorMsg, isValid: false}
      }

    case types.SET_LOAN_DETAILS_DATA:
      return {
        ...state,
        loanType: { ...state.loanType, value: action.loanType, isInitial: false },
        loanPropertyType: { ...state.loanPropertyType, value: action.loanPropertyType, isInitial: false },
        propertyUsage:{ ...state.propertyUsage, value: action.propertyUsage, isInitial: false },
        purchasePrice: { ...state.purchasePrice, value: action.purchasePrice, isInitial: false },
        dateOfTOP: { ...state.dateOfTOP, value: action.dateOfTOP, isInitial: false },
        homeLoanOutstanding: { ...state.homeLoanOutstanding, value: action.homeLoanOutstanding, isInitial: false },
        disbursementYear: { ...state.disbursementYear, value: action.firstDisbursementYear, isInitial: false },
        loanAmount: { ...state.loanAmount, value: action.loanAmount, isInitial: false },
        eligibleFinanialAssets:{ ...state.eligibleFinanialAssets, value: action.eligibleFinanialAssets, isInitial: false },
        isdirectPurchase: { ...state.isdirectPurchase, isToggled: action.isdirectPurchase, isInitial: false },
        loanPackage: { ...state.loanPackage, value: action.loanPackage, isInitial: false }
      }

    case types.SET_LOAN_DETAILS_JOINT_APPLICANT_DATA:
      return {
        ...state,
        jointBorrower: { ...state.jointBorrower, isToggled: action.jointBorrower, isInitial: false },
        jointBorrowerFullName: { ...state.jointBorrowerFullName, value: action.jointBorrowerFullName, isInitial: false },
        jointBorrowerNric: { ...state.jointBorrowerNric, value: action.jointBorrowerNric, isInitial: false },
        jointBorrowerEmail: { ...state.jointBorrowerEmail, value: action.jointBorrowerEmail, isInitial: false },
        jointBorrowerMobileNumber: { ...state.jointBorrowerMobileNumber, value: action.jointBorrowerMobileNumber, isInitial: false }
      }

    case types.SET_LOAN_DETAILS_ADDITIONAL_DETAILS_DATA:
      return {
        ...state,
        sourceOfFundsMLR: { ...state.sourceOfFundsMLR, value: action.sourceOfFundsMLR, isInitial: false },
        sourceOfWealth: { ...state.sourceOfWealth, value: action.sourceOfWealth, isInitial: false },
        sourceOfFundsDP: { ...state.sourceOfFundsDP, value: action.sourceOfFundsDP, isInitial: false }
      }

    case types.LOANDETAILS_SET_LOAN_AMOUNT_VALUE:
      return {
        ...state,
        loanAmount: { ...state.loanAmount, value: action.value, maxAmount: action.value, isValid: true, errorMsg: '', isInitial: false, isFocus: true }
      };

    case types.LOANDETAILS_CLEAR_LOAN_AMOUNT_VALUE:
      return {
        ...state,
        loanAmount: { ...state.loanAmount, value:'', maxAmount: '', isValid: true, errorMsg: '', isInitial: true, isFocus: false }
      };

    case types.LOANDETAILS_CLEAR_LOAN_MAX_AMOUNT_VALUE:
      return {
        ...state,
        loanAmount: { ...state.loanAmount, maxAmount: '', isValid: true, errorMsg: ''}
      }

    case types.CLEAR_ERROR_MESSAGE_INPUT:
      return {
        ...state,
        [action.field]: {...state[action.field] , errorMsg: '' , isValid: true}
      }

    case types.LOANDETAILS_SET_DATE_OF_TOP:
      return {
        ...state,
        dateOfTOP: { ...state.dateOfTOP, value: action.date, isInitial: false },
      }

    case types.LOANDETAILS_RADIO_OPTION_CHANGE:
      return { ...state, [action.field]: { ...state[action.field], description: action.description, packageCode: action.packageCode, isValid: true, errorMsg: ""}};

    case types.STORE_LOAN_PACKAGE:
      return {...state, loanPackageList: action.loanPackage, filteredLoanPackageList: action.loanPackage}

    case types.SET_FILTERED_LOAN_PACKAGE:
      return{...state, filteredLoanPackageList: action.filteredLoanPackageList}

    case types.SET_SLIDER_ERROR:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          isValid: action.isValid,
          errorMsg: action.errorMsg
        }
      }

    case types.CLEAR_SLIDER_ERROR:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          isValid: action.isValid,
          errorMsg: action.errorMsg
        }
      }

    case types.SET_DEFAULT_LOAN_PACKAGE:
      return {
        ...state,
        loanPackage:{
          ...state.loanPackage,
          description: action.defaultPackageDesc,
          packageCode: action.defaultPackageCode,
          isValid: true,
          errorMsg: ''
        }
      }

    case types.CLEAR_SELECTED_LOAN_PACKAGE:
      return {
        ...state,
        loanPackage:{
          ...state.loanPackage,
          description: '' ,
          packageCode: '' ,
          isValid: true ,
          errorMsg: ''
        }
      }
    default:
      return state;
  }
}

export default loanDetailsReducer;
