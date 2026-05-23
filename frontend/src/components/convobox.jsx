import { useEffect, useState, useRef } from "react";
import socket from "../socket";

function ConversationBox({ setshowConvo }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch("http://fabioscake.onrender.com/get_me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentUserId(Number(data.id));
      });
  }, []);

  useEffect(() => {
    fetch("http://fabioss.onrender.com/get_users", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((users) => {
        const admin = users.find(
          (user) => user.roles && user.roles.toLowerCase().trim() === "admin",
        );

        if (admin) {
          setAdminId(Number(admin.id));
        }
      });
  }, []);

  useEffect(() => {
    if (!adminId) return;

    fetch(`http://fabioscake.onrender.com/get_messages/${adminId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
      });
  }, [adminId]);

  useEffect(() => {
    if (!currentUserId || !adminId) return;

    socket.emit("join");

    const handleMessage = (data) => {
      const isRelevant =
        (Number(data.sender_id) === Number(currentUserId) &&
          Number(data.receiver_id) === Number(adminId)) ||
        (Number(data.sender_id) === Number(adminId) &&
          Number(data.receiver_id) === Number(currentUserId));

      if (isRelevant) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [currentUserId, adminId]);

  const sendMessage = () => {
    if (!message.trim() || !adminId) return;

    socket.emit("send_message", {
      receiver_id: adminId,
      content: message,
      type: "text",
    });

    setMessage("");
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
  };

  const sendImage = async () => {
    if (!image || !adminId) return;

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("receiver_id", adminId);

      await fetch("http://fabioss.onrender.com/send_image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = () => {
    if (image) {
      sendImage();
    } else {
      sendMessage();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [messages]);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="convo-background">
      <div className="convo-container">
        <div className="components">
          {/* HEADER */}
          <div className="receiver">
            <h1 className="convo-title">Owner</h1>
            <button className="convo-close" onClick={() => setshowConvo(false)}>
              close
            </button>
          </div>

          <div className="convo-box">
            {messages.map((msg, index) => {
              const isMe = Number(msg.sender_id) === Number(currentUserId);

              return (
                <div
                  key={index}
                  className={`message-flex ${isMe ? "right" : "left"}`}
                >
                  <div className={isMe ? "user-message" : "admin-message"}>
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
                      msg.content
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={chatEndRef} />
          </div>

          {image && (
            <div className="image-preview-container">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{
                  width: "120px",
                  borderRadius: "10px",
                }}
              />

              <button
                className="remove-image-btn"
                onClick={() => {
                  setImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* INPUTS */}
          <div className="convo-inputs">
            <div className="input-wrapper">
              {/* FILE INPUT */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageSelect}
              />

              {/* IMAGE BUTTON */}
              <button
                className="convo-tools tool-left"
                onClick={() => fileInputRef.current.click()}
              >
                📷
              </button>

              {/* TEXT INPUT */}
              <input
                type="text"
                className="convo-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
              />

              {/* SEND BUTTON */}
              <button className="convo-tools tool-right" onClick={handleSend}>
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* LIGHTBOX (BIG IMAGE VIEW) */}
      {/* ========================= */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              fontSize: "28px",
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          {/* IMAGE */}
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

export default ConversationBox;
