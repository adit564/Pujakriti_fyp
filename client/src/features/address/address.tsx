import React, { useState } from "react";
import agent from "../../app/api/agent";
import { AddressFormValues } from "../../app/models/address";

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
      <div className="addressPage">
        <h2>Please log in to manage your addresses.</h2>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        required
      />
      <input
        name="street"
        placeholder="Street"
        value={form.street}
        onChange={handleChange}
        required
      />
      <input
        name="state"
        placeholder="State"
        value={form.state}
        onChange={handleChange}
        required
      />
      <label>
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
        />
        Set as default
      </label>
      <button type="submit">{editMode ? "Update" : "Add"} Address</button>
    </form>
  );
};

export default AddressForm;
