import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Bundle } from "../../app/models/bundle";
import agent from "../../app/api/agent";
import NotFoundError from "../../app/errors/NotFoundError";
import Spinner from "../../app/layout/spinner";


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



useEffect(() => {
    if (bundleId) {
      const numericId = parseInt(bundleId);
      
      // Combine both API calls
      Promise.all([
        agent.BundleList.get(numericId),
        agent.BundleImages.get(numericId)
      ])
      .then(([bundle, images]) => {
        setBundle(bundle);
        setBundleImages(images);
      })
      .catch((error) => {
        console.error("Error fetching bundle data:", error);
      })
      .finally(() => setLoading(false));
    } else {
      console.error("Bundle ID is undefined");
      setLoading(false);
    }
  }
, [bundleId]);

  if (loading) return <Spinner message="Loading products..." />;
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