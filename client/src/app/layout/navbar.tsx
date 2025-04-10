import "../styles/navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="left_menu menu">
        <a href="/">Home</a>
        <a href="#">About</a>
        <a href="/productlist">Products</a>
        <a href="/bundles">Bundles</a>
        <a href="#">Contact</a>
      </div>
      <span className="logo">Pujakriti.</span>
      <div className="right_menu menu">
        <div className="search_button">
          <input type="text" placeholder="search" />
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="6.18279"
              cy="5.67107"
              r="4.70454"
              stroke="black"
              stroke-width="1.93306"
            />
            <path
              d="M9.19922 10.2334L14.5764 16.5884"
              stroke="#131313"
              stroke-width="1.93306"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div className="acc_button">
          {/* <a href="#">Login</a> */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8.07915"
              cy="5.45122"
              r="4.13735"
              stroke="black"
              stroke-width="1.70001"
            />
            <path
              d="M1.73242 15.0523C6.77385 11.61 9.56204 11.5505 14.4613 15.0523"
              stroke="#131313"
              stroke-width="1.70001"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div className="cart_button">
          {/* <a href="#">Cart</a> */}
          <svg
            width="17"
            height="18"
            viewBox="0 0 17 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="path-1-inside-1_1716_454" fill="white">
              <path d="M0.113281 6.42144C0.113281 5.90985 0.528011 5.49512 1.03961 5.49512H15.5134C16.025 5.49512 16.4397 5.90985 16.4397 6.42144V13.7162C16.4397 16.0824 14.5216 18.0005 12.1555 18.0005H4.39753C2.0314 18.0005 0.113281 16.0824 0.113281 13.7162V6.42144Z" />
            </mask>
            <path
              d="M0.113281 6.42144C0.113281 5.90985 0.528011 5.49512 1.03961 5.49512H15.5134C16.025 5.49512 16.4397 5.90985 16.4397 6.42144V13.7162C16.4397 16.0824 14.5216 18.0005 12.1555 18.0005H4.39753C2.0314 18.0005 0.113281 16.0824 0.113281 13.7162V6.42144Z"
              stroke="#131313"
              stroke-width="3.40001"
              mask="url(#path-1-inside-1_1716_454)"
            />
            <path
              d="M5.43954 8.75797V2.98829C5.41407 0.424461 11.083 0.251421 11.1132 2.98829V8.75797"
              stroke="#131313"
              stroke-width="1.70001"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
