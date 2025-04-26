// In src/components/admin/PujaList.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPujas } from '../../services/apiAdmin';
import { toast } from 'react-toastify';
import { Puja } from '../../types/Puja';

const PujaList: React.FC = () => {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPujas = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPujas();
        setPujas(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Pujas');
        toast.error(err.message || 'Failed to fetch Pujas');
      } finally {
        setLoading(false);
      }
    };

    loadPujas();
  }, []);

  const handleEditPuja = (pujaId: number) => {
    navigate(`/admin/pujas/edit/${pujaId}`);
  };

  if (loading) {
    return <div>Loading Pujas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Puja List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pujas.map((puja) => (
            <tr key={puja.pujaId}>
              <td>{puja.pujaId}</td>
              <td>{puja.name}</td>
              <td>{puja.description}</td>
              <td>
                <button onClick={() => handleEditPuja(puja.pujaId)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PujaList;