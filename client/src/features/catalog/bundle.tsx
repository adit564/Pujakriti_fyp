import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Bundle } from "../../app/models/bundle";
import agent from "../../app/api/agent";
import NotFoundError from "../../app/errors/NotFoundError";
import { useAppDispatch } from "../../app/store/configureStore";
import { setCart } from "../cart/cartSlice";

interface BundleImage {
  imageId: number;
  bundleId: number;
  imageUrl: string;
  name: string;
}

export default function Bundle() {
  const bundleId = useParams<{ bundleId: string }>().bundleId;
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [bundleImages, setBundleImages] = useState<BundleImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {
    if (bundleId) {
      const numericId = parseInt(bundleId);

      Promise.all([
        agent.BundleList.get(numericId),
        agent.BundleImages.get(numericId),
      ])
        .then(([bundle, images]) => {
          setBundle(bundle);
          setBundleImages(images);
        })
        .catch((error) => {
          console.error("Error fetching bundle data:", error);
        });
    } else {
      console.error("Bundle ID is undefined");
    }
  }, [bundleId]);


  const dispatch = useAppDispatch();

  function addItemToCart() {
    setLoading(true);
    agent.Cartt.addItem(bundle,quantity, dispatch)
    .then(response=>{
      console.log("Item added to cart: ", response.cart);
      dispatch(setCart(response.cart));
    })
    .catch(error=>{
      console.error("Failed to add item to cart: ", error);
    })
    .finally(()=>{
      setLoading(false);
    });
  }

  if (!bundle) return <NotFoundError />;

  return (
    <>
      <div className="bund_container">
        <div className="bund_image_container">
          <img
            src={`/images/bundle_img/${bundleImages?.imageUrl}`}
            alt={`${bundle.name}`}
          />
        </div>
        <div className="bund_details_container">
          <div className="bund_details_header">
            <div className="bund_details_title">
              <span>/{bundle.puja}</span>
              <span>/Price</span>
              <span>/Guide</span>
            </div>
            <div className="bund_details">
              <span>{bundle.name}</span>
              <span>{bundle.price}</span>
              <span>{bundle.guide}</span>
            </div>
            <span className="bund_desc">{bundle.description}</span>
          </div>
          <div className="bund_details_btn">
            <div className="quantity_btn">
              <span>Quantity</span>
              <span
                className="btn"
                onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
              >
                -
              </span>
              <span>{quantity}</span>
              <span
                className="btn"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </span>
            </div>

            <span className="add_to_cart_" onClick={addItemToCart}>
              Add to Cart
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
