import React, { useState } from "react";
import agent from "../../app/api/agent";
import { AddressFormValues } from "../../app/models/address";
import "../../app/styles/profile.css"

interface Props {
  onSuccess: () => void;
  initialValues?: AddressFormValues;
  editMode?: boolean;
  addressId?: number;
}

const defaultForm: AddressFormValues = {
  city: "",
  street: "",
  state: "",
  isDefault: false,
  userId: 0,
};

const AddressForm = ({
  onSuccess,
  initialValues = defaultForm,
  editMode = false,
  addressId,
}: Props) => {
  const [form, setForm] = useState<AddressFormValues>(initialValues);
  const userString = localStorage.getItem("user");
  let currentUser: { user_Id: number | undefined } | null = null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !currentUser.user_Id) {
      console.error("User ID is missing");
      return;
    }

    try {
      const formWithUserId = { ...form, userId: currentUser.user_Id };

      if (editMode && addressId !== undefined) {
        await agent.Address.update(addressId, formWithUserId);
      } else {
        await agent.Address.create(formWithUserId);
      }
      onSuccess();
    } catch (error) {
      console.error("Error submitting form", error);
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
      <div className="address-form-container">
        <div className="address-form-card">
          <h2>Please log in to manage your addresses.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="address-form-container">
      <div className="address-form-card">
        <h3 className="address-form-title">
          {editMode ? "Edit Address" : "Add New Address"}
        </h3>
        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Enter city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="street">Street</label>
            <input
              id="street"
              name="street"
              type="text"
              placeholder="Enter street address"
              value={form.street}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State/Province</label>
            <input
              id="state"
              name="state"
              type="text"
              placeholder="Enter state or province"
              value={form.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              id="isDefault"
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
            />
            <label htmlFor="isDefault">Set as default address</label>
          </div>

          <button type="submit" className="submit-btn">
            {editMode ? "Update Address" : "Add Address"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;