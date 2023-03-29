import './chat-input.styles.scss';

const ChatInput = () => {
  return (
    <div className="chat-form-container">
      <form id="chat-form">
        <input
          id="msg"
          type="text"
          placeholder="Type message ..."
          required
          autoComplete="off"
        />
        <button
          className="btn send-btn"
          onClick={(e) => {
            e.preventDefault();
            console.log(
              (e.target as unknown as { parentElement: HTMLElement })
                .parentElement
            );
          }}
        >
          <i className="fas fa-paper-plane"></i> Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
