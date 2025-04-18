import { Address } from "../../app/models/address";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import AddressForm from "./address";
import "../../app/styles/profile.css";

const AddressList = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const userString = localStorage.getItem("user");
  let currentUser: { user_Id: number | undefined } | null = null;

  const fetchAddresses = async () => {
    try {
      if (currentUser?.user_Id !== undefined) {
        const data = await agent.Address.getAll(currentUser.user_Id);
        setAddresses(data);
      } else {
        console.error("User ID is undefined");
      }
    } catch (error) {
      console.error("Failed to load addresses", error);
    }
  };

  useEffect(() => {
    if (userString) {
      try {
        currentUser = JSON.parse(userString);
        fetchAddresses();
      } catch (error) {
        console.error("Error parsing user data from local storage:", error);
      }
    }
  }, [userString]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await agent.Address.delete(id);
      fetchAddresses();
    } catch (error) {
      console.error("Failed to delete address", error);
    }
  };

  if (userString) {
    try {
      currentUser = JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing user data from local storage:", error);
    }
  }

  if (!currentUser) {
    return (
      <div className="address-container">
        <div className="address-card">
          <h2>Please log in to manage your addresses.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="address-container">
      <div className="address-card">
        <h2 className="address-title">Your Addresses</h2>
        
        <AddressForm onSuccess={fetchAddresses} />
        
        <div className="address-list">
          {addresses.length === 0 ? (
            <p className="no-addresses">You don't have any saved addresses yet.</p>
          ) : (
            addresses.map((address) => (
              <div
                key={address.addressId}
                className={`address-item ${address.isDefault ? "default-address" : ""}`}
              >
                {editingId === address.addressId ? (
                  <AddressForm
                    editMode
                    addressId={address.addressId}
                    initialValues={{
                      city: address.city,
                      street: address.street,
                      state: address.state,
                      isDefault: address.isDefault,
                      userId: address.user
                    }}
                    onSuccess={() => {
                      setEditingId(null);
                      fetchAddresses();
                    }}
                  />
                ) : (
                  <div className="address-content">
                    <div className="address-details">
                      <p className="address-text">
                        {address.street}, {address.city}, {address.state}
                      </p>
                      {address.isDefault && (
                        <span className="default-badge">Default Address</span>
                      )}
                    </div>
                    <div className="address-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingId(address.addressId)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(address.addressId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressList;