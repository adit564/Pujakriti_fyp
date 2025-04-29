import { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
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
  products: Product[];
}

interface ProductImage {
  imageId: number;
  productId: number;
  imageUrl: string;
  name: string;
}

interface Category {
  categoryId: number;
  name: string;
  description: string;
}

export default function ProductList({ products }: Props) {
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("productId");
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
    agent.ProductsList.types()
      .then((types) => setCategories(types))
      .catch((error) => console.error("Error fetching categories:", error));

    agent.ProductImages.list()
      .then((images) => setProductImages(images.content))
      .catch((error) => console.error("Error fetching product Images:", error));
  }, []);




  function addItemToCart(product: Product) {
    if (!currentUser) {
      toast.warning(`Please Log in first`, {
        position: "bottom-right",
        autoClose: 5000,
      });
    } else {
      setLoading(true);


      
    if (product.price === null || product.price === undefined || product.price <= 0) {
      toast.error(`Invalid product price: ${product.price} for product ${product.name} (productId=${product.productId})`);
      return;
    }

    if (!product.stock || product.stock <= 0) {
      toast.error(`Product out of stock: ${product.name}`);
      return;
    }

      agent.Cartt.addItem(product, 1, dispatch, discountRate, currentUser?.user_Id)
        .then((response) => dispatch(setCart(response.cart)))
        .catch((error) => console.error("Failed to add item to cart: ", error))
        .finally(() => setLoading(false));
    }
  }

  const handleCategoryChange = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
  };

  // Filter by category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "productId") {
      return sortOrder === "asc"
        ? a.productId - b.productId
        : b.productId - a.productId;
    } else if (sortBy === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="products_page">
      <div className="products_page_header">
        <span>2025/Products</span>
        <span>All Products</span>
        <span>
        Discover the latest additions to the Puja products line from the FW 2025 collection, combining high quality and sustainability.
        </span>
      </div>

      {/* Category Filter */}
      <div className="category_filter">
        <select onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">All Categories</option>
          {categories
            .filter((category) => category.name.toLowerCase() !== "all")
            .map((category) => (
              <option key={category.categoryId} value={category.name}>
                {category.name}
              </option>
            ))}
        </select>
        <div className="sort_order">
          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="productId">Sort by Date Added</option>
            <option value="price">Sort by Price</option>
          </select>

          <select
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="product_container">
        {sortedProducts.map((product) => {
          const productImage = productImages.find(
            (img) => img.productId === product.productId
          );
          const imageUrl =
            productImage?.imageUrl || "/images/products_image.jpg";
          const fileName = "/images/product_img/" + imageUrl;

          return (
            <div className="product_div_container" key={product.productId}>
              <Link
                className="product_div"
                to={`/product/${product.productId}`}
              >
                <img src={fileName} alt={productImage?.name || "product_img"} />
                <div className="product_details">
                  <span className="productName">{product.name}</span>
                  <span className="productPrice">NPR {product.price}</span>
                </div>
              </Link>
              <span
                className="addToCart"
                onClick={(e) => {
                  e.preventDefault();
                  addItemToCart(product);
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
