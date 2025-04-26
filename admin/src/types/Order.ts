export interface AdminOrderItem {
    orderItemId: number;
    productName: string | null;
    bundleName: string | null;
    quantity: number;
    price: number;
  }
  
  export interface AdminOrder {
    orderId: number;
    userId: number;
    userName: string;
    totalAmount: number;
    address: string;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    discountCode: string | null;
    discountRate: number | null;
    orderDate: string;
    orderItems: AdminOrderItem[];
    paymentID: number | null;
  }
  
  export interface Order {
    orderId: number;
    userId: number;
    totalAmount: number;
    address: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    discountCodeId: number | null;
    orderDate: string;
    orderItems: any[];
    paymentID: number | null;
  }