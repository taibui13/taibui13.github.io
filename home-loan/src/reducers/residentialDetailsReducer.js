import * as types from './../actions/actionTypes';

const initialState = {
  propertyType: {
    name: 'propertyType',
    isValid: true,
    value: '',
    searchValue: '',
    errorMsg: '',
    isInitial: true
  },
  mailingPropertyType: {
    name: 'mailingPropertyType',
    isValid: true,
    value: '',
    searchValue: '',
    errorMsg: '',
    isInitial: true
  },
  mailingAddress: {
    isToggled: false
  },
  country: {
    name: 'country',
    isValid: true,
    isFocus: false,
    value: 'SG',
    searchValue: '',
    errorMsg: '',
    isInitial: true
  },
  overseasAddress1:{
    name: 'overseasAddress1',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  overseasAddress2:{
    name: 'overseasAddress2',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  overseasAddress3:{
    name: 'overseasAddress1',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  overseasAddress4:{
    name: 'overseasAddress4',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  },
  city:{
    name: 'city',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true
  }
};

const residentialDetailsReducer = (state = initialState, action) =>{
  switch (action.type) {
    case types.RESIDENTIALDETAILS_TEXT_INPUT_CHANGE:
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
    case types.RESIDENTIALDETAILS_IS_TOGGLED:
      return {
        ...state,
        mailingAddress: {
          ...state.mailingAddress,
          isToggled: action.isToggled
        }
      };

    case types.MYINFO_SET_RESIDENTIAL_DETAIL_MAILING_DATA:
      return {
        ...state,
        mailingAddress: {...state.mailingAddress, isToggled: true},
        mailingPropertyType: { ...state.propertyType, value: action.propertyType, isInitial: false},
        country: {...state.country, value: action.country , isInitial: false},
        overseasAddress1: {...state.overseasAddress1 , value: action.overseasAddress1 , isInitial: false},
        overseasAddress2: {...state.overseasAddress2 , value: action.overseasAddress2 , isInitial: false},
        overseasAddress3: {...state.overseasAddress3 , value: action.overseasAddress3 , isInitial: false},
        overseasAddress4: {...state.overseasAddress4 , value: action.overseasAddress4 , isInitial: false},
        city: {...state.city , value: action.city , isInitial: true}
      };

    case types.MYINFO_SET_RESIDENTIAL_DETAIL_DATA:
      return {
        ...state,
        propertyType: { ...state.propertyType, value: action.propertyType, isInitial: false}
      };

    case types.RESIDENTIALDETAILS_DROPDOWN_FOCUS:
      return { ...state, [action.field]: { ...state[action.field], isFocus: action.isFocus }};

    case types.RESIDENTIALDETAILS_DROPDOWN_ITEM_SELECT:
      return { ...state, [action.field]: { ...state[action.field], value: action.value , description: action.description, isValid: true, errorMsg: '', isInitial: false }};

    case types.RESIDENTIALDETAILS_DROPDOWN_SEARCH_INPUT_CHANGE:
      return { ...state, [action.field]: { ...state[action.field], searchValue: action.searchValue }};

    case types.SET_ERROR_MESSAGE_INPUT:
      return {
        ...state,
        [action.field]: {...state[action.field], errorMsg: action.errorMsg, isValid: false}
      };

    default:
      return state;
  }
}

export default residentialDetailsReducer;
