import { useEffect, useState } from "react";
import { Bundle } from "../../app/models/bundle";
import "../../app/styles/productLists.css";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";

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
    agent.BundleImages.list()
      .then((images) => setBundleImages(images.content))
      .catch((error) => console.error("Error fetching bundle Images:", error));
  }, []);

  return (
    <>
      <div className="bundles_page">
        <div className="bundles_page_header">
          <span>2025/Bundles</span>
          <span>All Bundles</span>
          <span>
            Discover the latest additions to the Shoes line from the FW 2025
            collection, combining design, innovation, technology and
            sustainability.
          </span>
        </div>

        <div className="bundle_container">
          {bundles.map((bundle) => {
            const bundleImage = bundleImages.find(
              (image) => image.bundleId === bundle.bundleId
            );
            const imageUrl = bundleImage
              ? bundleImage.imageUrl
              : "/images/bundle_image.jpg"; // Use a default image if not found

            const fileName = "/images/bundle_img/" + imageUrl;

            return (
              <div className="bundle_div_container" key={bundle.bundleId}>
                <Link className="bundle_div" to={`/bundle/${bundle.bundleId}`}>
                <img
                    src={fileName}
                    alt={bundleImage?.name || "bundle_img"}
                  />
                  <div className="bundle_details">
                    <span className="bundleName">{bundle.name}</span>
                    <span className="bundlePrice">NPR {bundle.price}</span>
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
