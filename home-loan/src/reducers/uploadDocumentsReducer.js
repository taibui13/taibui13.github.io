import * as types from './../actions/actionTypes';

const initialState = {
  showUploadDocuments: false,

  paySlip: {
    fileSize: '',
    inputValue: '',
    progress: 0,
    isValid: true,
    errorMsg: '',
    fileType: '',
    content: ''
  },
  tenancyAgreement: {
    fileSize: '',
    inputValue: '',
    progress: 0,
    isValid: true,
    errorMsg: '',
    fileType: '',
    content: ''
  },
  bankStatement: {
    fileSize: '',
    inputValue: '',
    progress: 0,
    isValid: true,
    errorMsg: '',
    fileType: '',
    content: ''
  },
  additionalPassport: {
    fileSize: '',
    inputValue: '',
    progress: 0,
    isValid: true,
    errorMsg: '',
    fileType: '',
    content: ''
  }
}

const uploadDocumentsReducer = (state= initialState , action) => {
  switch (action.type) {
    case types.SHOW_UPLOAD_DOCUMENT:
      return {
        ...state,
        showUploadDocuments : action.isShow
      };


    case types.FILEUPLOAD_UPDATE_UPLOADING_PROGRESS:
      return {
        ...state,
        [action.id]: { ...state[action.id], progress: action.progress }
      };

    case types.FILEUPLOAD_RECEIVED_UPLOADED_FILE:
      return {
        ...state,
        [action.id]: { ...state[action.id], inputValue: action.name, fileSize: action.size, isValid: true, errorMsg: '', status: true, fileType: action.fileType, content: action.content }
      };

    case types.FILEUPLOAD_SET_ERROR_MESSAGE:
      return {
        ...state,
        [action.id]: { ...state[action.id], isValid: false, errorMsg: action.errorMsg }
      };

    case types.FILEUPLOAD_UPDATE_TOGGLE_STATUS:
      return {
        ...state,
        [action.field]: { ...state[action.field], isToggled: action.isToggled }
      };

    case types.FILEUPLOAD_RESET_UPLOAD_STATUS:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          progress: 0,
          isValid: true,
          errorMsg: '',
          status: false,
          inputValue: '',
          fileSize: ''
        }
      };

    default:
      return state
  }
}

export default uploadDocumentsReducer;
