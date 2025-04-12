import axios from "axios";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFoundError from "../../app/errors/NotFoundError";
import Spinner from "../../app/layout/spinner";

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

  useEffect(() => {
    if (productId) {
      const numericId = parseInt(productId);
      
      // Combine both API calls
      Promise.all([
        agent.ProductsList.get(numericId),
        agent.ProductImages.get(numericId)
      ])
      .then(([product, images]) => {
        setProduct(product);
        setProductImages(images);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      })
      .finally(() => setLoading(false));
    } else {
      console.error("Product ID is undefined");
      setLoading(false);
    }
  }, [productId]);

  if(loading){
    console.log("Loading products...");
    return <Spinner message="Loading products..." />;
  }else{
    console.log("Products loaded successfully.");
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
            <div className="select_quantity">Quantity</div>

            <a href="#" className="add_to_cart_">
              Add to Cart
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
