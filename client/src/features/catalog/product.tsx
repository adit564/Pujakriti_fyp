import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFoundError from "../../app/errors/NotFoundError";
import { useAppDispatch } from "../../app/store/configureStore";
import { setCart } from "../cart/cartSlice";

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


  useEffect(() => {
    if (productId) {
      const numericId = parseInt(productId);

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
        });
    } else {
      console.error("Product ID is undefined");
    }
  }, [productId]);


  const dispatch = useAppDispatch();

  function addItemToCart() {
    setLoading(true);
    agent.Cartt.addItem(product,quantity, dispatch)
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
              <span>{product.price}</span>
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
