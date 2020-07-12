import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Avatar } from '../elements';
import { showedAvatar, validateInput, calculateCharsLeft } from '../helpers';

const WritingContainer = styled.div`
    box-shadow: 2px 2px 2px 2px var(--secondary-muted);
    background: var(--terciary);
    width: 100%;
    padding: .3rem .6rem;
    resize: none;
    border: none;
    color: var(--secondary);
    font-size: 1.25rem;
    letter-spacing: 1px;
    display: flex;
    h3 {
        font-weight: bolder;
        font-size: 1.125rem;
    }
    h4 {font-size: 1.125rem}
    .owner-writing-box {
        border-radius: 10px;
        background: var(--terciary);
        width: 100%;
        padding: .3rem .6rem;
        resize: none;
        border: none;
        color: var(--secondary);
        font-size: 1.25rem;
        letter-spacing: 1px;
    }
    .owner-writing-box::placeholder {
        color: var(--secondary);
        font-size: 1.25rem;
        letter-spacing: 1px;
    }   
    .publication.owner {width: 100%}
    .owner-writing-box__button {
        background: var(--secondary);
        color: var(--primary);
        font-weight: 700;
        margin-left: auto;
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

const ShareThoughtBtn = styled.input`
    @media (max-width: 768px) {
        display: block;
        width: 100%;
    }
`;


const WritingBox = ({ avatar, name, username, mode, thoughtId, onCreateHandler }) => {
    const [textContainer, setTextContainer] = useState('');
    const [disabled, setDisabled] = useState(true);

    const onSubmitHandler = async e => {
        e.preventDefault();
        setDisabled(true);
        const failed = await onCreateHandler(textContainer, thoughtId);
        if (!failed) setTextContainer('');
        setDisabled(false);
    }

    const onChangeHandler = e => {
        setTextContainer(e.target.value);
        const isInvalid = validateInput(mode, e.target.value);
        if (isInvalid) setDisabled(isInvalid);
        else setDisabled(false);
    }

    return (
        <WritingContainer className="p-3 mb-3 rounded container ">
            <Avatar avatar={showedAvatar(avatar)} size='4rem' />
            <div className="publication col-10 owner px-2 mt-1 mt-lg-2">
                <div className="publication-author d-flex align-items-center w-100">
                    <h3 className="publication-author__name d-inline-block">{name}</h3>
                    <h4 className="publication-author__account d-inline-block ml-2">@{username}</h4>
                    <h4
                        type="text"
                        disabled
                        className=" rounded d-inline p-2 ml-auto"
                    >{calculateCharsLeft(textContainer, 280)}</h4>
                </div>
                <form
                    className="d-flex flex-wrap"
                    onSubmit={onSubmitHandler}
                >
                    <textarea
                        className='owner-writing-box rounded'
                        placeholder={mode === 'comment' ? 'Write your comment!' : 'Share your thoughts!'}
                        onChange={onChangeHandler}
                        value={textContainer}
                    />
                    <div className="d-flex w-100">

                        <ShareThoughtBtn
                            type="submit"
                            className="owner-writing-box__button rounded btn mt-2 ml-lg-auto"
                            value={mode === 'comment' ? 'Comment' : 'Share Thought'}
                            disabled={disabled ? true : false}

                        />
                    </div>
                </form>
            </div>
        </WritingContainer>
    );
}

export default WritingBox;