import React, { useContext, } from 'react';
import { Link, useHistory, withRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import UserContext from '../context/user/userContext';

const MenuOption = styled(Link)`
    text-decoration: none;
    color: var(--primary);
    &:hover,
    &:focus {
        text-decoration: none;
        color: var(--secondary-muted);
    }
`;

const Button = styled.input`
    color: var(--secondary);
    background: var(--primary);
    font-weight: bold;
    letter-spacing: 1.25px;
`;


const LeftPanel = () => {
    const userContext = useContext(UserContext);
    const { authenticated, user: { name, _id, }, logOut } = userContext;
    const history = useHistory();


    const onLogoutHandler = e => {
        e.preventDefault();
        logOut(history);
    }

    return (
        <div className='d-lg-block col-lg-2 left-panel rounded pb-lg-4  d-flex align-items-center justify-content-center'>
            <ul className="flex-row flex-lg-column flex-wrap left-panel__menu mt-3 p-0">
                <li className="mx-3  mx-lg-0 my-lg-2">
                    <MenuOption to="/">Home</MenuOption>
                </li>
                {authenticated ? (
                    <>
                        <li className="mx-3  mx-lg-0 my-lg-2">
                            <MenuOption to="/user/settings">Settings</MenuOption>
                        </li>
                        <li className="mx-3  mx-lg-0 my-lg-2">
                            <MenuOption to={`/user/profile/${_id}`}>Profile</MenuOption>
                        </li>
                        <li className="mx-3  mx-lg-0 my-lg-2">
                            <MenuOption to="/user/messages">Messages</MenuOption>
                        </li>
                    </>
                ) : null}

                <li className="mx-3  mx-lg-0 my-lg-2">
                    <MenuOption to="/contact">Contact</MenuOption>
                </li>
          
            <div className="d-flex align-items-center justify-content-center flex-lg-column left-panel__login p-0  p-lg-0 mb-0 mb-lg-0">

                {!authenticated ? (
                    <>

                        <p className="d-none d-lg-block mt-4 mb-1">You are currently not logged in</p>
                        <Link
                            className='btn order-1 left-panel__login-button'
                            to='/user/login'
                        ><Button
                            type='button'
                            className="btn order-1"
                            value="Log in"
                        >
                            </Button>
                        </Link>
                        
                        <Link
                            className='btn order-1 left-panel__login-button'
                            to='/user/create-account'
                        ><Button
                            type='button'
                            className="mt-md-2 btn order-1"
                            value="Sign up!"
                        >
                            </Button>
                        </Link>

                        
                    </>
                ) : (
                        <>
                            <h4 className="mt-3">Welcome back, {name}!</h4>
                            <Button
                                type='button'
                                className="btn"
                                onClick={onLogoutHandler}
                                value="Log out"
                            >
                            </Button>
                        </>
                    )}


            </div>
            </ul>
        </div>

    )
}

export default withRouter(LeftPanel);