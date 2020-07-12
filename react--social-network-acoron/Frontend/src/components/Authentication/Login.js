import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../elements/Input';
import UserContext from '../../context/user/userContext';
import { GeneralPanelBox } from '../elements';

const Login = () => {
    const userContext = useContext(UserContext);
    const { authenticated, logIn, user, getSettings, loginError } = userContext;

    const [loginData, setLoginData] = useState({
        password: '',
        email: ''
    });
    const { password, email } = loginData;

    const history = useHistory();
    useEffect(() => {
        if (authenticated) {
            history.push('/');
            getSettings(user);
        }
        //eslint-disable-next-line
    }, [authenticated, history])


    const onSubmitHandler = e => {
        e.preventDefault();
        logIn({ email, password });
    }

    const onChangeHandler = e => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    return !authenticated ? (

        <GeneralPanelBox>
            <form
                className="d-flex flex-column align-items-center w-75 text-center rounded p-3"
                onSubmit={onSubmitHandler}
            >
                <h2>Log in</h2>
                {loginError
                    ? <p className="alert alert-danger mt-4 w-100">{loginError}</p>
                    : null}
                <Input
                    title="Email"
                    placeholder="email"
                    type="email"
                    value={email}
                    inputName="email"
                    onChange={onChangeHandler}
                />
                <Input
                    title="Password"
                    placeholder="password"
                    type="password"
                    value={password}
                    inputName="password"
                    onChange={onChangeHandler}
                />

                <Input
                    title="Log in"
                    type="submit"
                />

            </form>
        </GeneralPanelBox>
    ) : null
}

export default Login;