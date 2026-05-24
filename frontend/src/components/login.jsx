import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CAModalLogin from "./createaccount";
import socket from "../socket";

function ModalLogin({
  modalType,
  setModalType,
  closeModal,
  // eslint-disable-next-line no-unused-vars
  isLoggedin,
  setisLoggedin,
}) {
  const navigate = useNavigate();

  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Message, setMessage] = useState("");

  const Submit = async (e) => {
    e.preventDefault();

    if (!Username || !Password) {
      setMessage("Please fill all fields");
      return;
    }

    const data = { Username, Password };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        const userRole = result.role;

        setMessage(result.message);
        setisLoggedin(true);

        socket.disconnect();
        socket.connect();
        // redirect based on role
        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        closeModal();
        setUsername("");
        setPassword("");

        setTimeout(() => setMessage(""), 3000);
      } else {
        setisLoggedin(false);
        setMessage(result.message);
      }
    } catch (error) {
      console.log("Server error", error);
      setMessage("Server error");
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-container modal-login-container">
        <button className="close-login-button" onClick={closeModal}>
          close
        </button>

        <div className="forms">
          <div className="header-login">
            <p>Login</p>
          </div>

          <form onSubmit={Submit}>
            <div>
              <input
                type="text"
                placeholder="Username"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-buttons">
              <button type="submit" className="button1">
                Login
              </button>

              <button
                type="button"
                className="button2"
                onClick={() => setModalType("signup")}
              >
                Sign up
              </button>
            </div>

            <p className="Message">{Message}</p>
          </form>
        </div>

        {modalType === "signup" && (
          <CAModalLogin setModalType={setModalType} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
}

export default ModalLogin;
