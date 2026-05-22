const allCupcakes = Array.from(
  { length: 30 },
  (_, i) => `/Images/Products/cupcakes/${i + 1}.jpg`,
);

function ModalCupcakes({ ModalClose }) {
  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-title">
          <div className="m-title">
            <h1>Cupcakes</h1>
          </div>
          <div>
            <button onClick={() => ModalClose(null)} className="modal-button">
              X
            </button>
          </div>
        </div>

        <div className="modal-image-container">
          {allCupcakes.map((img, i) => (
            <div key={i}>
              <img
                src={img}
                alt="cupcake"
                className="cupcake-img"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ModalCupcakes;
