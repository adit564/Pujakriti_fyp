export interface DiscountCode{
    discountId: number;
    code: string;
    discountRate: number;
    isActive: boolean;
    expiryDate: string;   
}