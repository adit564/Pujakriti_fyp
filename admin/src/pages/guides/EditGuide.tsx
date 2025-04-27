import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGuideById, updateGuide } from '../../services/apiAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Guide } from '../../types/Guide';

const EditGuide: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGuideDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (guideId) {
          const id = parseInt(guideId, 10);
          const data = await fetchGuideById(id);
          setGuide(data);
          setName(data.name);
          setDescription(data.description);
          setContent(data.content);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Guide details');
        toast.error(err.message || 'Failed to fetch Guide details');
      } finally {
        setLoading(false);
      }
    };

    loadGuideDetails();
  }, [guideId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideId) return;
    setLoading(true);
    setError(null);
    try {
      const id = parseInt(guideId, 10);
      const updatedGuide = { name, description, content };
      await updateGuide(id, updatedGuide);
      toast.success('Guide updated successfully!');
      navigate('/admin/guides');
    } catch (err: any) {
      setError(err.message || 'Failed to update Guide');
      toast.error(err.message || 'Failed to update Guide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-guide">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .edit-guide {
            font-family: 'Arial', sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
                        display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
          }
          .edit-guide h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .form-container {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            padding: 20px;
               width: 30vw;
            margin-bottom: 20px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          .form-group label {
            display: block;
            font-size: 14px;
            color: #333;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .form-group input,
          .form-group textarea {
            width: 100%;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            outline: none;
          }
          .form-group input:focus,
          .form-group textarea:focus {
            border-color: #4B0082;
            box-shadow: 0 0 4px rgba(75, 0, 130, 0.2);
          }
          .form-group textarea {
            min-height: 100px;
            resize: vertical;
          }
          .form-group textarea.content {
            min-height: 200px;
          }
          .form-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .submit-button,
          .back-button {
            padding: 8px 16px;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .submit-button {
            background: #4B0082;
            color: #fff;
          }
          .submit-button:hover:not(:disabled) {
            background: #DAA520;
          }
          .submit-button:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
          .back-button {
            background: #fff;
            color: #4B0082;
            border: 1px solid #4B0082;
          }
          .back-button:hover {
            background: #4B0082;
            color: #fff;
          }
          .loading,
          .error,
          .not-found {
            font-size: 16px;
            text-align: center;
            padding: 20px;
            color: #666;
          }
          .error,
          .not-found {
            color: #B22222;
          }
        `}
      </style>
      <h1>Edit Guide</h1>
      {loading ? (
        <div className="loading">Loading Guide details...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : !guide ? (
        <div className="not-found">Guide not found.</div>
      ) : (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                className="content"
                value={content}
                onChange={handleContentChange}
                rows={10}
              />
            </div>
            <div className="form-buttons">
              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Guide'}
              </button>
              <button
                className="back-button"
                type="button"
                onClick={() => navigate('/admin/guides')}
              >
                Back to List
              </button>
            </div>
          </form>
        </div>
      )}
      <ToastContainer
        position="top-right"
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

export default EditGuide;