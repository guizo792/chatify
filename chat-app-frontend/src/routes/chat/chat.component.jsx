import CopyrightSection from 'src/components/copyrights-section/copyrights-section.component';
import './chat.styles.css';

const Chat = () => {
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
        <div className="chat-form-container">
          <form id="chat-form">
            <input
              id="msg"
              type="text"
              placeholder="Enter Message"
              required
              autoComplete="off"
            />
            <button
              className="btn send-btn"
              onClick={(e) => {
                e.preventDefault();
                console.log(e.target.parentElement);
              }}
            >
              <i className="fas fa-paper-plane"></i> Send
            </button>
          </form>
        </div>
      </div>
      <CopyrightSection />
    </>
  );
};

export default Chat;
