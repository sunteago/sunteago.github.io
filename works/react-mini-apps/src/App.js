import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import LangContext from './context/langContext';

import Navbar from './components/Navbar';
import WelcomeScreen from './components/WelcomeScreen';
import ToolsContainer from './components/ToolsContainer';
import Pag1 from './components/pages/Pag1';
import Pag2 from './components/pages/Pag2';
import Pag3 from './components/pages/Pag3';
import Pag4 from './components/pages/Pag4';

const boxQuality = `bg-light col-10 col-md-5 d-flex flex-column align-items-center border  rounded m-2 mt-4 p-3`;
const makeTitle = msg => <h2 className="my-3 text-center">{msg}</h2>;

function App() {
  const [name, setName] = useState('');
  const [lang, setLang] = useState('es');
  const [isNameSetted, setIsNameSetted] = useState(false);

  useEffect(() => {
      const savedName = localStorage.getItem('name');
      if (savedName) {
          setName(savedName);
          setIsNameSetted(true);
      }
      const savedLang = localStorage.getItem('lang');
      if (savedLang) setLang(savedLang);
      // eslint-disable-next-line
  }, []);

  return (
    <LangContext.Provider value={lang}>
      <Router>
        <div className="container">
          <Navbar
            name={name}
            setLang={setLang}
            lang={lang}
          />

          <Switch>
            <Route exact path="/" >
              <WelcomeScreen
                firstPage="/pag1"
                name={name}
                setName={setName}
                isNameSetted={isNameSetted}
                setIsNameSetted={setIsNameSetted}
              />
            </Route>

            <Route path="/pag1">
              <ToolsContainer>
                <Pag1
                  boxQuality={boxQuality}
                  makeTitle={makeTitle}
                />
              </ToolsContainer>
            </Route>

            <Route path="/pag2">
              <ToolsContainer>
                <Pag2
                  boxQuality={boxQuality}
                  makeTitle={makeTitle}
                />
              </ToolsContainer>
            </Route>

            <Route path="/pag3">
              <ToolsContainer>
                <Pag3
                  boxQuality={boxQuality}
                  makeTitle={makeTitle}
                />
              </ToolsContainer>
            </Route>

            <Route path="/pag4">
              <ToolsContainer>
                <Pag4
                  boxQuality={boxQuality}
                  makeTitle={makeTitle}
                />
              </ToolsContainer>
            </Route>
          </Switch>
        </div>
      </Router>
    </LangContext.Provider>
  );
}

export default App;
