import React, { useReducer } from 'react';
import thoughtsReducer from './thoughtsReducer';
import ThoughtsContext from './thoughtsContext';
import axiosConfig from '../../config/axios';
import {
    GET_THOUGHTS_SUCCEED,
    GET_THOUGHTS_ERROR,
    GET_THOUGHT_SUCCEED,
    GET_THOUGHT_ERROR,
    LIKE_SUCCEED,
    LIKE_ERROR,
    CREATE_THOUGHT_SUCCEED,
    CREATE_THOUGHT_ERROR,
    CREATE_COMMENT_SUCCEED,
    CREATE_COMMENT_ERROR,
    DELETE_COMMENT_SUCCEED,
    DELETE_COMMENT_ERROR,
    DELETE_THOUGHT_SUCCEED,
    DELETE_THOUGHT_ERROR,
    LIKE_COMMENT_SUCCEED,
    LIKE_COMMENT_ERROR
} from '../../types';


const initialState = {
    thoughts: [],
    currentThought: {},
};

const ThoughtsState = ({ children }) => {

    const [state, dispatch] = useReducer(thoughtsReducer, initialState);

    const getThoughts = async () => {
        try {
            const thoughts = await axiosConfig.get('/thoughts/get-all');
            dispatch({
                type: GET_THOUGHTS_SUCCEED,
                payload: thoughts.data
            });
        } catch (err) {
            dispatch({
                type: GET_THOUGHTS_ERROR,
                payload: err
            });
            return false;
        }
    }

    const getThought = async (slug) => {
        try {
            const thought = await axiosConfig.get(`/thoughts/get-single/${slug}`);
            dispatch({
                type: GET_THOUGHT_SUCCEED,
                payload: thought.data
            });
        } catch (err) {
            dispatch({
                type: GET_THOUGHT_ERROR,
                payload: err
            })
        }
    }

    const createThought = async (content) => {
        const text = { content };
        try {
            await axiosConfig.post('/thoughts/create-new', { thought: text });
            dispatch({
                type: CREATE_THOUGHT_SUCCEED
            })
            return false;
        } catch (err) {
            let error = 'There was an error publishing thought';
            if (err.response) {
                error = err.response.data.message;
            }
            dispatch({
                type: CREATE_THOUGHT_ERROR,
                err: error
            })
            return error;
        }
    }

    const createComment = async (content, thoughtId) => {
        const text = { content };
        try {
            await axiosConfig.post(`/thoughts/${thoughtId}/comment`, text);
            dispatch({
                type: CREATE_COMMENT_SUCCEED
            })
            return false;
        } catch (err) {
            let error = 'There was an error publishing thought';
            if (err.response) {
                error = err.response.data.message;
            }
            dispatch({
                type: CREATE_COMMENT_ERROR,
                err: error
            })
            return error;

        }
    }

    //repetido, hacer un context
    const deleteThought = async ({ thoughtId }, history) => {
        try {
            const response = await axiosConfig.delete(`/thoughts/${thoughtId}`);
            if (response.status === 202) {
                dispatch({
                    type: DELETE_THOUGHT_SUCCEED,
                    payload: state.thoughts.filter(tho => tho._id !== thoughtId)
                });
                if (state.currentThought._id === thoughtId && history) {
                    history.push('/')
                }
                return true;
            }
        } catch (err) {
            dispatch({
                type: DELETE_THOUGHT_ERROR,
                payload: err
            });
            return false;
        }
    }


    const deleteComment = async ({ thoughtId, commentId }) => {
        try {
            const response = await axiosConfig.delete(`/thoughts/${thoughtId}/comment/${commentId}`);
            if (response.status === 202) {
                const newState = state.currentThought.comments.filter(comment => (
                    comment._id !== commentId
                ));
                dispatch({
                    type: DELETE_COMMENT_SUCCEED,
                    payload: newState
                })
                return true;
            }
        } catch (err) {
            dispatch({
                type: DELETE_COMMENT_ERROR,
                payload: err
            })
            return false;
        }
    }

    const likeThought = async (thoughtId, userId) => {
        try {
            const response = await axiosConfig.post(`/thoughts/${thoughtId}/like`);
            if (response.status === 201) {
                let newState = {
                    thoughts: state.thoughts.map(thought => {
                        if (thought._id === thoughtId) {
                            thought.likes++;
                            thought.whoLiked.push(userId);
                        }
                        return thought;
                    })
                }
                if (state.currentThought._id === thoughtId) {
                    const likes = state.currentThought.likes;
                    newState.currentThought = {
                        ...state.currentThought,
                        likes: likes + 1
                    };
                }
                dispatch({
                    type: LIKE_SUCCEED,
                    payload: newState
                })
            }
        } catch (err) {
            dispatch({
                type: LIKE_ERROR,
                payload: err
            });
            return false;
        }
    }

    const likeComment = async (commentId, userId) => {
        try {
            const response = await axiosConfig.post(`/thoughts/${state.currentThought._id}/comment/like`, { commentId });
            if (response.status === 201) {
                const newState = { ...state.currentThought };
                newState.comments = state.currentThought.comments
                    .map(comment => {
                        if (comment._id === commentId) {
                            comment.likes++;
                            comment.whoLiked.push(userId);
                        }
                        return comment;
                    });
                dispatch({
                    type: LIKE_COMMENT_SUCCEED,
                    payload: newState
                })
            }
        } catch (err) {
            dispatch({
                type: LIKE_COMMENT_ERROR,
                payload: err
            })
            return false;
        }
    }




    return (
        <ThoughtsContext.Provider value={{
            thoughts: state.thoughts,
            currentThought: state.currentThought,
            getThoughts,
            getThought,
            createThought,
            createComment,
            deleteThought,
            likeThought,
            likeComment,
            deleteComment
        }}>
            {children}
        </ThoughtsContext.Provider>
    )

}

export default ThoughtsState; 