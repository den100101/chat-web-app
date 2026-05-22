import { useState } from "react";
import Privacy from "./privacy";

function Footer() {
  const [OpenModal, setOpenModal] = useState(false);
  return (
    <>
      <div className="footer-container">
        <div>
          <img src="/Images/logo.png" alt="logo" className="logo" />
        </div>
        <div className="footer-nav">
          <li>
            <a href="#home">
              <p className="footer-a">Home</p>
            </a>
          </li>
          <li>
            <a href="#feature">
              <p className="footer-a">Feature</p>
            </a>
          </li>
          <li>
            <a href="#testimonials">
              <p className="footer-a">Testimonials</p>
            </a>
          </li>
          <li>
            <a href="#products">
              <p className="footer-a">Products</p>
            </a>
          </li>
          <li>
            <a href="#contact-us">
              <p className="footer-a">Contact us</p>
            </a>
          </li>
        </div>
      </div>
      <div className="footer-foot-container">
        <div className="custom">
          © 2025 Custom Cake Website. All rights reserved.
        </div>
        <div className="policies">
          <div>
            <p onClick={() => setOpenModal(true)}>Privacy policy</p>
          </div>
          <div>
            <p>Terms of service</p>
          </div>
        </div>
      </div>
      {OpenModal && <Privacy ModalClose={setOpenModal} />}
    </>
  );
}

export default Footer;
