import { Action } from './responseHandler';
import INITIAL_STATE from './initialState';
import responseHandler from './responseHandler';

export default function onBoardReducer(state = INITIAL_STATE, action) {
    const handler = responseHandler[action.type];
    state = action.type === Action.RESET_STATE ? INITIAL_STATE : state;
    return handler ? handler(state, action) : state;
}
