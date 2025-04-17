import { useEffect, useState } from "react";
import "../../app/styles/cartPage.css";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import cartService from "../../app/api/cartService";
import { setCart } from "./cartSlice";

interface CartItemDetail {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export default function CartPage() {
  const [quantity, setQuantity] = useState(1);
  const [itemDetails, setItemDetails] = useState<
    Record<number, CartItemDetail>
  >({});

  const { cart } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { Cartt: CartActions } = agent;


  const discount = useAppSelector(
    (state: RootState) => state.discount.discountCode
  );
  const discountRate = discount?.discountRate ?? 0;

  const userString = localStorage.getItem("user");
  let currentUser: { user_Id: number | undefined } | null = null;

  if (userString) {
    try {
      currentUser = JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing user data from local storage:", error);
    }
  }
  if (!currentUser) {
    return (
      <div className="cartPage">
        <h2>Please Log in to add items.</h2>
      </div>
    );
  }


  useEffect(() => {
    const fetchCartFromStorage = async () => {
      const cartId = localStorage.getItem("cart_id");
  
      if (cartId && !cart) {
        try {
          const fetchedCart = await cartService.getCartById(cartId);
          dispatch(setCart(fetchedCart));
        } catch (err) {
          console.error("Error loading cart:", err);
          localStorage.removeItem("cart_id"); // cart might be deleted on backend
        }
      }
    };
  
    fetchCartFromStorage();
  }, [cart]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!cart?.cartItems) return;

      const detailMap: Record<number, CartItemDetail> = {};

      await Promise.all(
        cart.cartItems.map(async (item) => {
          try {
            let detail;
            let imageUrl = "/images/product_img/default.jpg";

            if (item.productId) {
              detail = await agent.ProductsList.get(item.productId);
              const productImage = await agent.ProductImages.get(
                item.productId
              );
              imageUrl = `/images/product_img/${productImage.imageUrl}`;
            } else if (item.bundleId) {
              detail = await agent.BundleList.get(item.bundleId);
              const bundleImage = await agent.BundleImages.get(item.bundleId);
              imageUrl = `/images/bundle_img/${bundleImage.imageUrl}`;
            }

            if (detail) {
              detailMap[item.cartItemId] = {
                name: detail.name,
                description: detail.description,
                price: detail.price,
                imageUrl,
              };
            }
          } catch (err) {
            console.error("Failed to fetch details for item", item, err);
          }
        })
      );

      setItemDetails(detailMap);
    };

    fetchItemDetails();
  }, [cart]);

  const remove_cart_item = (cart_itemId: number) => {
    CartActions.removeItem(cart_itemId, dispatch);
  };

  const increment_cart_item = (cart_itemId: number, quantity: number = 1) => {
    CartActions.incrementItemQuantity(cart_itemId, quantity, dispatch);
  };

  const decrement_cart_item = (cart_itemId: number, quantity: number = 1) => {
    CartActions.decrementItemQuantity(cart_itemId, quantity, dispatch);
  };

  const totals = cart ? cartService.getCartTotals(cart, discountRate) : null;

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="cartPage">
        <h1>No items in cart</h1>
      </div>
    );
  }

  return (
    <div className="cartPage">
      {cart.cartItems.map((item) => {
        const detail = itemDetails[item.cartItemId];

        return (
          <div key={item.cartItemId} className="cartItem">
            <div className="cart_Item_container">
              <div className="cart_Item_image">
                <img src={detail?.imageUrl} alt={detail?.name} />
              </div>

              <div className="cart_item_details">
                <div className="cart_item_detail">
                  <span>{detail?.name || "Loading..."}</span>
                  <p>{detail?.description || ""}</p>
                </div>
                <div className="quantity_btn">
                  <span>Quantity</span>
                  <span
                    className="btn"
                    onClick={() =>
                      decrement_cart_item(item.cartItemId, quantity)
                    }
                  >
                    -
                  </span>
                  <span>{item.quantity}</span>
                  <span
                    className="btn"
                    onClick={() =>
                      increment_cart_item(item.cartItemId, quantity)
                    }
                  >
                    +
                  </span>
                </div>
              </div>
            </div>

            <div className="cart_item_footer">
              <span
                className="remove_cart_item"
                onClick={() => remove_cart_item(item.cartItemId)}
              >
                Remove item
              </span>
              <span className="cartItem_price">NPR {detail?.price || 0}</span>
            </div>
          </div>
        );
      })}

      <div className="cart_totals_container">
        <div className="cart_totals">
          <div className="cart_totals_header">
            <span className="cart_page_title">Cart Page</span>

            <span className="applied_discount">{discount?.code} {(discount?.discountRate ?? 0) * 100}% Discount </span>
            <div className="cart_totals_details">
              <div className="cart_total">
                <span>Total:</span>
                <span>{totals?.total.toFixed(2)}</span>
              </div>
              <div className="cart_discount">
                <span>Discount:</span>
                <span>{totals?.discount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="cart_totals_footer">
            <span>Grand Total:</span>
            <span>NPR {totals?.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <span className="checkoutBtn">Checkout</span>
      </div>
    </div>
  );
}
