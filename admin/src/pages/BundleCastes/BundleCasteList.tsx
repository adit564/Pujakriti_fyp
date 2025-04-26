// In src/components/admin/BundleCasteList.tsx
import React, { useState, useEffect } from 'react';
import { fetchBundleCastes, deleteBundleCaste } from '../../services/apiAdmin';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BundleCaste } from '../../types/BundleCaste';

const BundleCasteList: React.FC = () => {
  const [bundleCastes, setBundleCastes] = useState<BundleCaste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBundleCastes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBundleCastes();
        setBundleCastes(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch bundle castes');
        toast.error(err.message || 'Failed to fetch bundle castes');
      } finally {
        setLoading(false);
      }
    };

    loadBundleCastes();
  }, []);

  const handleDeleteBundleCaste = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this bundle-caste association?')) {
      try {
        await deleteBundleCaste(id);
        toast.success(`Bundle-caste ID ${id} deleted successfully`);
        setBundleCastes((prevBundleCastes) => prevBundleCastes.filter((bc) => bc.id !== id));
      } catch (err: any) {
        toast.error(`Failed to delete bundle-caste ID ${id}: ${err.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading bundle-caste associations...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Bundle Castes</h1>
      <Link to="/admin/bundle-castes/add">Add New Bundle Caste</Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Bundle ID</th>
            <th>Caste ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bundleCastes.map((bc) => (
            <tr key={bc.id}>
              <td>{bc.id}</td>
              <td>{bc.bundleId}</td>
              <td>{bc.casteId}</td>
              <td>
                <Link to={`/admin/bundle-castes/edit/${bc.id}`}>Edit</Link>
                <button onClick={() => handleDeleteBundleCaste(bc.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BundleCasteList;