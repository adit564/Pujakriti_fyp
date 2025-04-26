// In src/components/admin/CasteList.tsx
import React, { useState, useEffect } from 'react';
import { fetchCastes, deleteCaste } from '../../services/apiAdmin';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Caste } from '../../types/Caste';

const CasteList: React.FC = () => {
  const [castes, setCastes] = useState<Caste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCastes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCastes();
        setCastes(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch castes');
        toast.error(err.message || 'Failed to fetch castes');
      } finally {
        setLoading(false);
      }
    };

    loadCastes();
  }, []);

  const handleDeleteCaste = async (casteId: number) => {
    if (window.confirm('Are you sure you want to delete this caste?')) {
      try {
        await deleteCaste(casteId);
        toast.success(`Caste ID ${casteId} deleted successfully`);
        setCastes((prevCastes) => prevCastes.filter((caste) => caste.casteId !== casteId));
      } catch (err: any) {
        toast.error(`Failed to delete caste ID ${casteId}: ${err.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading castes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Castes</h1>
      <Link to="/admin/castes/add">Add New Caste</Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {castes.map((caste) => (
            <tr key={caste.casteId}>
              <td>{caste.casteId}</td>
              <td>{caste.name}</td>
              <td>
                <Link to={`/admin/castes/edit/${caste.casteId}`}>Edit</Link>
                <button onClick={() => handleDeleteCaste(caste.casteId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CasteList;