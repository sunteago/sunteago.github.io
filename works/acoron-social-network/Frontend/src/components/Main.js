import React, { useContext, useEffect } from 'react';
import UserContext from '../context/user/userContext';


const Main = ({ boostrapStyles, children }) => {
    const userContext = useContext(UserContext);
    const { authenticatedUser, authenticated, user, getSettings } = userContext;

    useEffect(() => {
        authenticatedUser();
        //eslint-disable-next-line
    }, [])
    useEffect(() => {
        if (authenticated) {
            getSettings(user);
        }
        //eslint-disable-next-line
    }, [authenticated])
    return (
        <>
            <div className={boostrapStyles}>
                {children}
            </div>
        </>
    )
}

export default Main;