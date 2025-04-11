import {useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import "../../app/styles/productLists.css";
import { Link } from "react-router-dom";
// import ProductCard from "./productCard";

interface Props {
  products: Product[];
}

interface ProductImage {
  imageId: number;
  productId: number;
  imageUrl: string;
  name: string;
}

export default function ProductList({ products }: Props) {
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    fetch(
      "http://localhost:8081/api/images/productImages?page=0&size=15&sort=imageId&order=asc"
    )
      .then((response) => response.json())
      .then((data) => {
        setProductImages(data.content);
      })
      .catch((error) => {
        console.error("Error fetching product Images:", error);
      });
  }, []);

  return (
    <>
      <div className="products_page">
        <div className="products_page_header">
          <span>2025/Products</span>
          <span>All Products</span>
          <span>
            Discover the latest additions to the Shoes line from the FW 2025
            collection, combining design, innovation, technology and
            sustainability.
          </span>
        </div>

        <div className="product_container">
          {products.map((product) => {
            const productImage = productImages.find(
              (image) => image.productId === product.productId
            );

            const imageUrl = productImage
              ? productImage.imageUrl
              : "/images/products_image.jpg"; // Use a default image if not found

            const fileName = "/images/product_img/" + imageUrl;

            return (
              <div className="product_div_container" key={product.productId}>
                  <Link className="product_div" to={`/product/${product.productId}`}>
                  <img
                    src={fileName}
                    alt={productImage?.name || "product_img"}
                  />
                  <div className="product_details">
                    <span className="productName">{product.name}</span>
                    <span className="productPrice">NPR {product.price}</span>
                  </div>
                  </Link>
                <a href="#" className="addToCart">
                  Add to cart
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
