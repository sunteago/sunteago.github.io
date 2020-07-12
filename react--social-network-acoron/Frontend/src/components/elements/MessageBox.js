import React, { useState } from 'react';
import { validateInput, calculateCharsLeft} from '../helpers';
import styled from '@emotion/styled';


const Message = styled.textarea`
    width: 100%;
    resize: none;
`;


const MessageBox = ({ sendToId, sendTo, onSendMessageHandler, buttonText = "Send Private Msg", width, isResponding, title, isOnMessages, onDeleteHandler, messageId }) => {
    const currentTitle = isResponding ? `Re: ${title}` : '';
    const [message, setMessage] = useState({
        title: currentTitle,
        content: '',
        destId: sendToId
    });
    const [disabled, setDisabled] = useState(true);

    const onChangeHandler = (e) => {
        const msg = { ...message, [e.target.name]: e.target.value };
        setMessage(msg);
        const isInvalid = validateInput('message', msg);
        console.log(isInvalid);
        if (isInvalid) setDisabled(true);
        else setDisabled(false);
    }
    return (
        <form
            onSubmit={(e) => onSendMessageHandler(e, message)}
            className={`d-flex flex-column align-items-center w-${width} text-center rounded `}
        >

            <input
                type="text"
                placeholder={`Title`}
                className="form-control p-2 m-2"
                name="title"
                onChange={onChangeHandler}
                value={message.title}
            />
            <Message
                className="form-control p-2"
                placeholder={`Write the message you want to send to ${sendTo}`}
                name="content"
                onChange={onChangeHandler}
                value={message.content}
            />

            <div className="d-flex mt-4 justify-content-end w-100">
            <h4
                className="mr-auto"
            >{calculateCharsLeft(message.content, 560)}</h4>

                {isOnMessages ? (
                    <input
                        className="btn mr-3 btn-danger"
                        type="button"
                        value="Delete message"
                        onClick={() => onDeleteHandler(messageId)}
                    />
                ) : null}
                <input
                    className="btn mr-3  btn-dark"
                    type="submit"
                    value={buttonText}
                    disabled={disabled ? true : false}
                />

            </div>
        </form>
    )
}

export default MessageBox;