// import { AdminOrder } from "../types/Order";
// import { Payment } from "../types/Payment";
// import { Review } from "../types/Review";

// const API_BASE_URL = "http://localhost:8081/api/admin/dashboard"; 


// // Admin Dashboard API functions

// export const fetchTotalUsers = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/users/count`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch total users: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching total users:", error);
//     throw error;
//   }
// };

// export const fetchTotalOrders = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/orders/total-count`); // Assuming you renamed this endpoint
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch total orders: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching total orders:", error);
//     throw error;
//   }
// };

// export const fetchNewOrdersCount = async (period?: string): Promise<number> => {
//   try {
//     const url = period
//       ? `${API_BASE_URL}/orders/new-count?period=${period}`
//       : `${API_BASE_URL}/orders/new-count`;
//     const response = await fetch(url);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch new orders count: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching new orders count:", error);
//     throw error;
//   }
// };

// export const fetchPendingOrdersCount = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/orders/pending-count`); // Assuming you renamed this endpoint
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch pending orders count: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching pending orders count:", error);
//     throw error;
//   }
// };

// export const fetchTotalPaymentsReceived = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/payments/total-received`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch total payments: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching total payments:", error);
//     throw error;
//   }
// };

// export const fetchNewPaymentsTotal = async (period?: string): Promise<number> => {
//   try {
//     const url = period
//       ? `${API_BASE_URL}/payments/new-total?period=${period}`
//       : `${API_BASE_URL}/payments/new-total`;
//     const response = await fetch(url);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch new payments total: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching new payments total:", error);
//     throw error;
//   }
// };

// export const fetchTotalDiscountCodes = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/discount-codes/total-count`); // Assuming you renamed this
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch total discount codes: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching total discount codes:", error);
//     throw error;
//   }
// };

// export const fetchActiveDiscountCodesCount = async (
//   active: boolean = true // Default to true to fetch active codes
// ): Promise<number> => {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/discount-codes/active-count?active=${active}`
//     );
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message ||
//           `Failed to fetch active discount codes count: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching active discount codes count:", error);
//     throw error;
//   }
// };

// export const fetchTotalReviews = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/reviews/count`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch total reviews: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching total reviews:", error);
//     throw error;
//   }
// };

// export const fetchRecentReviews = async (limit: number = 5): Promise<Review[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/reviews/recent?limit=${limit}`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch recent reviews: ${response.status}`
//       );
//     }
//     const data: Review[] = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching recent reviews:", error);
//     throw error;
//   }
// };

// export const fetchTotalProducts = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/products/count`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch total products: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching total products:", error);
//     throw error;
//   }
// };

// export const fetchTotalBundles = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/bundles/count`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch total bundles: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching total bundles:", error);
//     throw error;
//   }
// };

// export const fetchTotalPujas = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/pujas/count`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch total pujas: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching total pujas:", error);
//     throw error;
//   }
// };

// export const fetchTotalCastes = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/castes/count`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch total castes: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching total castes:", error);
//     throw error;
//   }
// };

// export const fetchTotalBundleCasteAssociations = async (): Promise<number> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/bundle-castes/count`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message ||
//           `Failed to fetch total bundle caste associations: ${response.status}`
//       );
//     }
//     const data: number = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching total bundle caste associations:", error);
//     throw error;
//   }
// };

// export const fetchOrderTrends = async (
//   period: string
// ): Promise<Record<string, any>[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/orders/trends?period=${period}`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch order trends: ${response.status}`
//       );
//     }
//     const data: Record<string, any>[] = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching order trends:", error);
//     throw error;
//   }
// };

// export const fetchPaymentTrends = async (
//   period: string
// ): Promise<Record<string, any>[]> => {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/payments/trends?period=${period}`
//     );
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch payment trends: ${response.status}`
//       );
//     }
//     const data: Record<string, any>[] = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching payment trends:", error);
//     throw error;
//   }
// };

// export const fetchOrderStatusDistribution = async (): Promise<
//   Record<string, any>[]
// > => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/orders/status-distribution`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message ||
//           `Failed to fetch order status distribution: ${response.status}`
//       );
//     }
//     const data: Record<string, any>[] = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching order status distribution:", error);
//     throw error;
//   }
// };

// export const fetchRevenueByPeriod = async (
//   period: string
// ): Promise<Record<string, any>[]> => {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/revenue/by-period?period=${period}`
//     );
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch revenue by period: ${response.status}`
//       );
//     }
//     const data: Record<string, any>[] = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching revenue by period:", error);
//     throw error;
//   }
// };

// export const fetchUserGrowth = async (
//   period: string
// ): Promise<Record<string, any>[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/users/growth?period=${period}`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch user growth: ${response.status}`
//       );
//     }
//     const data: Record<string, any>[] = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching user growth:", error);
//     throw error;
//   }
// };

// export const fetchTopCustomers = async (
//   limit: number = 5
// ): Promise<Record<string, any>[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/users/top?limit=${limit}`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch top customers: ${response.status}`
//       );
//     }
//     const data: Record<string, any>[] = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching top customers:", error);
//     throw error;
//   }
// };

// export const fetchRecentOrders = async (
//   limit: number = 5
// ): Promise<AdminOrder[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/orders/recent?limit=${limit}`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch recent orders: ${response.status}`
//       );
//     }
//     const data: AdminOrder[] = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching recent orders:", error);
//     throw error;
//   }
// };

// export const fetchRecentPayments = async (
//   limit: number = 5
// ): Promise<Payment[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/payments/recent?limit=${limit}`);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData?.message || `Failed to fetch recent payments: ${response.status}`
//       );
//     }
//     const data: Payment[] = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching recent payments:", error);
//     throw error;
//   }
// };


