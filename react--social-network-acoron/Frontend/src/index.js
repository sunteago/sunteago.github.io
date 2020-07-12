import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserState from './context/user/userState';
import MessagesState from './context/messages/messagesState';
import ThoughtsState from './context/thoughts/thoughtsState';

ReactDOM.render(
  <React.StrictMode>
      <UserState>
        <ThoughtsState>
          <MessagesState>
            <App />
          </MessagesState>
        </ThoughtsState>
      </UserState>
  </React.StrictMode>,

  document.getElementById('root')
);

