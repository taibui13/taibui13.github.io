const DASH_BOARD= "DASH_BOARD";
export const Action = {
    GET_DATA: `${DASH_BOARD}_GET_DATA`,
    SET_DATA: `${DASH_BOARD}_GET_DATA`,
    SET_STATUS: `${DASH_BOARD}_SET_STATUS`,
    FILTER_USER: `${DASH_BOARD}_SELECT_DATA`,
}
  
export default {
    [Action.GET_DATA]: handleData,
    [Action.SET_DATA]: handleData,
    [Action.SET_STATUS]: handleData,
    [Action.FILTER_USER]: filterData
}

function handleData(state, action) {
  return { ...state, [action.payload.field]: action.payload.data };
}


function filterData(state, action) {
  let users = action.payload.data;
  let value = "";

  if (action.payload.value) {
    users = users.filter(e => {
      value = e[action.payload.fieldName.toLowerCase()] || "";
      return value.toLowerCase().includes(action.payload.value.toLowerCase());
    })
  } else {
    users = state.originalUser;
  }
  return { ...state, [action.payload.field]: users };
}

