import { Address } from "../../app/models/address";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import AddressForm from "./address";

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
    fetchAddresses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    await agent.Address.delete(id);
    fetchAddresses();
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
      <div className="addressPage">
        <h2>Please log in to manage your addresses.</h2>
      </div>
    );
  }

  return (
    <div className="add_lists">
      <h2>Your Addresses</h2>
      <AddressForm onSuccess={fetchAddresses} />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {addresses.map((address) => (
          <li
            key={address.addressId}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
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
                  userId:address.user
                }}
                onSuccess={() => {
                  setEditingId(null);
                  fetchAddresses();
                }}
              />
            ) : (
              <div>
                <p>
                  {address.street}, {address.city}, {address.state}
                </p>
                {address.isDefault && <strong>Default Address</strong>}
                <br />
                <button onClick={() => setEditingId(address.addressId)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(address.addressId)}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddressList;
