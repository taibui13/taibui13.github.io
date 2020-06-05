import * as types from './actionTypes';

export const dispatchUpdateUploadProgress = (id, progress) => {
  return (dispatch) => {
    dispatch({
      type: types.FILEUPLOAD_UPDATE_UPLOADING_PROGRESS,
      id,
      progress
    });
  }
}


export const dispatchUploadFile = (id, name, size, fileType, content) => {
  return (dispatch) => {
    dispatch({
      type: types.FILEUPLOAD_RECEIVED_UPLOADED_FILE,
      id,
      name,
      size,
      fileType, 
      content
    });
  }
}

export const dispatchErrorMsg = (id, errorMsg) => {
  return (dispatch) => {
    dispatch({
      type: types.FILEUPLOAD_SET_ERROR_MESSAGE,
      id,
      errorMsg
    });
  }
}

export const dispatchResetUploadStatus = (id) => {
  return {
    type: types.FILEUPLOAD_RESET_UPLOAD_STATUS,
    id
  }
}

export const setShowUploadDocument = (isShow) => {
  return (dispatch) => {
    dispatch({
      type: types.SHOW_UPLOAD_DOCUMENT,
      isShow
    });
  }
}
