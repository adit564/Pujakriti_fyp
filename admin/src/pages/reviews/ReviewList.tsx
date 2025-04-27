import React, { useState, useEffect } from 'react';
import { fetchReviews, deleteReview } from '../../services/apiAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Review } from '../../types/Review';

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchReviews();
        setReviews(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch reviews');
        toast.error(err.message || 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        toast.success(`Review ID ${reviewId} deleted successfully`);
        setReviews((prevReviews) => prevReviews.filter((review) => review.reviewId !== reviewId));
      } catch (err: any) {
        toast.error(`Failed to delete review ID ${reviewId}: ${err.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="review-list">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .review-list {
            font-family: "Poppins", sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
                 max-width: 80vw;
            margin: 0 auto;
          }
          .review-list h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .table-container {
            overflow-x: auto;
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
          }
          .review-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 800px;
          }
          .review-table th,
          .review-table td {
            padding: 10px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e5e5e5;
          }
          .review-table th {
            background: #f9f9f9;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
          }
          .review-table td {
            color: #666;
          }
          .review-table tr:nth-child(even) {
            background: #fafafa;
          }
          .review-table tr:hover {
            background: #f9f9f9;
          }
          .review-table button {
            padding: 6px 12px;
            font-size: 14px;
            background: #B22222;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .review-table button:hover {
            background: #8B0000;
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
      <h1>Reviews</h1>
      {loading ? (
        <div className="loading">Loading reviews...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <div className="table-container">
          <table className="review-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Product ID</th>
                <th>Bundle ID</th>
                <th>Rating</th>
                <th>Review Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.reviewId}>
                  <td>{review.reviewId}</td>
                  <td>{review.userId}</td>
                  <td>{review.productId || '-'}</td>
                  <td>{review.bundleId || '-'}</td>
                  <td>{review.rating}</td>
                  <td>{new Date(review.reviewDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDeleteReview(review.reviewId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default ReviewList;