import React from 'react';
import {useHistory, Link} from 'react-router-dom';
import { driveHome} from './helpers';
import { NotFoundBox } from './elements';


const NotFoundPage = () => {
    const history = useHistory();

    return ( 
        <NotFoundBox>
            <h2>The Page could not be found</h2>
            <p>You will be redirected to Home, If you are not redirected click <Link to='/' style={{textDecoration: 'none', color: 'var(--secondary'}}>here</Link></p>
            {driveHome(history)}
        </NotFoundBox>
     );
}
 
export default NotFoundPage;