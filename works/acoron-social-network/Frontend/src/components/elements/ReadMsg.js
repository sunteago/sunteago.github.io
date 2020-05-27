import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Avatar } from '.'
import { formatDistance } from 'date-fns';
import { showedAvatar } from '../helpers';
import MessageBox from '../elements/MessageBox'

const ReadBoxContainer = styled.div`
    box-shadow: 2px 2px 2px 2px var(--secondary-muted);
    background: var(--terciary);
    display: flex;
    text-decoration: none;
    color: var(--secondary);
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
`;


const ReadMsg = ({ msg, onSendMessageHandler, onDeleteHandler}) => {

    const {from, content, title,sentAt, _id} = msg;


    const getSentAt = (sentAt) => {
        return formatDistance(new Date(sentAt), new Date()) + ' ago';
    }

    return (
        <ReadBoxContainer to="/single-publication" className="p-3 mb-2 rounded">
            <Avatar avatar={showedAvatar(from.avatar)} />
            <ReadBoxContent>
                <h2>{title}</h2>
                <Link
                    style={{ textDecoration: 'none', color: 'var(--secondary)' }}
                    to={`/user/profile/${from._id}`}
                >Sent by <strong>{from.name} - @{from.username} {getSentAt(sentAt)}</strong>
                </Link>
                <hr />
                <p>{content}</p>
                <hr />
                <MessageBox 
                    className
                    sendTo={from.name}
                    sendToId={from._id}
                    onSendMessageHandler={onSendMessageHandler}
                    buttonText="Send Response"
                    isOnMessages={true}
                    isResponding={true}
                    title={title}
                    messageId={_id}
                    onDeleteHandler={(id) => onDeleteHandler(id)}
                />
            </ReadBoxContent>
        </ReadBoxContainer >
    )
}
export default ReadMsg;