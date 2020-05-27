import { useState, useContext } from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Input from '../elements/Input';
import UserContext from '../../context/user/userContext';
import { validateInput } from '../helpers';

const CreateAccount = (props) => {
    const userContext = useContext(UserContext);
    const { createAccount } = userContext;

    const [signupData, setSignupData] = useState({
        username: '',
        password: '',
        cpassword: '',
        email: '',
        name: ''
    });
    const [invalid, setInvalid] = useState({});
    const { username, password, cpassword, email, name } = signupData;
    const [clientError, setClientError] = useState(false);
    const [serverErrors, setServerErrors] = useState([]);


    const validInputs = () => {
        if ((username.trim() === '' || password.trim() === '' ||
            cpassword.trim() === '' || name.trim() === '' ||
            email.trim() === '') ||
            (invalid.name || invalid.username || invalid.email ||
                invalid.password || invalid.cpassword)) {
            setClientError(true);
            return false;
        }
        return true;
    }

    const onSubmitHandler = async e => {
        e.preventDefault();
        if (validInputs()) {
            setClientError(false);
            const err = await createAccount(signupData, props.history);
            if (err) setServerErrors(err);
        }
    }

    const onChangeHandler = e => {
        if (clientError) setClientError(false);
        let name = e.target.name;
        let value = e.target.value;
        if (name === 'username' || name === 'email') value = value.toLowerCase();
        setSignupData({ ...signupData, [name]: value });
    }

    const onBlurHandler = e => {
        const isInvalid = validateInput(e.target.name, e.target.value, signupData);
        setInvalid({ ...invalid, [e.target.name]: isInvalid });
    };


    return (

        <div className="d-flex flex-column align-items-center mt-4">
            <form
                className="d-flex flex-column align-items-center w-100 w-md-75 text-center rounded p-3"
                css={css`
                background: var(--terciary);
            `}
                onSubmit={onSubmitHandler}
            >


                <h2>Sign up Now!</h2>
                {serverErrors.length
                    ? serverErrors.map(err => (
                        <p
                            className="alert alert-danger mt-4 mb-0 w-100"
                            key={err.value}
                        >{err.msg}</p>
                    ))
                    : null}
                {clientError ? (
                    <div className="alert alert-warning mt-3 mb-0 w-100">You have to complete all fields correctly</div>
                ) : null}
                <Input
                    title="Name"
                    placeholder="e.g : Mike"
                    type="text"
                    value={name}
                    inputName="name"
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    isInvalid={invalid.name}
                />
                <Input
                    title='@username'
                    placeholder="e.g : user.name.19"
                    type="text"
                    value={username}
                    inputName="username"
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    isInvalid={invalid.username}
                />
                <Input
                    title="Email"
                    placeholder="e.g : email@email.com"
                    type="email"
                    value={email}
                    inputName="email"
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    isInvalid={invalid.email}
                />
                <Input
                    title="Password"
                    placeholder="At least 8 characters length"
                    type="password"
                    value={password}
                    inputName="password"
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    isInvalid={invalid.password}
                />
                <Input
                    title="Confirm password"
                    placeholder="Confirm your password"
                    type="password"
                    value={cpassword}
                    inputName="cpassword"
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    isInvalid={invalid.cpassword}
                />

                <Input
                    title="Sign up"
                    type="submit"
                />

            </form>
        </div>
    );
}

export default CreateAccount;