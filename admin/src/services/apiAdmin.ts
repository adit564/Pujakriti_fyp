import axios from "axios";
import { Address } from "../types/Address";
import { Category } from "../types/Category";
import { Product, ProductDetail } from "../types/Product";
import { ProductImage } from "../types/ProductImage";
import { AdminUser } from "../types/User";
import { EditProductRequest } from "../types/EditProductRequest";
import { AddBundleRequest, Bundle, BundleDetails } from "../types/Bundle";
import { BundleImage } from "../types/BundleImage";
import { Puja } from "../types/Puja";
import { Guide } from "../types/Guide";
import { BundleCaste } from "../types/BundleCaste";

const API_BASE_URL = 'http://localhost:8081/api'; 


export const fetchUsers = async (): Promise<AdminUser[]> => {
  try {
    const response = await fetch(`/api/users/admin`); // Call the /api/users/admin endpoint
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to fetch users: ${response.status}`);
    }
    const data: AdminUser[] = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUser = async (userId: number, data: { isActive: boolean }): Promise<AdminUser> => {
    try {
      const response = await fetch(`/api/users/admin/${userId}/active`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to update user: ${response.status}`);
      }
      const updatedUser: AdminUser = await response.json();
      return updatedUser;
    } catch (error: any) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
};

export const fetchUserAddresses = async (userId: number): Promise<Address[]> => {
    try {
      const response = await fetch(`/api/addresses/user/${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to fetch addresses for user ${userId}: ${response.status}`);
      }
      const data: Address[] = await response.json();
      return data;
    } catch (error: any) {
      console.error(`Error fetching addresses for user ${userId}:`, error);
      throw error;
    }
  };


  export const fetchProducts = async (page: number = 0, size: number = 10, keyword?: string, category?: number, sort?: string, order?: 'asc' | 'desc'): Promise<{ content: Product[]; totalPages: number }> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('size', String(size));
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', String(category));
    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);
  
    try {
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      return { content: data.content, totalPages: data.totalPages }; // Assuming Spring Data Page returns 'content' and 'totalPages'
    } catch (error: any) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };
  
  export const fetchProductDetails = async (productId: number): Promise<ProductDetail | null> => {
    try {
      const response = await fetch(`http://localhost:8081/api/products/${productId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch product details for ID ${productId}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };
  

  export const fetchCategories = async (): Promise<Category[]> => {
    try {
      const response = await fetch(`/api/products/categories`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to fetch categories: ${response.status}`);
      }
      const data: Category[] = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };
  
  export const fetchProductImage = async (productId: number): Promise<ProductImage | null> => {
    try {
      const response = await fetch(`http://localhost:8081/api/images/product/${productId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No image found for this product
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch image for product ${productId}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching product image:', error);
      return null; // Or throw the error if you want the component to handle it differently
    }
  };


  export const createProduct = async (productData: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: number | null;
  }): Promise<any> => {
    try {
      const response = await fetch(`http://localhost:8081/api/products/admin/Add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ // Send data matching CreateProductRequest DTO
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          categoryId: productData.categoryId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to add product: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error adding product:', error);
      throw error;
    }
  };
  
  export const addProductImage = async (productId: number, image: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('image', image);
  
      const response = await fetch(`http://localhost:8081/api/images/product/upload/${productId}`, { 
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to upload image for product ${productId}`);
      }
  
      return await response.json();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  export const updateProductImage = async (productId: number, imageFile: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
  
      const response = await fetch(`${API_BASE_URL}/images/product/update/${productId}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update image for product ID ${productId}`);
      }
  
      return await response.json(); // Expect a JSON response with a message
    } catch (error: any) {
      console.error('Error updating product image:', error);
      throw error;
    }
  };

  export const updateProduct = async (productId: number, productData: Omit<Product, 'productId' | 'category'> & { categoryId: number | null }): Promise<Product> => {
    try {
      const requestData: EditProductRequest = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        categoryId: productData.categoryId,
      };
      const response = await fetch(`http://localhost:8081/api/products/admin/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update product with ID ${productId}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw error;
    }
  };
  
  export const deleteProduct = async (productId: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8081/api/products/admin/delete/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete product with ID ${productId}`);
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };


  export const fetchBundles = async (page: number = 0, size: number = 10, keyword?: string, puja?: number, guide?: number, sort?: string, order?: 'asc' | 'desc'): Promise<{ content: Bundle[]; totalPages: number }> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('size', String(size));
    if (keyword) params.append('keyword', keyword);
    if (puja) params.append('puja', String(puja));
    if (guide) params.append('guide', String(guide));
    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);
  
    try {
      const response = await fetch(`/api/bundles?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to fetch bundles: ${response.status}`);
      }
      const data = await response.json();
      return { content: data.content, totalPages: data.totalPages }; 
    } catch (error: any) {
      console.error('Error fetching bundles:', error);
      throw error;
    }
  };

  export const fetchBundleById = async (bundleId: number): Promise<BundleDetails> => {
    try {
      const response = await fetch(`/api/bundles/${bundleId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to fetch bundle: ${response.status}`);
      }
      const data: BundleDetails = await response.json();
      return data;
    } catch (error: any) {
      console.error(`Error fetching bundle ${bundleId}:`, error);
      throw error;
    }
  };


  export const updateBundleDetails = async (
    bundleId: number,
    updatedBundle: {
      name: string;
      description?: string;
      price?: number | null;
      stock?: number | null;
      pujaId?: number | null;
      guideId?: number | null;
    }
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/bundles/admin/update/${bundleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBundle),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to update bundle details: ${response.status}`);
      }
    } catch (error: any) {
      console.error(`Error updating bundle ${bundleId}:`, error);
      throw error;
    }
  };
  
  export const updateBundleImage = async (
    bundleId: number,
    imageFile: File
  ): Promise<void> => {
    const formData = new FormData();
    formData.append('image', imageFile);
  
    try {
      const response = await fetch(`/api/images/bundle/update/${bundleId}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to update bundle image: ${response.status}`);
      }
    } catch (error: any) {
      console.error(`Error updating bundle image for ${bundleId}:`, error);
      throw error;
    }
  };


  export const fetchPujas = async (): Promise<Puja[]> => {
    try {
      const response = await fetch(`/api/bundles/pujas`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to fetch Pujas: ${response.status}`);
      }
      const data: Puja[] = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching Pujas:', error);
      throw error;
    }
  };
  
  export const fetchGuides = async (): Promise<Guide[]> => {
    try {
      const response = await fetch(`/api/bundles/guides`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to fetch Guides: ${response.status}`);
      }
      const data: Guide[] = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching Guides:', error);
      throw error;
    }
  };

  export const fetchBundleCastes= async (): Promise<BundleCaste[]> => {
    try {
      const response = await fetch(`/api/bundles/bundleCastes`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Failed to fetch BundleCastes: ${response.status}`);
      }
      const data: BundleCaste[] = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching BundleCastes:', error);
      throw error;
    }
  };

  export const fetchBundleImage = async (bundleId: number): Promise<BundleImage | null> => {
    try {
      const response = await fetch(`http://localhost:8081/api/images/bundle/${bundleId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No image found for this product
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch image for bundle ${bundleId}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching bundle image:', error);
      return null; // Or throw the error if you want the component to handle it differently
    }
  };

  export const addBundle = async (bundleData: AddBundleRequest): Promise<Bundle> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bundles/admin/Add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bundleData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add new bundle.');
      }
  
      return await response.json();
    } catch (error: any) {
      console.error('Error adding bundle:', error);
      throw error;
    }
  };


  export const uploadBundleImage = async (bundleId: number, imageFile: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
  
      const response = await fetch(`${API_BASE_URL}/images/bundle/upload/${bundleId}`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload bundle image.');
      }
      // No need to return data for a successful upload (void)
    } catch (error: any) {
      console.error(`Error uploading bundle image for bundle ID ${bundleId}:`, error);
      throw error;
    }
  };


  export const deleteBundle = async (bundleId: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8081/api/bundles/admin/delete/${bundleId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete bundle with ID ${bundleId}`);
      }
    } catch (error: any) {
      console.error('Error deleting bundle:', error);
      throw error;
    }
  };