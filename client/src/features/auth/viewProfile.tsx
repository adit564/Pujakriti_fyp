import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import agent, { OrdersResponse } from "../../app/api/agent";
import { toast } from "react-toastify";
import "../../app/styles/profile.css";
import { User } from "../../app/models/user";

export default function ViewProfile() {
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
      <div className="profile-page">
        <div className="content-container">
          <h2>Please Log in to view your profile.</h2>
        </div>
      </div>
    );
  }

  const [userResponse, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OrdersResponse[]>([]);
  const [editUser, setEditUser] = useState<User>({
    name: "",
    email: "",
    phone: "",
    role: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = currentUser?.user_Id;
        if (userId) {
          const userResp = await agent.User.getUser(userId);
          setUser(userResp);
          setEditUser(userResp);
        }
      } catch (error) {
        toast.error("Failed to fetch user: " + error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = currentUser?.user_Id;
        if (userId) {
          const ordersList = await agent.Orders.getAllOrders(userId);
          setOrders(ordersList);
        }
      } catch (error) {
        toast.error("Failed to load orders: " + error);
      }
    };
    fetchOrders();
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      phone: ""
    };

    if (!editUser.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (editUser.name.length > 50) {
      newErrors.name = "Name must be 50 characters or less";
      valid = false;
    }

    if (!editUser.phone.trim()) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(editUser.phone)) {
      newErrors.phone = "Phone must be 10 digits";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (currentUser?.user_Id) {
      try {
        await agent.User.updateUser(currentUser.user_Id, editUser);
        toast.success("Profile updated successfully");
        setUser(editUser);
        setIsEditing(false);
      } catch (error) {
        toast.error("Failed to update profile");
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditUser(userResponse || { name: "", email: "", phone: "", role: "" });
    setErrors({ name: "", phone: "" });
  };

  const calculateDiscountDetails = (order: OrdersResponse) => {
    if (!order.discountRate || order.discountRate <= 0) {
      return null;
    }

    const originalAmount = order.totalAmount / (1 - order.discountRate);
    const discountAmount = originalAmount - order.totalAmount;

    return {
      originalAmount,
      discountAmount,
      discountPercentage: order.discountRate * 100
    };
  };

  return (
    <div className="profile-page">
      <div className="content-container">
        <div className="profile-grid">
          <div className="user-info-card">
            <h2>User Information</h2>
            {userResponse && !isEditing && (
              <div className="user-details">
                <p><strong>Name:</strong> {userResponse.name}</p>
                <p><strong>Email:</strong> {userResponse.email}</p>
                <p><strong>Phone:</strong> {userResponse.phone}</p>
                <button className="edit-btn" onClick={handleEditClick}>Edit Profile</button>
              </div>
            )}

            {isEditing && userResponse && (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    id="name"
                    name="name"
                    value={editUser.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className={errors.name ? "error" : ""}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone:</label>
                  <input
                    id="phone"
                    name="phone"
                    value={editUser.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className={errors.phone ? "error" : ""}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-actions">
                  <button type="submit" className="update-btn">Save Changes</button>
                  <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </form>
            )}

            <NavLink to="/addressList" className="address-link">Manage Addresses</NavLink>
          </div>

          <div className="order-history-card">
            <h3>Order History</h3>
            {orders.length === 0 ? (
              <p className="no-orders">You haven't placed any orders yet.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => {
                  const discountDetails = calculateDiscountDetails(order);

                  return (
                    <div key={order.orderId} className="order-item-card">
                      <div className="order-header">
                        <p><strong>Order ID:</strong> {order.orderId}</p>
                        <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> NPR {order.totalAmount.toFixed(2)}</p>
                        <p><strong>Status:</strong> <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span></p>
                      </div>

                      {discountDetails && (
                        <div className="order-discount-summary">
                          <p><strong>Original:</strong> NPR {discountDetails.originalAmount.toFixed(2)}</p>
                          <p><strong>Discount ({discountDetails.discountPercentage}%):</strong> NPR {discountDetails.discountAmount.toFixed(2)} ({order.discountCode})</p>
                        </div>
                      )}

                      <div className="order-details">
                        <p><strong>Shipping To:</strong> {order.addressStreet}, {order.addressCity}, {order.addressState}</p>
                        <h4>Items:</h4>
                        <ul className="item-list">
                          {order.orderItems.map((item) => (
                            <li key={item.orderItemId}>
                              {item.bundleName ? `Bundle: ${item.bundleName}` : `Product: ${item.productName}`} ({item.quantity} x NPR {item.price.toFixed(2)}) - Total: NPR {(item.quantity * item.price).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                        <p className="transaction-id"><strong>Transaction ID:</strong> {order.transactionId}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}