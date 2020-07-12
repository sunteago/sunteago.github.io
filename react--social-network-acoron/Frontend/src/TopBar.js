import React from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import {Link, useHistory, withRouter} from 'react-router-dom';

const TopBar = () => {
    const history = useHistory();

    return ( 
        <div className="row">

          <div
            className="d-flex col-3 col-lg-2 justify-content-center align-items-center"
            style={{cursor: 'pointer'}}
            onClick={() => history.goBack()}
          >
            <FAIcon
              icon={faChevronLeft}
              size="2x"
              style={{ color: 'var(--secondary)' }}
            />
          </div>


          <Link to='/'
            className="brand d-flex col-6 col-lg-7 align-items-center my-2 justify-content-center">
            <div className="brand-logo mr-1">
              <img 
                src={`/logo.png`} 
                alt="Logo"
                style={{width: '2.4rem'}}
              />
            </div>
            <h1 className='brand-name my-1'>Acoron</h1>
          </Link>


          <div
            className="d-flex col-3 col-lg-3 justify-content-center align-items-center"
            onClick={() => history.goForward()}
            style={{cursor: 'pointer'}}
          >
            <FAIcon
              icon={faChevronRight}
              size="2x"

              style={{ color: 'var(--secondary)' }}
            />
          </div>

        </div>
     );
}
 
export default withRouter(TopBar);