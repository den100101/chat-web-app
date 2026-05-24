import { useState } from "react";

function CAModalLogin({ setModalType, closeModal }) {
  const [Email, setEmail] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [MessageRes, setMessageRes] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = { Email, Username, Password };

    const response = await fetch("${import.meta.env.VITE_API_URL}/add_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      setMessageRes("Account Created");
      setEmail("");
      setUsername("");
      setPassword("");
    } else {
      setMessageRes(result.error || "Something went wrong");
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-container modal-login-container">
        <button onClick={closeModal} className="close-login-button">
          close
        </button>

        <div className="forms">
          <div className="header-login">
            <p>Create Account</p>
            <p className="success">{MessageRes}</p>
          </div>

          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Username"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="login-buttons">
              <button type="submit" className="button1">
                Create Account
              </button>

              <button
                type="button"
                className="button2"
                onClick={() => setModalType("login")}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CAModalLogin;
