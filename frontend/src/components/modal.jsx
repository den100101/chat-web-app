const cakes = Array.from(
  { length: 30 },
  (_, i) => `/Images/Products/cakes/${i + 1}.PNG`,
);

const cakes2 = Array.from(
  { length: 70 },
  (_, i) => `/Images/Products/cakes2/${i + 31}.jpg`,
);

function Modal({ ModalClose }) {
  const allCakes = [...cakes, ...cakes2];
  return (
    <>
      <div className="modal-background">
        <div className="modal-container">
          <div className="modal-title">
            <div className="m-title">
              <h1>Cakes</h1>
            </div>
            <div>
              <button
                onClick={() => ModalClose(false)}
                className="modal-button"
              >
                X
              </button>
            </div>
          </div>
          <div className="modal-image-container">
            {allCakes.map((cakes, i) => (
              <div key={i}>
                <img
                  src={cakes}
                  alt="cakes"
                  className="cake-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
