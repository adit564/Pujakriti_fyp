import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFoundError from "../../app/errors/NotFoundError";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../app/store/configureStore";
import { setCart } from "../cart/cartSlice";
import { toast } from "react-toastify";

interface ProductImage {
  imageId: number;
  productId: number;
  imageUrl: string;
  name: string;
}

export default function Product() {
  const productId = useParams<{ productId: string }>().productId;

  const [product, setProduct] = useState<Product | null>();

  const [productImages, setProductImages] = useState<ProductImage | null>();

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  const discount = useAppSelector(
    (state: RootState) => state.discount.discountCode
  );
  const discountRate = discount?.discountRate ?? 0;

  const userString = localStorage.getItem("user");
  let currentUser: { user_Id: number | undefined } | null = null;

  if (userString) {
    try {
      currentUser = JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing user data from local storage:", error);
    }
  }

  useEffect(() => {
    if (productId) {
      const numericId = parseInt(productId);
      setLoading(true);
      Promise.all([
        agent.ProductsList.get(numericId),
        agent.ProductImages.get(numericId),
      ])
        .then(([product, images]) => {
          setProduct(product);
          setProductImages(images);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error("Product ID is undefined");
    }
  }, [productId]);

  const dispatch = useAppDispatch();

  async function addItemToCart() {
    if (!currentUser) {
      toast.warning(`Please Log in first`, {
        position: "bottom-right",
        autoClose: 5000,
      });
    } else {
      setLoading(true);
      try {
        const response = await agent.Cartt.addItem(
          product,
          quantity,
          dispatch,
          discountRate,
          currentUser?.user_Id
        );
        dispatch(setCart(response.cart));
      } catch (error) {
        console.error("Failed to add item to cart: ", error);
      } finally {
        setLoading(false);
      }
    }
  }

  if (loading) return <div>Loading...</div>;

  if (!product) return <NotFoundError />;

  return (
    <>
      <div className="prod_container">
        <div className="prod_image_container">
          <img
            src={`/images/product_img/${productImages?.imageUrl}`}
            alt={`${product.name}`}
          />
        </div>
        <div className="prod_details_container">
          <div className="prod_details_header">
            <div className="prod_details_title">
              <span>/{product.category}</span>
              <span>/Price</span>
              <span>/Stock</span>
            </div>
            <div className="prod_details">
              <span>{product.name}</span>
              <span>NPR {product.price}</span>
              <span>{product.stock}</span>
            </div>
            <span className="prod_desc">{product.description}</span>
          </div>
          <div className="prod_details_btn">
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
                onClick={() =>
                  setQuantity((prev) =>
                    product && prev < product.stock ? prev + 1 : prev
                  )
                }
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
