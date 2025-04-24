import React, { useState, useEffect, useMemo } from 'react';
import { fetchUsers, updateUser } from '../../services/apiAdmin';
import { fetchUserAddresses } from '../../services/apiAdmin'; // Import the new function
import { AdminUser } from '../../types/User';
import { Address } from '../../types/Address'; // Import the Address interface
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

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Management</h1>
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Email Verified</th>
            <th>Actions</th>
            <th>Addresses</th> {/* New column for the button */}
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
                  onClick={() => handleToggleActive(user.userId, user.isActive)}
                  disabled={updatingUserId === user.userId}
                >
                  {updatingUserId === user.userId ? 'Updating...' : (user.isActive ? 'Deactivate' : 'Activate')}
                </button>
              </td>
              <td>
                <button onClick={() => handleViewAddresses(user.userId)}>
                  View Addresses
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewingAddressesUserId !== null && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h2>Addresses for User ID: {viewingAddressesUserId}</h2>
          <button onClick={handleCloseAddresses}>Close Addresses</button>
          {addressesLoading ? (
            <p>Loading addresses...</p>
          ) : addressesError ? (
            <p style={{ color: 'red' }}>Error loading addresses: {addressesError}</p>
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
            <p>No addresses found for this user.</p>
          )}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </div>
  );
};

export default UserList;