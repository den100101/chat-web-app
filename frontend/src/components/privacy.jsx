function Privacy({ ModalClose }) {
  return (
    <>
      <div className="modal-background">
        <div className="modal-container">
          <div>
            <div className="modal-header">
              <h1> PRIVACY POLICY </h1>
              <div>
                <h1 onClick={() => ModalClose(false)} className="close-button">
                  X
                </h1>
              </div>
            </div>
          </div>
          <div className="privacy-font">
            <p>
              Fabio’s Cakes and Pastries respects your privacy and is committed
              to protecting the personal information you share with us.
            </p>

            <h3>1. Information We Collect</h3>
            <p>
              We may collect the following information when you place an order
              or contact us:
            </p>
            <ul>
              <li>Full name</li>
              <li>Contact number</li>
              <li>Delivery address (if applicable)</li>
              <li>Order details</li>
              <li>Messages or inquiries you send to us</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>We use your information to:</p>
            <ul>
              <li>Process and confirm your orders</li>
              <li>Deliver products to your location</li>
              <li>Contact you regarding your order</li>
              <li>Improve our products and services</li>
            </ul>

            <h3>3. Information Sharing</h3>
            <p>
              We do not sell or share your personal information with third
              parties, except:
            </p>
            <ul>
              <li>When required for delivery services</li>
              <li>When required by law</li>
            </ul>

            <h3>4. Data Protection</h3>
            <p>
              We take reasonable steps to protect your personal information from
              unauthorized access, misuse, or disclosure.
            </p>

            <h3>5. Cookies / Online Data</h3>
            <p>
              If you use our website, we may use cookies to improve user
              experience and track basic site usage.
            </p>

            <h3>6. Your Rights</h3>
            <ul>
              <li>Access your personal data</li>
              <li>Update or correct your information</li>
              <li>
                Request deletion of your data (subject to legal requirements)
              </li>
            </ul>

            <h3>7. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy anytime. Changes will be posted
              on our official page or website.
            </p>

            <h3>8. Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy, you can contact
              us at: Fabio’s FB Page / +63 917 775 1213
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Privacy;
