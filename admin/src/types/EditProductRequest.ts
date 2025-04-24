export interface EditProductRequest {
    name: string;
    description?: string;
    price: number | null;
    stock: number | null;
    categoryId: number | null;
  }
  