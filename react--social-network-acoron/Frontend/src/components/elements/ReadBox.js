import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsUp, faShareSquare, faEnvelope, faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import { formatDistance } from 'date-fns';
import { showedAvatar } from '../helpers';
import { Avatar } from '../elements';

const ReadBoxContainer = styled.div`
    box-shadow: 2px 2px 2px 2px var(--secondary-muted);
    background: var(--terciary);
    display: flex;
    text-decoration: none;
    color: var(--secondary);
`;

const ReadBoxBtn = styled(Link)`
    cursor: pointer;
    color: var(--secondary);
    opacity: 0.8;
    transition: opacity .1s ease-in;
    &:hover,
    &:focus {
        color: var(--secondary);
        opacity: 1;
    }
    font-size: 1.25rem;
`;


const ReadBoxContent = styled.div`
width: 100%;
    h3 {
        font-weight: bolder;
        font-size: 1.125rem;
    }
    h4 {font-size: 1.125rem}

    .publication-text {
    font-size: 0.875rem;
}
@media (max-width: 576px) {
        h3 {
            font-size: 1rem;
        }
        h4 {
            font-size: 0.875rem;
        }
        .owner-writing-box {
        font-size: 1rem;
    }
            .owner-writing-box::placeholder {
            color: var(--secondary);
            font-size: 1rem;
            letter-spacing: 1px;
        }   
    }
`;


const ReadBox = ({ type, data, viewerId, onDeleteHandler, authenticated, onLikeHandler, thoughtId }) => {
    let accountId = {}, content, likes, comments = [], _id, createdAt = 0, avatar, username, name;
    if (type === 'thought') {
        ({ accountId, content, likes, comments, _id, createdAt } = data);
        //check if accountId is broken or something to avoid the crashes in the app
        if (Object.entries(accountId).length > 0) ({ avatar, username, name } = accountId);
    } else if (type === 'comment') {
        ({ accountId, content, likes, _id, createdAt } = data);
        if (accountId) ({ avatar, username, name } = accountId);
    }

    const alreadyLiked = () => {
        return data.whoLiked.find(userId => userId === viewerId)
            ? 'var(--blue)'
            : ''
    }

    return (
        <ReadBoxContainer to="/single-publication" className="p-3 mb-2 rounded">
            <Avatar avatar={showedAvatar(avatar)} />
            <ReadBoxContent className="px-2">
                <div className="mt-2 d-flex align-items-baseline ">
                    <Link
                        className="d-none d-md-block text-decoration-none"
                        style={{ color: 'var(--secondary)', fontWeight: 'bold', letterSpacing: '1.5px' }}
                        to={`/user/profile/${accountId._id}`}
                    >{name}</Link>

                    <Link
                        className="ml-1"
                        to={`/user/profile/${accountId._id}`}
                        style={{ color: 'var(--secondary)', fontSize: '1rem',textDecoration: 'none'}}
                    >@{username}</Link>
                    
                    <h4
                        className="d-inline-block ml-2 my-0 text-nowrap"
                        style={{
                            fontSize: '1rem !important',
                            color: 'var(--secondary'
                        }}
                    >{formatDistance(new Date(createdAt), new Date())} ago</h4>
                </div>
                <div className="publication-text text-break pt-1">
                    {content}
                </div>
                
                <div className="publication-icons d-flex justify-content-between align-items-center mt-2 mr-5">

                    {type === 'thought' ? (
                        <ReadBoxBtn
                            to={`/thoughts/${_id}`}
                            className="mr-3 publication-button d-flex align-items-center justify-content-center"
                        >
                            <span className="mx-2 ">{comments.length}</span>
                            <FAIcon icon={faComment} />
                        </ReadBoxBtn>
                    ) : null}

                    <ReadBoxBtn
                        to="#"
                        className={`d-flex align-items-center justify-content-center mr-3 publication-button`}
                        style={{ color: alreadyLiked() }}
                        onClick={() => onLikeHandler(data._id)}
                    >

                        <span className="mx-2 text-decoration-none">{likes}</span>
                        <FAIcon icon={faThumbsUp} />
                    </ReadBoxBtn>

                    <ReadBoxBtn to="/" className="d-flex align-items-center justify-content-center ml-2 mr-3 publication-button">
                        <FAIcon icon={faShareSquare} />
                    </ReadBoxBtn>

                    {authenticated ? (
                        viewerId === accountId._id ? (
                            <ReadBoxBtn to="#" className="d-flex align-items-center justify-content-center mr-3 publication-button">
                                <FAIcon
                                    icon={faTrash}
                                    onClick={() =>
                                        onDeleteHandler({ thoughtId: thoughtId || data._id, commentId: data._id })}
                                />
                            </ReadBoxBtn>
                        ) : (
                                <ReadBoxBtn
                                    to={`/user/profile/${accountId._id}`}
                                    className="d-flex align-items-center justify-content-center mr-3 publication-button" >
                                    <FAIcon icon={faEnvelope} />
                                </ReadBoxBtn>
                            )
                    ) : null}

                </div>
            </ReadBoxContent>
        </ReadBoxContainer >
    )
}
export default ReadBox;