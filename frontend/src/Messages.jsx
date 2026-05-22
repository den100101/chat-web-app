import { useEffect, useState, useRef } from "react";
import socket from "./socket";

function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const [unreadCounts, setUnreadCounts] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const now = new Date();

  useEffect(() => {
    async function getSession() {
      const res = await fetch("http://localhost:5000/check_session", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.loggedIn) {
        setCurrentUserId(data.user_id);
      }
    }

    getSession();
  }, []);

  async function fetchUsers() {
    const res = await fetch("http://localhost:5000/get_users", {
      credentials: "include",
    });

    const data = await res.json();
    setUsers(data);
  }

  async function fetchMessages(userId) {
    const res = await fetch(`http://localhost:5000/get_messages/${userId}`, {
      credentials: "include",
    });

    const data = await res.json();
    setMessages(data);
  }

  async function fetchUnreadCounts() {
    const res = await fetch("http://localhost:5000/unread_counts", {
      credentials: "include",
    });

    const data = await res.json();

    const mapped = {};
    data.forEach((item) => {
      mapped[item.sender_id] = item.unread;
    });

    setUnreadCounts(mapped);
  }

  useEffect(() => {
    fetchUsers();
    fetchUnreadCounts();
    socket.emit("join");
  }, []);

  async function handleSelectUser(user) {
    setSelectedUser(user);

    setUnreadCounts((prev) => ({
      ...prev,
      [user.id]: 0,
    }));

    await fetch(`http://localhost:5000/mark_read/${user.id}`, {
      method: "POST",
      credentials: "include",
    });

    fetchMessages(user.id);
  }

  useEffect(() => {
    const handleMessage = (msg) => {
      if (
        selectedUser &&
        (msg.sender_id === selectedUser.id ||
          msg.receiver_id === selectedUser.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }

      if (msg.sender_id !== selectedUser?.id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.sender_id]: (prev[msg.sender_id] || 0) + 1,
        }));
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [selectedUser]);

  function sendText() {
    if (!content.trim() || !selectedUser) return;

    socket.emit("send_message", {
      receiver_id: selectedUser.id,
      content,
      type: "text",
    });

    setContent("");
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
  };

  const sendImage = async () => {
    if (!image || !selectedUser) return;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("receiver_id", selectedUser.id);

    await fetch("http://localhost:5000/send_image", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    setImage(null);
    fileInputRef.current.value = "";
  };

  function handleSend() {
    if (image) {
      sendImage();
    } else {
      sendText();
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="message-header">
        <h1>Messages</h1>
        <h1>{now.toDateString()}</h1>
      </div>

      <div className="chat-layout">
        <div className="users-panel">
          <h3>Users</h3>

          {users
            .filter((u) => u.roles && u.roles.toLowerCase().trim() !== "admin")
            .map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={
                  selectedUser?.id === user.id ? "user active" : "user"
                }
              >
                {user.username}

                {unreadCounts[user.id] > 0 && (
                  <span className="unread-badge">{unreadCounts[user.id]}</span>
                )}
              </div>
            ))}
        </div>

        {/* CHAT */}
        <div className="chat-panel">
          {selectedUser ? (
            <>
              <div className="chat-header">
                Chat with {selectedUser.username}
              </div>

              <div className="chat-box">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.sender_id === currentUserId ? "msg right" : "msg left"
                    }
                  >
                    {msg.type === "image" ? (
                      <img
                        src={`http://localhost:5000/uploads/${msg.content}`}
                        alt="chat"
                        style={{
                          maxWidth: "200px",
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setSelectedImage(
                            `http://localhost:5000/uploads/${msg.content}`,
                          )
                        }
                      />
                    ) : (
                      <div>{msg.content}</div>
                    )}

                    {msg.sender_id === currentUserId && (
                      <small className="seen-text">
                        {msg.is_read === 1 ? "Seen ✔✔" : "Sent ✔"}
                      </small>
                    )}
                  </div>
                ))}

                <div ref={chatEndRef} />
              </div>

              {image && (
                <div>
                  <img
                    src={URL.createObjectURL(image)}
                    style={{
                      width: "100px",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="close-image"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="chat-input">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                />

                <button
                  onClick={() => fileInputRef.current.click()}
                  className="camera"
                >
                  📷
                </button>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />

                <button onClick={handleSend} className="message-send-button">
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat">Select a user to start chatting</div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              fontSize: "28px",
              color: "white",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          <img
            src={selectedImage}
            alt="full"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Messages;
