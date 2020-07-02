/* global GLOBAL_CONFIG */
export default {
    getMessage: getMsg,
    getUsers: "/users"
}

function getMsg() {
  return  GLOBAL_CONFIG.message;
}