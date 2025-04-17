export interface Address {
    addressId: number;
    user: number;
    city: string;
    street: string;
    state: string;
    isDefault: boolean;
  }
  
  export interface AddressFormValues {
    city: string;
    street: string;
    state: string;
    isDefault: boolean;
    userId: number; 
  }