import * as types from './../actions/actionTypes';

const initialState = {
  homeAddressFormat: '',
  homePostalCode: {
    name: 'homePostalCode',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isLoading: false,
    isReadOnly: false,
    count: 0,
    autoFilled: false
  },
  homeBlock: {
    name: 'homeBlock',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isReadOnly: false
  },
  homeStreet: {
    name: 'homeStreet',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isReadOnly: false
  },
  homeBuilding: {
    name: 'homeBuilding',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isReadOnly: false
  },
  homeLevel: {
    name: 'homeLevel',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isReadOnly: false
  },
  homeUnit: {
    name: 'homeUnit',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isReadOnly: false
  },
  mailingAddressFormat: '',
  mailingPostalCode: {
    name: 'mailingPostalCode',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isLoading: false,
    isReadOnly: false,
    count: 0
  },
  mailingBlock: {
    name: 'mailingBlock',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isReadOnly: false
  },
  mailingStreet: {
    name: 'mailingStreet',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isReadOnly: false
  },
  mailingBuilding: {
    name: 'mailingBuilding',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isReadOnly: false
  },
  mailingLevel: {
    name: 'mailingLevel',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isReadOnly: false
  },
  mailingUnit: {
    name: 'mailingUnit',
    value: '',
    isValid: true,
    errorMsg: '',
    isInitial: true,
    isReadOnly: false
  },
  prevData: false
};

const localAddressInputReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOCAL_ADDRESS_INPUT_CHANGE:
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

    case types.LOCAL_ADDRESS_INPUT_AUTO_FILL_IN:
      return {
        ...state,
        [`${action.addressType}AddressFormat`]: action.addressFormat,
        [`${action.addressType}PostalCode`]: {
          ...state[`${action.addressType}PostalCode`],
          isLoading: false,
          isReadOnly: false,
          autoFilled: true,
          count: action.count,
        },
        [`${action.addressType}Street`]: {
          ...state[`${action.addressType}Street`],
          value: action.street,
          isValid: true,
          isInitial: false,
          isReadOnly: true
        },
        [`${action.addressType}Block`]: {
          ...state[`${action.addressType}Block`],
          value: action.block,
          isValid: true,
          isInitial: false,
          isReadOnly: true
        },
        [`${action.addressType}Building`]: {
          ...state[`${action.addressType}Building`],
          value: action.building,
          isValid: true,
          isInitial: false,
          isReadOnly: true
        }
      };

    case types.LOCAL_ADDRESS_INPUT_AUTO_FILL_IN_FAIL:
      return {
        ...state,
        [`${action.addressType}PostalCode`]: {
          ...state[`${action.addressType}PostalCode`],
          isValid: false,
          errorMsg: 'is Invalid',
          isReadOnly: false,
          isLoading: false,
          autoFilled: false,
          count: action.count,
        },
        [`${action.addressType}Street`]: {
          ...state[`${action.addressType}Street`],
          isReadOnly: false,
          isInitial: true,
          value: '',
        },
        [`${action.addressType}Block`]: {
          ...state[`${action.addressType}Block`],
          isReadOnly: false,
          isInitial: true,
          value: ''
        },
        [`${action.addressType}Building`]: {
          ...state[`${action.addressType}Building`],
          isReadOnly: false,
          isInitial: true,
          value: ''
        }
      };

    case types.LOCAL_ADDRESS_INPUT_RESET_AUTO_FILL_IN_STATUS:
      return {
        ...state,
        [`${action.addressType}PostalCode`]: {
          ...state[`${action.addressType}PostalCode`],
          isReadOnly: false,
          isLoading: false,
          autoFilled: false,
          count: 10
        },
        [`${action.addressType}Street`]: {
          ...state[`${action.addressType}Street`],
          isReadOnly: false,
          isInitial: true,
          value: ''
        },
        [`${action.addressType}Block`]: {
          ...state[`${action.addressType}Block`],
          isReadOnly: false,
          isInitial: true,
          value: ''
        },
        [`${action.addressType}Building`]: {
          ...state[`${action.addressType}Building`],
          isReadOnly: false,
          isInitial: true,
          value: ''
        }
      };

    case types.LOCAL_ADDRESS_INPUT_SERVICE_DOWN:
      return {
        ...state,
        [`${action.addressType}PostalCode`]: {
          ...state[`${action.addressType}PostalCode`],
          isReadOnly: false,
          isLoading: false,
          autoFilled: false,
          count: 10
        }
      };

    case types.IS_GETTING_LOCAL_ADDRESS:
      return {
        ...state,
        [`${action.addressType}PostalCode`]: {
          ...state[`${action.addressType}PostalCode`],
          isLoading: action.isLoading
        }
      };

    case types.LOCAL_ADDRESS_SET_TEXT_INPUT_REQUIRED_ERROR:
      return {
        ...state,
        [action.field]: { ...state[action.field], errorMsg: action.errorMsg, isValid: false }
      };

    case types.LOCAL_ADDRESS_MYINFO_SET_DATA:
      return {
        ...state,
        homePostalCode: { ...state.homePostalCode, value: action.homePostalCode, isReadOnly: true, autoFilled: true, isInitial: false },
        homeBlock: { ...state.homeBlock, value: action.homeBlock, isReadOnly: true, isInitial: false },
        homeStreet: { ...state.homeStreet, value: action.homeStreet, isReadOnly: true, isInitial: false },
        homeLevel: { ...state.homeLevel, value: action.homeLevel, isReadOnly: true, isInitial: false },
        homeUnit: { ...state.homeUnit, value: action.homeUnit, isReadOnly: true, isInitial: false },
        homeBuilding: { ...state.homeBuilding, value: action.homeBuilding, isReadOnly: true, isInitial: false }
      };

    case types.MAILING_ADDRESS_MYINFO_SET_DATA:
      return {
        ...state,
        mailingPostalCode: { ...state.mailingPostalCode, value: action.mailingPostalCode, isInitial: false},
        mailingBlock: { ...state.mailingBlock, value: action.mailingBlock, isInitial: false },
        mailingStreet: { ...state.mailingStreet, value: action.mailingStreet, isInitial: false },
        mailingLevel: { ...state.mailingLevel, value: action.mailingLevel, isInitial: false },
        mailingUnit: { ...state.mailingUnit, value: action.mailingUnit, isInitial: false },
        mailingBuilding: { ...state.mailingBuilding, value: action.mailingBuilding, isInitial: false },
        prevData: true
      };

    case types.LOCAL_ADDRESS_SET_NOT_REQUIRED:
      return {
        ...state,
        [action.field]: { ...state[action.field], isValid: true, errorMsg: '' }
      };

    case types.SET_ERROR_MESSAGE_INPUT:
       return {
         ...state,
         [action.field]: {...state[action.field], errorMsg: action.errorMsg, isValid: false}
       };

    default:
      return state;
  }
}

export default localAddressInputReducer;
