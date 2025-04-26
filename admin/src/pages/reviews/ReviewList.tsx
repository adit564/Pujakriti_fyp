// In src/components/admin/ReviewList.tsx
import React, { useState, useEffect } from 'react';
import { fetchReviews, deleteReview } from '../../services/apiAdmin';
import { toast } from 'react-toastify';
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
        // Update the review list after deletion
        setReviews((prevReviews) => prevReviews.filter((review) => review.reviewId !== reviewId));
      } catch (err: any) {
        toast.error(`Failed to delete review ID ${reviewId}: ${err.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Reviews</h1>
      <table>
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
  );
};

export default ReviewList;