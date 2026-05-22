function Contact() {
  return (
    <>
      <div className="contact-container">
        <div className="contacts-desc">
          <div className="contact-header" id="contact-us">
            <div>
              <p>Contact us</p>
            </div>
            <div>
              <h1>Get in touch</h1>
            </div>
            <div>
              <p>Have questions or ready to start planning?</p>
            </div>
          </div>
          <div className="insta">
            <div>
              <img
                src="/Images/instagram (1).png"
                alt="insta-logo"
                className="contact-logo"
              />
            </div>
            <div>
              <p>Instagram</p>
            </div>
            <div>
              <p>Reach out anytime</p>
            </div>
            <div>
              <a href="https://www.instagram.com/fabios.cakesandpastries/">
                <p className="a-contacts">fabios.cakesandpastries</p>
              </a>
            </div>
          </div>
          <div className="phone">
            <div>
              <img
                src="/Images/telephone.png"
                alt="telephone"
                className="contact-logo"
              />
            </div>
            <div>
              <p>Phone</p>
            </div>
            <div>
              <p>Call us during business hours</p>
            </div>
            <div>
              <p>+63 917 775 1213</p>
            </div>
          </div>
          <div className="location">
            <div>
              <img
                src="/Images/location.png"
                alt="location-log"
                className="contact-logo"
              />
            </div>
            <div>
              <p>Studio</p>
            </div>
            <div>
              <a href="https://www.google.com/maps/place/Calixto+Dyco,+Barangay+671,+Paco,+Manila,+Metro+Manila/@14.5820708,120.9934114,17z/data=!3m1!4b1!4m6!3m5!1s0x3397c989481f8385:0xe46730002283306c!8m2!3d14.5820708!4d120.9934114!16s%2Fg%2F1tgh0j4m?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D">
                <p className="a-contacts">
                  Calixto Dyco street, Manila, Philippines, 1007
                </p>
              </a>
            </div>
          </div>
        </div>
        <div className="location-img">
          <img src="/Images/map-location.png" alt="" className="map" />
        </div>
      </div>
    </>
  );
}

export default Contact;
