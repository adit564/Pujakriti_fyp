import { useEffect, useState } from "react";
import { Bundle } from "../../app/models/bundle";
import "../../app/styles/productLists.css";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../app/store/configureStore";
import { setCart } from "../cart/cartSlice";
import { toast } from "react-toastify";

interface Props {
  bundles: Bundle[];
}

interface BundleImage {
  imageId: number;
  bundleId: number;
  imageUrl: string;
  name: string;
}

interface Puja {
  id: number;
  name: string;
}

export default function BundleList({ bundles }: Props) {
  const [bundleImages, setBundleImages] = useState<BundleImage[]>([]);
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [selectedPuja, setSelectedPuja] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("bundleId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [loading, setLoading] = useState(true);

  const discount = useAppSelector(
    (state: RootState) => state.discount.discountCode
  );
  const discountRate = discount?.discountRate ?? 0;

  const dispatch = useAppDispatch();

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
    agent.BundleImages.list()
      .then((images) => setBundleImages(images.content))
      .catch((error) => console.error("Error fetching bundle Images:", error));

    agent.BundleList.types()
      .then((fetchedPujas) =>
        setPujas(fetchedPujas.filter((puja) => puja.name.toLowerCase() !== "all"))
      )
      .catch((error) => console.error("Error fetching pujas:", error));
  }, []);

  function addItemToCart(bundle: Bundle) {
    if (!currentUser) {
      toast.warning(`Please Log in first`, {
        position: "bottom-right",
        autoClose: 5000,
      });
    } else {
      setLoading(true);
      agent.Cartt.addItem(bundle, 1, dispatch, discountRate, currentUser?.user_Id)
        .then((response) => dispatch(setCart(response.cart)))
        .catch((error) => console.error("Failed to add item to cart: ", error))
        .finally(() => setLoading(false));
    }
  }

  // Filter bundles by selected puja
  const filteredBundles = selectedPuja
    ? bundles.filter((bundle) => bundle.puja === selectedPuja)
    : bundles;

  // Sort bundles
  const sortedBundles = [...filteredBundles].sort((a, b) => {
    if (sortBy === "bundleId") {
      return sortOrder === "asc"
        ? a.bundleId - b.bundleId
        : b.bundleId - a.bundleId;
    } else if (sortBy === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    }
    return 0;
  });

  return (
    <>
      <div className="bundles_page">
        <div className="bundles_page_header">
          <span>2025/Bundles</span>
          <span>All Bundles</span>
          <span>
            Discover the latest additions to the Shoes line from the FW 2025
            collection, combining design, innovation, technology and sustainability.
          </span>
        </div>

        {/* Puja Filter */}
        <div className="category_filter">
          <select onChange={(e) => setSelectedPuja(e.target.value || null)}>
            <option value="">All Pujas</option>
            {pujas.map((puja) => (
              <option key={puja.id} value={puja.name}>
                {puja.name}
              </option>
            ))}
          </select>
          <div className="sort_order">
          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="bundleId">Sort by Date Added</option>
            <option value="price">Sort by Price</option>
          </select>

          <select onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        </div>

        {/* Sort Dropdown */}


        <div className="bundle_container">
          {sortedBundles.map((bundle) => {
            const bundleImage = bundleImages.find(
              (image) => image.bundleId === bundle.bundleId
            );

            const imageUrl = bundleImage
              ? bundleImage.imageUrl
              : "/images/bundle_image.jpg";

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
                <span
                  className="addToCart"
                  onClick={(e) => {
                    e.preventDefault();
                    addItemToCart(bundle);
                  }}
                >
                  Add to cart
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}


