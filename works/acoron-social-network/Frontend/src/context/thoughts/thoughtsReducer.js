import {
    GET_THOUGHTS_SUCCEED,
    GET_THOUGHTS_ERROR,
    GET_THOUGHT_SUCCEED,
    GET_THOUGHT_ERROR,
    LIKE_SUCCEED,
    LIKE_ERROR,
    CREATE_THOUGHT_ERROR,
    CREATE_COMMENT_ERROR,
    DELETE_COMMENT_SUCCEED,
    DELETE_COMMENT_ERROR,
    DELETE_THOUGHT_SUCCEED,
    DELETE_THOUGHT_ERROR,
    LIKE_COMMENT_SUCCEED,
    LIKE_COMMENT_ERROR
} from '../../types';


export default (state, action) => {
    switch (action.type) {
        case DELETE_THOUGHT_SUCCEED:
        case GET_THOUGHTS_SUCCEED:
            return {
                ...state,
                thoughts: action.payload
            }
        case LIKE_SUCCEED:
            return {
                ...state,
                ...action.payload
            }
        case LIKE_COMMENT_SUCCEED:
            return {
                ...state,
                currentThought: action.payload
            }
        case GET_THOUGHT_SUCCEED:
            return {
                ...state,
                currentThought: action.payload
            }
        case DELETE_COMMENT_SUCCEED:
            return {
                ...state,
                currentThought: {
                    ...state.currentThought,
                    comments: action.payload
                }
            }
        case CREATE_COMMENT_ERROR:
        case CREATE_THOUGHT_ERROR:
        case GET_THOUGHT_ERROR:
        case LIKE_ERROR:
        case DELETE_THOUGHT_ERROR:
        case GET_THOUGHTS_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return { ...state };
    }
}