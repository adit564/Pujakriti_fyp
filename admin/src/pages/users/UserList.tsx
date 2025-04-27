import React, { useState, useEffect, useMemo } from 'react';
import { fetchUsers, updateUser, fetchUserAddresses } from '../../services/apiAdmin';
import { AdminUser } from '../../types/User';
import { Address } from '../../types/Address';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingAddressesUserId, setViewingAddressesUserId] = useState<number | null>(null);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    setUpdatingUserId(userId);
    setError(null);
    try {
      const updatedUser = await updateUser(userId, { isActive: !isActive });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.userId === userId ? updatedUser : user
        )
      );
      toast.success(`User ${updatedUser.name} ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
      toast.error(`Failed to update user status: ${err.message}`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleViewAddresses = async (userId: number) => {
    setViewingAddressesUserId(userId);
    setUserAddresses([]);
    setAddressesLoading(true);
    setAddressesError(null);
    try {
      const addresses = await fetchUserAddresses(userId);
      setUserAddresses(addresses);
    } catch (err: any) {
      setAddressesError(err.message || 'Failed to fetch user addresses');
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleCloseAddresses = () => {
    setViewingAddressesUserId(null);
    setUserAddresses([]);
    setAddressesError(null);
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.email.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [users, searchTerm]);

  return (
    <div className="user-list">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .user-list {
            font-family: "Poppins", sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
          }
          .user-list h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .search-container {
            margin-bottom: 15px;
          }
          .search-input {
            width: 300px;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            outline: none;
          }
          .search-input::placeholder {
            color: #999;
          }
          .search-input:focus {
            border-color: #4B0082;
            box-shadow: 0 0 4px rgba(75, 0, 130, 0.2);
          }
          @media (max-width: 480px) {
            .search-input {
              width: 100%;
            }
          }
          .table-container {
            overflow-x: auto;
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
          }
          .user-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 800px;
          }
          .user-table th,
          .user-table td {
            padding: 10px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e5e5e5;
          }
          .user-table th {
            background: #f9f9f9;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
          }
          .user-table td {
            color: #666;
          }
          .user-table tr:nth-child(even) {
            background: #fafafa;
          }
          .user-table tr:hover {
            background: #f9f9f9;
          }
          .user-table button {
            padding: 6px 12px;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease, color 0.2s ease;
          }
          .user-table button.toggle {
            background: #4B0082;
            color: #fff;
          }
          .user-table button.toggle:hover:not(:disabled) {
            background: #DAA520;
          }
          .user-table button.toggle:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
          .user-table button.view-addresses {
            background: #fff;
            color: #4B0082;
            border: 1px solid #4B0082;
          }
          .user-table button.view-addresses:hover {
            background: #4B0082;
            color: #fff;
          }
          .addresses-card {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            margin-top: 20px;
          }
          .addresses-card h2 {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .addresses-card .close-button {
            padding: 6px 12px;
            font-size: 14px;
            background: #B22222;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
            float: right;
          }
          .addresses-card .close-button:hover {
            background: #8B0000;
          }
          .addresses-card .loading,
          .addresses-card .error,
          .addresses-card .no-addresses {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
          }
          .addresses-card .error {
            color: #B22222;
          }
          .addresses-card ul {
            list-style: none;
            margin-top: 10px;
          }
          .addresses-card li {
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
          }
          .addresses-card li strong {
            color: #DAA520;
          }
          .loading,
          .error {
            font-size: 16px;
            text-align: center;
            padding: 20px;
            color: #666;
          }
          .error {
            color: #B22222;
          }
        `}
      </style>
      <h1>User Management</h1>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
                <th>Email Verified</th>
                <th>Actions</th>
                <th>Addresses</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isActive ? 'Yes' : 'No'}</td>
                  <td>{user.isEmailVerified ? 'Yes' : 'No'}</td>
                  <td>
                    <button
                      className="toggle"
                      onClick={() => handleToggleActive(user.userId, user.isActive)}
                      disabled={updatingUserId === user.userId}
                    >
                      {updatingUserId === user.userId ? 'Updating...' : (user.isActive ? 'Deactivate' : 'Activate')}
                    </button>
                  </td>
                  <td>
                    <button
                      className="view-addresses"
                      onClick={() => handleViewAddresses(user.userId)}
                    >
                      View Addresses
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {viewingAddressesUserId !== null && (
        <div className="addresses-card">
          <button className="close-button" onClick={handleCloseAddresses}>
            Close Addresses
          </button>
          <h2>Addresses for User ID: {viewingAddressesUserId}</h2>
          {addressesLoading ? (
            <p className="loading">Loading addresses...</p>
          ) : addressesError ? (
            <p className="error">Error loading addresses: {addressesError}</p>
          ) : userAddresses.length > 0 ? (
            <ul>
              {userAddresses.map(address => (
                <li key={address.addressId}>
                  {address.street}, {address.city}, {address.state}
                  {address.isDefault && <strong> (Default)</strong>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-addresses">No addresses found for this user.</p>
          )}
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UserList;