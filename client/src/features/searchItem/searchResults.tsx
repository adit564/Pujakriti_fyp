import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { Bundle } from "../../app/models/bundle"; 
import "../../app/styles/productLists.css";

interface ProductImage {
  imageId: number;
  productId: number;
  imageUrl: string;
  name: string;
}

interface BundleImage {
  imageId: number;
  bundleId: number;
  imageUrl: string;
  name: string;
}

export default function SearchResults() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [bundleImages, setBundleImages] = useState<BundleImage[]>([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    if (!keyword) return;

    agent.ProductsList.search(keyword).then(setProducts);
    agent.BundleList.search(keyword).then(setBundles);
    agent.ProductImages.list().then((res) => setProductImages(res.content));
    agent.BundleImages.list().then((res) => setBundleImages(res.content));
  }, [keyword]);

  return (
    <div className="products_page">
      <div className="products_page_header">
        <span>Search Results for "{keyword}"</span>
        <span>Products & Bundles</span>
      </div>

      <div className="product_container">
        {products.map((product) => {
          const productImage = productImages.find(
            (img) => img.productId === product.productId
          );
          const imageUrl = productImage
            ? productImage.imageUrl
            : "default-product.jpg";

          return (
            <div className="product_div_container" key={`product-${product.productId}`}>
              <Link className="product_div" to={`/product/${product.productId}`}>
                <img src={`/images/product_img/${imageUrl}`} alt={product.name} />
                <div className="product_details">
                  <span className="productName">{product.name}</span>
                  <span className="productPrice">NPR {product.price}</span>
                </div>
              </Link>
            </div>
          );
        })}

        {bundles.map((bundle) => {
          const bundleImage = bundleImages.find(
            (img) => img.bundleId === bundle.bundleId
          );
          const imageUrl = bundleImage
            ? bundleImage.imageUrl
            : "default-bundle.jpg";

          return (
            <div className="product_div_container" key={`bundle-${bundle.bundleId}`}>
              <Link className="product_div" to={`/bundle/${bundle.bundleId}`}>
                <img src={`/images/bundle_img/${imageUrl}`} alt={bundle.name} />
                <div className="product_details">
                  <span className="productName">{bundle.name}</span>
                  <span className="productPrice">NPR {bundle.price}</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
