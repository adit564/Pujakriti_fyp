// In src/components/admin/GuideList.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchGuides } from '../../services/apiAdmin';
import { toast } from 'react-toastify';
import { Guide } from '../../types/Guide';

const GuideList: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGuides = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGuides();
        setGuides(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Guides');
        toast.error(err.message || 'Failed to fetch Guides');
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  const handleEditGuide = (guideId: number) => {
    navigate(`/admin/guides/edit/${guideId}`);
  };

  if (loading) {
    return <div>Loading Guides...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Guide List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guides.map((guide) => (
            <tr key={guide.guideId}>
              <td>{guide.guideId}</td>
              <td>{guide.name}</td>
              <td>{guide.description}</td>
              <td>{guide.content}</td>
              <td>
                <button onClick={() => handleEditGuide(guide.guideId)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuideList;