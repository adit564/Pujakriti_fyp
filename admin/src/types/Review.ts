export interface Review {
    reviewId: number;
    userId: number;
    productId: number | null;
    bundleId: number | null;
    rating: number;
    reviewDate: string; // LocalDateTime from backend will likely be a string
  }