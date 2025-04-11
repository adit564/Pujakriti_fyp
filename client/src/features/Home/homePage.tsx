import Carousel from "../../features/carousel/carousel.tsx";
import "../../app/styles/homePage.css";
import { useState, useEffect } from "react";
import { Product } from "../../app/models/product.ts";

export default function HomePage() {

  interface ProductImage {
    imageId: number;
    productId: number;
    imageUrl: string;
    name: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    fetch(
      "http://localhost:8081/api/products?page=0&size=4&sort=productId&order=asc"
    )
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.content);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

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
  }
    , []);

  const carouselItems = [
    {
      id: 1,
      videoUrl: "/videos/1.mp4",
      title: "Discover Authentic Puja Essentials",
    },
    {
      id: 2,
      videoUrl: "/videos/2.mp4",
      title: "Your Guide to Meaningful Puja/Ceremony/Rituals",
    },
    {
      id: 3,
      videoUrl: "/videos/3.mp4",
      title: "Embrace Traditions",
    },
    {
      id: 4,
      videoUrl: "/videos/4.mp4",
      title: "Connecting Through Puja/Ceremony",
    },

    // Add more items as needed
  ];

  return (
    <div>
      <Carousel
        items={carouselItems}
        autoPlayInterval={5000}
        blurIntensity={60} // Adjust blur strength as needed
      />

      <div className="home_product_page">
        <div className="home_page_links">
          <div className="product_page_link">
            <img src="/images/products_image.jpg" alt="products_image" />
            <a className="page_link" href="#">
              View Products
            </a>
          </div>
          <div className="product_page_link">
            <img src="/images/bundle_image.jpg" alt="bundle_image" />
            <a className="page_link" href="#">
              View Bundles
            </a>
          </div>
        </div>

        <div className="home_newProducts">
          <div className="newProducts_header">
            <span>2025/Products</span>
            <span>New Products</span>
            <span>
              Discover the latest additions to the Shoes line from the FW 2025
              collection, combining design, innovation, technology and
              sustainability.
            </span>
            <div className="newProducts__links">
              <a className="view_all_btn" href="#">
                View all products
              </a>
              <a className="view_all_bundle" href="#">
                View all bundles
              </a>
            </div>

          </div>

          <div className="newProducts_container">

          {products.map((product) => {
            const productImage = productImages.find(
              (image) => image.productId === product.productId
            );

            const imageUrl = productImage
              ? productImage.imageUrl
              : "/images/products_image.jpg"; // Use a default image if not found

            const fileName = "/images/product_img/" + imageUrl;

            return(
            <div className="homeproduct_div_container" key={product.productId}>
              <a className="product_div" href="#">
                                <img
                    src={fileName}
                    alt={productImage?.name || "product_img"}
                  />
                <div className="product_details">
                  <span className="productName">{product.name}</span>
                  <span className="productPrice">NPR {product.price}</span>
                </div>
              </a>
              <a href="#" className="addToCart">Add to cart</a>
            </div>
          )
          })}


            {/* <div className="homeproduct_div_container">
              <a className="product_div" href="#">
                <img src="/images/productimg.webp" alt="product_img" />
                <div className="product_details">
                  <span className="productName">Inauguration Diya</span>
                  <span className="productPrice">NPR 2000</span>
                </div>
              </a>
              <a href="" className="addToCart">Add to cart</a>
            </div>
            <div className="homeproduct_div_container">
              <a className="product_div" href="#">
                <img src="/images/productimg.webp" alt="product_img" />
                <div className="product_details">
                  <span className="productName">Inauguration Diya</span>
                  <span className="productPrice">NPR 2000</span>
                </div>
              </a>
              <a href="" className="addToCart">Add to cart</a>
            </div>
            <div className="homeproduct_div_container">
              <a className="product_div" href="#">
                <img src="/images/productimg.webp" alt="product_img" />
                <div className="product_details">
                  <span className="productName">Inauguration Diya</span>
                  <span className="productPrice">NPR 2000</span>
                </div>
              </a>
              <a href="" className="addToCart">Add to cart</a>
            </div> */}
          </div>
        </div>
      </div>

      <div className="home_About">
        <h2>Nepal’s</h2>
        <h2>First Guided Puja Store.</h2>
        <h4>
          We offer individual puja items and curated bundles for every
          ritual—tailored to Nepal's diverse castes and traditions. Each bundle
          includes a free, easy-to-follow guide to help you perform ceremonies
          with authenticity and ease. From everyday rituals to grand
          celebrations, we make your spiritual journey complete.
        </h4>
        <div className="home_about_container">
          <div className="home_about_content">
            <h3> Pujakriti – Keeping Traditions Alive, the Right Way.</h3>
            <h5 className="home_desc_text">
              Nepal is a land of deep spirituality, where every community
              celebrates its own unique rituals. From birth to death, from
              festivals to daily prayers—pujas connect us to our roots, to our
              gods, and to each other. At Pujakriti, we honor this diversity by
              offering carefully curated puja bundles, tailored to different
              castes and ceremonies. Each bundle includes all essential items
              along with a step-by-step guide, so you can perform every ritual
              with confidence and devotion. Whether you're near or far, keeping
              your tradition alive is now just a click away.
            </h5>
          </div>
          <img src="/images/bg_img.jpg" alt="pooja" />
        </div>
      </div>
    </div>
  );
}
