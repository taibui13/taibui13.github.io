import * as types from './../actions/actionTypes';

const initialAdditionalIdState = {
  additionalLegalIdCountry: {
    name: 'additionalLegalIdCountry',
    isValid: true,
    isFocus: false,
    value: '',
    searchValue: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false,
    description: ''
  },
  additionalLegalId: {
    name: 'additionalLegalId',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true
  },
  additionalLegalIdExpiryDate: {
    name: 'additionalLegalIdExpiryDate',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true
  },
  additionalLegalIdIssueCountry: {
    name: 'additionalLegalIdIssueCountry',
    isValid: true,
    isFocus: false,
    value: '',
    searchValue: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false,
    description: ''
  }
}

const initialState = {
  dateOfBirth: {
    name: 'dateOfBirth',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false
  },
  gender: {
    name: 'gender',
    isValid: true,
    value: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false
  },
  maritalStatus: {
    name: 'maritalStatus',
    isValid: true,
    isFocus: false,
    value: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false,
    description: ''
  },
  educationLevel: {
    name: 'educationLevel',
    isValid: true,
    isFocus: false,
    value: '',
    searchValue: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false,
    description: ''
  },
  race: {
    name: 'race',
    isValid: true,
    isFocus: false,
    value: '',
    searchValue: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false,
    description: ''
  },
  nationality: {
    name: 'nationality',
    isValid: true,
    isFocus: false,
    value: '',
    searchValue: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false,
    description: ''
  },
  countryOfBirth: {
    name: 'countryOfBirth',
    isValid: true,
    isFocus: false,
    value: '',
    searchValue: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false,
    description: ''
  },
  countryOfResidence: {
    name: 'countryOfResidence',
    isValid: true,
    isFocus: false,
    value: 'SG',
    searchValue: '',
    errorMsg: '',
    isInitial: true,
    isMyInfo: false,
    description: ''
  },
  hasDualNationality: {
    isToggled: false
  },
  ...initialAdditionalIdState
};

const personalDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.PERSONALDETAILS_DROPDOWN_FOCUS:
      return { ...state, [action.field]: { ...state[action.field], isFocus: action.isFocus }};

    case types.PERSONALDETAILS_DROPDOWN_ITEM_SELECT:
      return { ...state, [action.field]: { ...state[action.field], value: action.value , description: action.description, isValid: true, errorMsg: '', isInitial: false }};

    case types.PERSONALDETAILS_DROPDOWN_SEARCH_INPUT_CHANGE:
      return { ...state, [action.field]: { ...state[action.field], searchValue: action.searchValue }};

    case types.MYINFO_SET_PERSONAL_DETAIL_DATA:
      return {
        ...state,
        dateOfBirth: { ...state.dateOfBirth, value: action.dateOfBirth, isMyInfo: true, isInitial: false },
        gender: { ...state.gender, value: action.gender, isMyInfo: true, isInitial: false },
        race: { ...state.race, value: action.race, isMyInfo: true, isInitial: false },
        maritalStatus: { ...state.maritalStatus, value: action.maritalStatus, isMyInfo: true, isInitial: false },
        educationLevel: { ...state.educationLevel, value: action.educationLevel, isMyInfo: true, isInitial: false },
        nationality: { ...state.nationality, value: action.nationality, isMyInfo: true, isInitial: false },
        countryOfBirth: { ...state.countryOfBirth, value: action.countryOfBirth, isMyInfo: true, isInitial: false },
      };

    case types.PERSONALDETAILS_PREVIOUS_DATA:
        return {
          ...state,
          countryOfResidence : {...state.countryOfResidence, value: action.countryOfResidence},
          hasDualNationality: { ...state.hasDualNationality, isToggled: action.hasDualNationality },
          additionalLegalIdCountry: { ...state.additionalLegalIdCountry, value: action.additionalLegalIdCountry },
          additionalLegalId: { ...state.additionalLegalId, value: action.additionalLegalId },
          additionalLegalIdExpiryDate: { ...state.additionalLegalIdExpiryDate, value: action.additionalLegalIdExpiryDate },
          additionalLegalIdIssueCountry: { ...state.additionalLegalIdIssueCountry, value: action.additionalLegalIdIssueCountry },
        };

    case types.PERSONALDETAILS_TEXT_INPUT_CHANGE:
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

    case types.PERSONALDETAILS_CHANGE_GENDER_OPTION:
      return {
        ...state,
        gender: { ...state.gender, value: action.value, isValid: true, errorMsg: '' }
      };

    case types.PERSONALDETAILS_SET_PERSONAL_GENDER_OPTION_ERROR:
      return {
        ...state,
        gender: { ...state.gender, isValid: false, errorMsg: action.errorMsg }
      };

   case types.SET_ERROR_MESSAGE_INPUT:
      return {
        ...state,
        [action.field]: {...state[action.field], errorMsg: action.errorMsg, isValid: false}
      }
      
    case types.SET_TOGGLE_OPTION:
      return {
        ...state,
        [action.field]: {isToggled: action.isToggled}
      }

    case types.CLEAR_ADDITIONAL_ID:
      return {
        ...state,
        ...initialAdditionalIdState
      }

    default:
      return state;
  }
}

export default personalDetailsReducer;
