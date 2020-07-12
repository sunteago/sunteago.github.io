import initialState from './initialState';
import tokenAuth from '../../config/tokenAuth';
import {
    LOG_IN_SUCCEED,
    LOG_IN_ERROR,
    CREATE_ACCOUNT_SUCCEED,
    CREATE_ACCOUNT_ERROR,
    LOG_OUT,
    GET_USER,
    UPDATE_SETTINGS_SUCCEED,
    UPDATE_SETTINGS_FAILED,
    CLEAN_USER_SETTINGS,
    GET_SETTINGS
} from '../../types';


export default (state, action) => {
    // console.log("State:", state);
    // console.log("Action:", action);
    switch (action.type) {
        case CREATE_ACCOUNT_SUCCEED:
        case LOG_IN_SUCCEED:
        case GET_USER:
            tokenAuth(action.payload.token);
            localStorage.setItem("acoron_token", action.payload.token);
            return {
                ...state,
                authenticated: true,
                user: action.payload.user,
                token: action.payload.token
            }
        case LOG_OUT:
            return {
                ...state,
                token: '',
                authenticated: false,
                name: ''
            }
        case LOG_IN_ERROR:
            return {
                ...state,
                loginError: action.payload
            }
        case CREATE_ACCOUNT_ERROR:
            return {
                ...state,
                signupError: action.payload
            }
        case UPDATE_SETTINGS_SUCCEED:
            return {
                ...state,
                user: {
                    ...state.user,
                    avatar: action.payload.avatar,
                    settings: action.payload.settings
                }
            }
        case CLEAN_USER_SETTINGS:
            return {
                ...initialState
            }
        default:
            return { ...state };
    }
}
