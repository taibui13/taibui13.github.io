import { combineReducers } from 'redux';
import commonReducer from './commonReducer';
import onBoardReducer from '../containers/onBoard/modules/onBoardReducer';

export default combineReducers({
    commonReducer,
    onBoardReducer
});
