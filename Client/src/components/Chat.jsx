import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./chat.css";
function Chat({ socket, username, room }) {
  const [messageList, setMessageList] = useState([]);
  const [currentMessage, setcurrentMessage] = useState("");

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
    } else {
      alert("Please type a message");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
        {messageList.map((messageContent, key) => {
  const isYou = messageContent.author === username;

  return (
    <div
      key={key}
      className="message"
      id={isYou ? "you" : "other"}
    >
      <div>
        <div className="message-content">
          <p>{messageContent.message}</p>
        </div>
        <div className="message-meta">
          <p id="time">{messageContent.time}</p>
          <p id="author">{messageContent.author}</p>
        </div>
      </div>
    </div>
  );
})}

        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="type message here"
          onChange={(event) => {
            setcurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
