import Carousel from "../../features/carousel/carousel.tsx";
import "../../app/styles/homePage.css";

export default function HomePage() {
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
            <a className="view_all_btn" href="#">
              View all products
            </a>
          </div>

          <div className="newProducts_container">
            <a className="product_div" href="#">
              <img src="/images/productimg.webp" alt="product_img" />
              <div className="product_details">
                <span className="productName">Inauguration Diya</span>
                <span className="productPrice">NPR 2000</span>
              </div>
            </a>
            <a className="product_div" href="#">
              <img src="/images/productimg.webp" alt="product_img" />
              <div className="product_details">
                <span className="productName">Inauguration Diya</span>
                <span className="productPrice">NPR 2000</span>
              </div>
            </a>
            <a className="product_div" href="#">
              <img src="/images/productimg.webp" alt="product_img" />
              <div className="product_details">
                <span className="productName">Inauguration Diya</span>
                <span className="productPrice">NPR 2000</span>
              </div>
            </a>
            <a className="product_div" href="#">
              <img src="/images/productimg.webp" alt="product_img" />
              <div className="product_details">
                <span className="productName">Inauguration Diya</span>
                <span className="productPrice">NPR 2000</span>
              </div>
            </a>
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
