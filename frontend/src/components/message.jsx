import { useState } from "react";
import ModalLogin from "./login";
import ConversationBox from "./convobox";
import CAModalLogin from "./createaccount";

function Message({ isLoggedin, setisLoggedin }) {
  const [modalType, setModalType] = useState(null);
  const [showConvo, setShowConvo] = useState(false);

  const closeModal = () => setModalType(null);

  const handleClick = () => {
    if (isLoggedin) {
      setShowConvo(true);
    } else {
      setModalType("login");
    }
  };

  return (
    <>
      <div className="tool-buttons">
        <div>
          <button className="message-button" onClick={handleClick}>
            <img src="/Images/envelope.png" alt="" className="tool-icons" />
          </button>
        </div>

        <div>
          <a href="#home">
            <img src="/Images/up-chevron.png" alt="" className="tool-icons" />
          </a>
        </div>
      </div>

      {modalType === "login" && (
        <ModalLogin
          setModalType={setModalType}
          closeModal={closeModal}
          isLoggedin={isLoggedin}
          setisLoggedin={setisLoggedin}
        />
      )}

      {modalType === "signup" && (
        <CAModalLogin setModalType={setModalType} closeModal={closeModal} />
      )}

      {/* CHAT BOX */}
      {showConvo && <ConversationBox setshowConvo={setShowConvo} />}
    </>
  );
}

export default Message;
