import { useState } from "react";
import Modal from "./modal";
import ModalCupcakes from "./modalcc";

const cakes = Array.from(
  { length: 6 },
  (_, i) => `Images/Products/cakes/img${i + 1}.jpg`,
);

const cupcakes = Array.from(
  { length: 6 },
  (_, i) => `Images/Products/cupcakes/ccimg${i + 1}.jpg`,
);

function Products() {
  const [modalType, setModalType] = useState(null);
  return (
    <>
      <div className="products-section">
        <div className="product-decs">
          <div>
            <h1 id="products">Our work</h1>
          </div>
          <div>
            <p>See what we create. Each cake tells its own story.</p>
          </div>
        </div>
        <div className="product-container">
          <div className="cake-grid-container">
            {cakes.map((cake, i) => (
              <div key={i}>
                {" "}
                <img
                  src={cake}
                  alt="cake"
                  className="cake-img"
                  loading="lazy"
                />
              </div>
            ))}
            <div>
              <button
                className="view-button"
                onClick={() => {
                  setModalType("cakes");
                }}
              >
                View all cakes{" "}
              </button>
            </div>
          </div>
          <div className="cupcake-grid-container">
            {cupcakes.map((cupcake, i) => (
              <div key={i}>
                <img
                  src={cupcake}
                  alt="cupcake"
                  className="cupcake-img"
                  loading="lazy"
                />
              </div>
            ))}
            <div>
              <button
                className="view-button"
                onClick={() => {
                  setModalType("cupcakes");
                }}
              >
                View all cupcakes
              </button>
            </div>
          </div>
        </div>
      </div>
      {modalType === "cakes" && <Modal ModalClose={setModalType} />}

      {modalType === "cupcakes" && <ModalCupcakes ModalClose={setModalType} />}
    </>
  );
}

export default Products;
