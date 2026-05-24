import { useState } from "react";
import ModalLogin from "./login";
import socket from "../socket";
import ConversationBox from "./convobox";

function Navigation({ isLoggedin, setisLoggedin }) {
  const [modalType, setModalType] = useState(null);
  const closeModal = () => setModalType(null);
  const [Message, setMessage] = useState("");
  const [showConvo, setshowConvo] = useState(false);

  async function handleLogout(e) {
    e.preventDefault();

    const response = await fetch("${import.meta.env.API_URL}/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();
    socket.disconnect();
    setisLoggedin(false);
    setMessage(data.message);
    alert(data.message);
  }

  return (
    <nav id="home">
      <div>
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#products">Products</a>
        </li>
        <li>
          <a href="#contact-us">Contact us</a>
        </li>
      </div>

      <div>
        <img src="/Images/logo.png" alt="logo" className="logo" />
      </div>

      <div>
        <li>
          <button
            className="button order-button"
            onClick={() => {
              isLoggedin ? setshowConvo(true) : setModalType("login");
            }}
          >
            Order Now
          </button>
        </li>

        <li>
          {isLoggedin ? (
            <button className="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button onClick={() => setModalType("login")} className="button">
              Login
            </button>
          )}
        </li>
      </div>

      {modalType && (
        <ModalLogin
          modalType={modalType}
          setModalType={setModalType}
          closeModal={closeModal}
          isLoggedin={isLoggedin}
          setisLoggedin={setisLoggedin}
        />
      )}

      {showConvo && <ConversationBox setshowConvo={setshowConvo} />}
    </nav>
  );
}

export default Navigation;
