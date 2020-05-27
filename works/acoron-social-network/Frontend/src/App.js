import React, { useEffect } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import CreateAccount from './components/Authentication/CreateAccount';
import Main from './components/Main';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import SinglePublication from './components/Feed/SinglePublication';
import Feed from './components/Feed/Feed';
import Settings from './components/User/Settings';
import Login from './components/Authentication/Login';
import UserContext from './context/user/userContext';
import { updateGeneralStyle} from './components/helpers';
import NotFoundPage from './components/NotFoundPage';
import Profile from './components/User/Profile';
import Messages from './components/User/Messages';
import TopBar from './TopBar';
import Footer from './Footer';

function App() {

  const userContext = React.useContext(UserContext);
  const { user: { settings: { theme } } } = userContext;

  useEffect(() => {
    updateGeneralStyle(theme);
  }, [theme])

  return (
    <Router>
      <div
        className='container'
        style={{ paddingBottom: '7rem' }}
      >
        <TopBar />
        <div className="row justify-content-center">
          <LeftPanel
            boostrapStyles={'col-lg-2 left-panel rounded'}
          />


          <Main
            boostrapStyles={'mt-3 mt-lg-0 col-lg-7 main-panel rounded'}
          >
            <Switch>


              <Route exact path='/' component={Feed} />

              <Route path='/thoughts/:slug' component={SinglePublication} />

              <Route path='/user/settings' component={Settings} />

              <Route path='/user/create-account' component={CreateAccount} />

              <Route path='/user/login'>
                  <Login />
              </Route>

              <Route path='/user/profile/:accountId' component={Profile} />

              <Route path='/user/messages' component={Messages} />

              <Route path="*">
                <NotFoundPage />
              </Route>


            </Switch>
          </Main>


          <RightPanel
            boostrapStyles={'d-none d-lg-block mt-4 mt-lg-0 col-lg-3 right-panel rounded'}
          />

        </div>

      </div>
      <Footer />

    </Router>

  );
}

export default App;
