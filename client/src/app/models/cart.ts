export interface Cart {
    cartId: string
    userId: number
    cartItems: CartItem[]
}
  
export interface CartItem {
    cartItemId: number
    productId: number
    bundleId: number
    price: number
    quantity: number
}
  

export interface CartTotal{
    total: number
    discount: number
    grandTotal: number
}