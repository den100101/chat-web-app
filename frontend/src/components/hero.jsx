import { useState } from "react";
import Feature from "./feature";
import Testimony from "./testimony";
import Products from "./products";
import CTA from "./cta";
import Contact from "./contact";
import Footer from "./footer";
import ModalLogin from "./login";
import Message from "./message";
import ConversationBox from "./convobox";

function Hero({ isLoggedin, username }) {
  const [showConvo, setshowConvo] = useState(false);
  const [modalType, setModalType] = useState("");

  const closeModal = () => setModalType(null);

  return (
    <>
      <div className="hero-container">
        <div className="hero-description">
          {isLoggedin && <p className="welcome-header">Welcome {username}!</p>}

          <div className="hero-title">Custom cakes & cupcakes just for you</div>

          <div className="hero-desc">
            <p>
              We create beautiful, delicious cakes for every occasion, crafted
              with care in every detail.
            </p>
          </div>

          <div>
            <button
              className="hero-button button"
              onClick={() =>
                isLoggedin ? setshowConvo(true) : setModalType("login")
              }
            >
              Order Now
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img src="/Images/heroimage.jpg" alt="image" className="heroimg" />
        </div>
      </div>

      <Feature />
      <Testimony />
      <Products />
      <CTA isLoggedin={isLoggedin} />
      <Contact />
      <Footer />

      <Message isLoggedin={isLoggedin} />

      {showConvo && <ConversationBox setshowConvo={setshowConvo} />}

      {modalType && (
        <ModalLogin
          modalType={modalType}
          setModalType={setModalType}
          closeModal={closeModal}
          isLoggedin={isLoggedin}
          setisLoggedin={() => {}} // optional safety
        />
      )}
    </>
  );
}

export default Hero;
