import React from 'react'
import styled from '@emotion/styled';

const TextLabel = styled.label`
    color: var(--secondary);
`;

const Button = styled.input`
    color: var(--secondary);
    background: var(--primary);
    font-weight: bold;
    letter-spacing: 1.25px;
`
const Input = ({ placeholder, type, inputName, onChange, title, value, onBlur, isInvalid }) => {
    const isButton = () => {
        return type !== 'submit' ? false : true;
    }

    return (
        isButton() ? (
            <Button
                value={title}
                type={type}
                className="btn mt-3"
            />
        ) : (
                <>

                    <TextLabel className="h5 mt-3 bold" htmlFor={inputName}>{title}</TextLabel>
                    {isInvalid 
                        ? (
                            <p
                                role="alert" 
                                className="alert alert-danger d-block mt-1 w-100"
                            >{isInvalid}</p>) 
                        : null}

                    <input
                        placeholder={placeholder}
                        className={`form-control w-75 ${isInvalid ? 'border border-danger' : null }`}
                        type={type}
                        name={inputName}
                        value={value}
                        onChange={onChange}
                        id={inputName}
                        onBlur={onBlur}
                    />

                </>
            )

    )
}

export default Input;