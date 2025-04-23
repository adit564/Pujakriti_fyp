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

interface Caste {
  casteId: number;
  name: string;
}

interface BundleCaste {
  id: number;
  bundleId: number;
  casteId: number;
}

export default function BundleList({ bundles }: Props) {
  const [bundleImages, setBundleImages] = useState<BundleImage[]>([]);
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [castes, setCastes] = useState<Caste[]>([]);
  const [bundleCastes, setBundleCastes] = useState<BundleCaste[]>([]);
  const [selectedPuja, setSelectedPuja] = useState<string | null>(null);
  const [selectedCaste, setSelectedCaste] = useState<number | null>(null);
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
    // Fetch all necessary data
    Promise.all([
      agent.BundleImages.list(),
      agent.BundleList.types(),
      agent.BundleList.allCastes(),
      agent.BundleList.allBundleCastes()
    ])
      .then(([images, fetchedPujas, fetchedCastes, fetchedBundleCastes]) => {
        setBundleImages(images.content);
        setPujas(fetchedPujas.filter((puja: Puja) => puja.name.toLowerCase() !== "all"));
        setCastes(fetchedCastes.filter((caste: Caste) => caste.casteId !== 0));
        setBundleCastes(fetchedBundleCastes);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  function addItemToCart(bundle: Bundle) {
    if (!currentUser) {
      toast.warning(`Please Log in first`, {
        position: "bottom-right",
        autoClose: 5000,
      });
    } else {
      setLoading(true);

      if (bundle.price === null || bundle.price === undefined || bundle.price <= 0) {
        toast.error(`Invalid bundle price: ${bundle.price} for product ${bundle.name} (productId=${bundle.bundleId})`);
        return;
      }
  
      if (!bundle.stock || bundle.stock <= 0) {
        toast.error(`Bundle out of stock: ${bundle.name}`);
        return;
      }

      agent.Cartt.addItem(bundle, 1, dispatch, discountRate, currentUser?.user_Id)
        .then((response) => dispatch(setCart(response.cart)))
        .catch((error) => console.error("Failed to add item to cart: ", error))
        .finally(() => setLoading(false));
    }
  }

  // Get bundles that match the selected caste
  const getBundlesByCaste = (casteId: number | null) => {
    if (!casteId) return bundles;
    const bundleIds = bundleCastes
      .filter(bc => bc.casteId === casteId)
      .map(bc => bc.bundleId);
    return bundles.filter(bundle => bundleIds.includes(bundle.bundleId));
  };

  // Filter bundles by selected puja and caste
  const filteredBundles = (selectedPuja || selectedCaste) 
    ? bundles.filter(bundle => {
        const pujaMatch = !selectedPuja || bundle.puja === selectedPuja;
        const casteMatch = !selectedCaste || 
          bundleCastes.some(bc => 
            bc.bundleId === bundle.bundleId && bc.casteId === selectedCaste
          );
        return pujaMatch && casteMatch;
      })
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
    <div className="bundles_page">
      <div className="bundles_page_header">
        <span>2025/Bundles</span>
        <span>All Bundles</span>
        <span>
          Discover the latest additions to the Shoes line from the FW 2025
          collection, combining design, innovation, technology and sustainability.
        </span>
      </div>

      {/* Filters Section */}
      <div className="category_filter">
        {/* Puja Filter */}
        <select 
          onChange={(e) => setSelectedPuja(e.target.value || null)}
          value={selectedPuja || ""}
        >
          <option value="">All Pujas</option>
          {pujas.map((puja) => (
            <option key={puja.id} value={puja.name}>
              {puja.name}
            </option>
          ))}
        </select>

        {/* Caste Filter */}
        <select 
          onChange={(e) => setSelectedCaste(e.target.value ? parseInt(e.target.value) : null)}
          value={selectedCaste || ""}
        >
          <option value="">All Castes</option>
          {castes.map((caste) => (
            <option key={caste.casteId} value={caste.casteId}>
              {caste.name}
            </option>
          ))}
        </select>

        {/* Sort Options */}
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

      {/* Bundles List */}
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
  );
}