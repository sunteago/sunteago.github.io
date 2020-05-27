import React from 'react';

const Button = ({ counter, setCounter, clickMe }) => {
    const onclickButtonHandler = e => {
        e.preventDefault();
        setCounter(counter + 1);
    };
    return (
            <button
                className="btn btn-primary py-2 px-3 mb-4"
                type="button"
                name="button"
                onClick={onclickButtonHandler}
            >{clickMe}
             <h1 className="badge badge-dark m-1">{counter}</h1>
            </button>
    );
}

export default Button;