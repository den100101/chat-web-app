import { useState } from "react";
import ModalLogin from "./login";
import CAModalLogin from "./createaccount";
import ConversationBox from "./convobox";

function CTA({ isLoggedin, setisLoggedin }) {
  const [modalType, setModalType] = useState("");
  const closeModal = () => setModalType(null);
  const [showConvo, setshowConvo] = useState(false);

  return (
    <>
      <div className="CTA-container">
        <div className="CTA-components">
          <div className="CTA-title">
            <h1>Ready to order your cake or cupcake</h1>
          </div>
          <div className="CTA-p">
            <p>
              Start with a conversation. Tell us your vision and we'll bring it
              to life
            </p>
          </div>
          <div className="cta-buttons">
            <div>
              <button
                className="button cta-b1"
                onClick={() => {
                  isLoggedin ? setshowConvo(true) : setModalType("login");
                }}
              >
                Start
              </button>
            </div>
            <div>
              <a href="#contact-us">
                <span className="cta-b2">Explore</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {modalType === "login" && (
        <ModalLogin
          modalType={modalType}
          setModalType={setModalType}
          closeModal={closeModal}
        />
      )}
      {modalType === "signup" && (
        <CAModalLogin
          modalType={modalType}
          setModalType={setModalType}
          closeModal={closeModal}
        />
      )}
      {showConvo && <ConversationBox setshowConvo={setshowConvo} />}
    </>
  );
}

export default CTA;
