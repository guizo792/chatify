import { useContext } from 'react';
import ChatInput from 'src/components/chat-input/chat-input.component';
import CopyrightSection from 'src/components/copyrights-section/copyrights-section.component';
import AuthContext from 'src/context/authContext';
import './chat.styles.css';

const Chat = () => {
  const { user } = useContext(AuthContext);

  let messages = [
    { time: '2:09pm', username: 'Kishan', text: 'Hi' },
    { time: '2:12pm', username: 'Karash', text: 'Welcome' },
  ];

  return (
    <>
      <div className="chat-container">
        <header className="chat-header">
          <h1>
            <i className="fas fa-comment"></i> Chatify
          </h1>
          <a href="/" className="btn">
            Leave Room
          </a>
        </header>
        {user && (
          <>
            <main className="chat-main">
              <div className="chat-sidebar">
                <h3>
                  <i className="fas fa-comments"></i> Room Name:
                </h3>
                <h2 id="room-name"></h2>
                <h3>
                  <i className="fas fa-users"></i> Users
                </h3>
                <ul id="users"></ul>
              </div>

              <div className="chat-messages">
                {messages.map((message, i) => {
                  return (
                    <div className="message" key={i}>
                      <p className="meta">
                        {message.username} <span>{message.time}</span>
                      </p>
                      <p className="text">{message.text}</p>
                    </div>
                  );
                })}
              </div>
            </main>
            <ChatInput />
          </>
        )}
      </div>
      <CopyrightSection />
    </>
  );
};

export default Chat;
