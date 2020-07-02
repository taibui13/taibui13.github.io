import store from '../store/configureStore';

export const getMsgError = () => {
  return store.getState().commonReducer.msg;
}