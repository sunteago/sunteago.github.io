import React, { useReducer } from 'react';
import UserContext from './userContext';
import UserReducer from './userReducer';
import axiosConfig from '../../config/axios';
import tokenAuth from '../../config/tokenAuth';
import initialState from './initialState';

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

const UserState = (props) => {

    const [state, dispatch] = useReducer(UserReducer, initialState);

    const cleanUserSettings = () => {
        dispatch({
            type: CLEAN_USER_SETTINGS
        })
    }

    const getSettings = async (user) => {
        const avatarPath = !user.avatar
            ? ''
            : `${process.env.REACT_APP_BACKEND_URL}/${user.avatar}`;

        const userdata = {
            avatar: avatarPath,
            settings: {
                status: user.settings.status,
                theme: user.settings.theme,
                privacity: user.settings.privacity
            }
        };
        dispatch({
            type: GET_SETTINGS,
            payload: { ...userdata }
        })
    }

    const updateSettings = async (form, history) => {
        const formData = new FormData();
        if (form.avatar.name) formData.append('avatar', form.avatar);
        formData.append('status', form.status);
        formData.append('theme', form.theme);
        formData.append('privacity', form.privacity);
        try {
            const response = await axiosConfig.post('/user/settings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const { settings, avatar } = response.data
            const avatarPath = !avatar
                ? ''
                : `${process.env.REACT_APP_BACKEND_URL}/${avatar}`;
            dispatch({
                type: UPDATE_SETTINGS_SUCCEED,
                payload: {
                    avatar: avatarPath,
                    settings: settings
                }
            });
            history();
        } catch (err) {
            try {
                dispatch({
                    action: UPDATE_SETTINGS_FAILED,
                    payload: { error: 'Updating settings failed' }
                })
            } catch(err) {
                throw new Error('Internal Server Error');
            }
        }
    };


    const authenticatedUser = async () => {
        const token = localStorage.getItem('acoron_token');
        if (!token) return;
        tokenAuth(token);
        try {
            const response = await axiosConfig.get("/auth/user");
            dispatch({
                type: GET_USER,
                payload: { ...response.data.user, token }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const createAccount = async (signupData, history) => {
        try {
            const response = await axiosConfig.post('/auth/create-account', signupData);
            console.log("response? ",response);
            history.push('/');
            dispatch({
                type: CREATE_ACCOUNT_SUCCEED,
                payload: response.data
            })
        } catch (err) {
            return err.response.data.errors;
        }
    }

    const logIn = async user => {
        if (user.password.trim() === '' || user.email.trim() === '') {
            dispatch({
                type: LOG_IN_ERROR,
                payload: 'Please, complete all the fields'
            })
            return;
        }
        try {
            const response = await axiosConfig.post('/auth/log-in', { user });
            console.log(response);
            dispatch({
                type: LOG_IN_SUCCEED,
                payload: response.data
            })
        } catch (err) {
            try {
                dispatch({
                    type: LOG_IN_ERROR,
                    payload: err.response.data.message
                })
            } catch (err) {
                //CODIGO FEO
                dispatch({
                    type: LOG_IN_ERROR,
                    payload: 'There was a problem with the server, please try again later'
                })
            }
        }
    }

    const logOut = (history) => {
        localStorage.removeItem('acoron_token');
        history.push('/');
        dispatch({
            type: LOG_OUT
        })
    };

    return (
        <UserContext.Provider value={{
            avatar: state.avatar,
            settings: state.settings,
            token: state.token,
            authenticated: state.authenticated,
            name: state.name,
            user: state.user,
            loginError: state.loginError,
            signupError: state.signupError,
            authenticatedUser,
            createAccount,
            logIn,
            logOut,
            cleanUserSettings,
            updateSettings,
            getSettings
        }}
        > {props.children}
        </UserContext.Provider >
    )
}

export default UserState;