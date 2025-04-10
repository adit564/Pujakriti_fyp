import { useEffect, useState } from "react";
import { Bundle } from "../../app/models/bundle";
import "../../app/styles/productLists.css";

interface Props {
  bundles: Bundle[];
}

interface BundleImage {
  imageId: number;
  bundleId: number;
  imageUrl: string;
  name: string;
}

export default function BundleList({ bundles }: Props) {
  const [bundleImages, setBundleImages] = useState<BundleImage[]>([]);

  useEffect(() => {
    fetch(
      "http://localhost:8081/api/images/bundlesImages?page=0&size=10&sort=imageId&order=asc"
    )
      .then((response) => response.json())
      .then((data) => {
        setBundleImages(data.content);
      })
      .catch((error) => {
        console.error("Error fetching bundle Images:", error);
      });
  }, []);

  return (
    <>
      <div className="products_page">
        <div className="products_page_header">
          <span>2025/Bundles</span>
          <span>All Bundles</span>
          <span>
            Discover the latest additions to the Shoes line from the FW 2025
            collection, combining design, innovation, technology and
            sustainability.
          </span>
        </div>

        <div className="product_container">
          {bundles.map((bundle) => {
            const bundleImage = bundleImages.find(
              (image) => image.bundleId === bundle.bundleId
            );
            const imageUrl = bundleImage
              ? bundleImage.imageUrl
              : "/images/bundle_image.jpg"; // Use a default image if not found

            const fileName = "/images/bundle_img/" + imageUrl;

            return (
              <div className="product_div_container" key={bundle.bundleId}>
                <a className="product_div" href="#">
                <img
                    src={fileName}
                    alt={bundleImage?.name || "bundle_img"}
                  />
                  <div className="product_details">
                    <span className="productName">{bundle.name}</span>
                    <span className="productPrice">NPR {bundle.price}</span>
                  </div>
                </a>
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
