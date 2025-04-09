import { Product } from "../../app/models/product";
import "../../app/styles/productLists.css";
// import ProductCard from "./productCard";

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  return (
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
        {products.map((product) => (
          <a className="product_div" href="#" key={product.productId}>
            <img src="/images/productimg.webp" alt="product_img" />
            <div className="product_details">
              <span className="productName">{product.name}</span>
              <span className="productPrice">NPR {product.price}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
