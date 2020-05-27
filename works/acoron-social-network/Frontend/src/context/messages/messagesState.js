import React, { useReducer } from 'react';
import messagesReducer from './messagesReducer';
import MessagesContext from './messagesContext';
import axiosConfig from '../../config/axios';
import { 
    GET_MESSAGES_SUCCEED, 
    GET_MESSAGES_ERROR,
    DELETE_MESSAGE_SUCCEED,
    DELETE_MESSAGE_ERROR,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_ERROR
} from '../../types';

const initialState = {
    messages: []
};

const MessagesState = (props) => {
    const [state, dispatch] = useReducer(messagesReducer, initialState);

    const getMessages = async () => {
        try {
            const response = await axiosConfig.get('/messages/get-all');
            dispatch({
                type: GET_MESSAGES_SUCCEED,
                payload: response.data.data
            });
        } catch (err) {
            dispatch({
                type: GET_MESSAGES_ERROR,
                payload: err
            })
        }
    }

    const deleteSingleMessage = async (messageId) => {
        try {
            const response = await axiosConfig.delete(`/messages/${messageId}`);
            //ahorra una nueva consulta a la base de datos
            if (response.status === 202) {
                dispatch({
                    type: DELETE_MESSAGE_SUCCEED,
                    payload: state.messages.filter(msg => msg._id !== messageId)
                });
            }
        } catch (err) {
            dispatch({
                type: DELETE_MESSAGE_ERROR,
                payload: err
            })
        }
    }

    const sendMessage = async (message) => {
        try {
            const response = await axiosConfig.post('/messages/create', message);
            if (response.status === 201) {
                dispatch({
                    type: SEND_MESSAGE_SUCCESS,
                    payload: message
                })
                return 'messageSucceed';
            }
        } catch (err) {
            dispatch({
                type: SEND_MESSAGE_ERROR,
                payload: message
            })
            return 'messageFailed';
        }
    }

    return (
        <MessagesContext.Provider value={{
            messages: state.messages,
            getMessages,
            deleteSingleMessage,
            sendMessage
        }}>
            {props.children}
        </MessagesContext.Provider>
    )
}

export default MessagesState;