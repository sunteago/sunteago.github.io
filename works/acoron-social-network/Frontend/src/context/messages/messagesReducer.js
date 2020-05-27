import {
    GET_MESSAGES_SUCCEED,
    GET_MESSAGES_ERROR,
    DELETE_MESSAGE_SUCCEED,
    DELETE_MESSAGE_ERROR,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_ERROR
} from '../../types';

export default (state, action) => {
    switch (action.type) {
        case GET_MESSAGES_SUCCEED:
        case DELETE_MESSAGE_SUCCEED:
            return {
                ...state,
                messages: action.payload
            }
        case SEND_MESSAGE_SUCCESS:
        default:
            return {
                ...state
            }
    }
}