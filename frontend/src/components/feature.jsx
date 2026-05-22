function Feature() {
  return (
    <>
      <div className="feature-container" id="feature">
        <div className="feature-desc">
          <h1>Fabio's Cake & Pastries</h1>
          <p>Tell us what you want,We make it real</p>
        </div>
        <div className="card-containers">
          <div className="cards card1">
            <div className="card-blur">
              <div className="card-desc">
                <p>Ingredients</p>
                <h1>Ingredients matter</h1>
                <p>We use only the best. No shortcuts, no compromises</p>
                <a href="">Contact us &gt;</a>
              </div>
            </div>
          </div>
          <div className="cards card2">
            <div className="card-blur">
              <div className="card-desc">
                <p>Delivery</p>
                <h1>Fast local delivery</h1>
                <p>Your cake arrives fresh and on time, ready to celebrate.</p>
                <a href="">Order &gt;</a>
              </div>
            </div>
          </div>
          <div className="cards card3">
            <div className="card-blur">
              <div className="card-desc">
                <p>Consultation</p>
                <h1>Talk with us first</h1>
                <p>We listen. We understand what you need for your day.</p>
                <a href="">Book &gt;</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Feature;
