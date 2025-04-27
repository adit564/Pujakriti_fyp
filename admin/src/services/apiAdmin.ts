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
import { AdminOrder, Order } from "../types/Order";
import { Payment } from "../types/Payment";
import { DiscountCode } from "../types/Discount";
import { Review } from "../types/Review";
import { Caste } from "../types/Caste";

const API_BASE_URL = "http://localhost:8081/api";

export const fetchUsers = async (): Promise<AdminUser[]> => {
  try {
    const response = await fetch(`/api/users/admin`); // Call the /api/users/admin endpoint
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || `Failed to fetch users: ${response.status}`
      );
    }
    const data: AdminUser[] = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: number,
  data: { isActive: boolean }
): Promise<AdminUser> => {
  try {
    const response = await fetch(`/api/users/admin/${userId}/active`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || `Failed to update user: ${response.status}`
      );
    }
    const updatedUser: AdminUser = await response.json();
    return updatedUser;
  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

export const fetchUserAddresses = async (
  userId: number
): Promise<Address[]> => {
  try {
    const response = await fetch(`/api/addresses/user/${userId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message ||
          `Failed to fetch addresses for user ${userId}: ${response.status}`
      );
    }
    const data: Address[] = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error fetching addresses for user ${userId}:`, error);
    throw error;
  }
};

export const fetchProducts = async (
  page: number = 0,
  size: number = 10,
  keyword?: string,
  category?: number,
  sort?: string,
  order?: "asc" | "desc"
): Promise<{ content: Product[]; totalPages: number }> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("size", String(size));
  if (keyword) params.append("keyword", keyword);
  if (category) params.append("category", String(category));
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);

  try {
    const response = await fetch(`/api/products?${params.toString()}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || `Failed to fetch products: ${response.status}`
      );
    }
    const data = await response.json();
    return { content: data.content, totalPages: data.totalPages }; // Assuming Spring Data Page returns 'content' and 'totalPages'
  } catch (error: any) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductDetails = async (
  productId: number
): Promise<ProductDetail | null> => {
  try {
    const response = await fetch(
      `http://localhost:8081/api/products/${productId}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to fetch product details for ID ${productId}`
      );
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return null;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`/api/products/categories`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || `Failed to fetch categories: ${response.status}`
      );
    }
    const data: Category[] = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchCategoryById = async (categoryId: number): Promise<Category> => {
  try {
    const response = await fetch(`http://localhost:8081/api/products/category/${categoryId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to fetch category: ${response.status}`);
    }
    const data: Category = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error fetching category ${categoryId}:`, error);
    throw error;
  }
};

export const addCategory = async (newCategory: { name: string; description: string }): Promise<Category> => {
  try {
    const response = await fetch('http://localhost:8081/api/products/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCategory),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to add category: ${response.status}`);
    }
    const data: Category = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (
  categoryId: number,
  updatedCategory: { name: string; description: string }
): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:8081/api/products/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCategory),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to update category: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error updating category ${categoryId}:`, error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:8081/api/products/categories/${categoryId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to delete category: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error deleting category ${categoryId}:`, error);
    throw error;
  }
};


export const fetchProductImage = async (
  productId: number
): Promise<ProductImage | null> => {
  try {
    const response = await fetch(
      `http://localhost:8081/api/images/product/${productId}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No image found for this product
      }
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to fetch image for product ${productId}`
      );
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching product image:", error);
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
    const response = await fetch(
      `http://localhost:8081/api/products/admin/Add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Send data matching CreateProductRequest DTO
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          categoryId: productData.categoryId,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || `Failed to add product: ${response.status}`
      );
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const addProductImage = async (
  productId: number,
  image: File
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(
      `http://localhost:8081/api/images/product/upload/${productId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to upload image for product ${productId}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const updateProductImage = async (
  productId: number,
  imageFile: File
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `${API_BASE_URL}/images/product/update/${productId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to update image for product ID ${productId}`
      );
    }

    return await response.json(); // Expect a JSON response with a message
  } catch (error: any) {
    console.error("Error updating product image:", error);
    throw error;
  }
};

export const updateProduct = async (
  productId: number,
  productData: Omit<Product, "productId" | "category"> & {
    categoryId: number | null;
  }
): Promise<Product> => {
  try {
    const requestData: EditProductRequest = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      categoryId: productData.categoryId,
    };
    const response = await fetch(
      `http://localhost:8081/api/products/admin/update/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to update product with ID ${productId}`
      );
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    const response = await fetch(
      `http://localhost:8081/api/products/admin/delete/${productId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to delete product with ID ${productId}`
      );
    }
  } catch (error: any) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const fetchBundles = async (
  page: number = 0,
  size: number = 10,
  keyword?: string,
  puja?: number,
  guide?: number,
  sort?: string,
  order?: "asc" | "desc"
): Promise<{ content: Bundle[]; totalPages: number }> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("size", String(size));
  if (keyword) params.append("keyword", keyword);
  if (puja) params.append("puja", String(puja));
  if (guide) params.append("guide", String(guide));
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);

  try {
    const response = await fetch(`/api/bundles?${params.toString()}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || `Failed to fetch bundles: ${response.status}`
      );
    }
    const data = await response.json();
    return { content: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Error fetching bundles:", error);
    throw error;
  }
};

export const fetchBundleById = async (
  bundleId: number
): Promise<BundleDetails> => {
  try {
    const response = await fetch(`/api/bundles/${bundleId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || `Failed to fetch bundle: ${response.status}`
      );
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
    const response = await fetch(`http://localhost:8081/api/bundles/admin/update/${bundleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBundle),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message ||
          `Failed to update bundle details: ${response.status}`
      );
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
  formData.append("image", imageFile);

  try {
    const response = await fetch(`/api/images/bundle/update/${bundleId}`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message ||
          `Failed to update bundle image: ${response.status}`
      );
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
      throw new Error(
        errorData?.message || `Failed to fetch Pujas: ${response.status}`
      );
    }
    const data: Puja[] = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching Pujas:", error);
    throw error;
  }
};

export const fetchPujaById = async (pujaId: number): Promise<Puja> => {
  try {
    const response = await fetch(`/api/bundles/pujas/${pujaId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to fetch Puja: ${response.status}`);
    }
    const data: Puja = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error fetching Puja ${pujaId}:`, error);
    throw error;
  }
};

export const updatePuja = async (
  pujaId: number,
  updatedPuja: { name: string; description: string }
): Promise<void> => {
  try {
    const response = await fetch(`/api/bundles/pujas/${pujaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPuja),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to update Puja: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error updating Puja ${pujaId}:`, error);
    throw error;
  }
};

export const fetchGuideById = async (guideId :number): Promise<Guide> =>{
  try {
    const response = await fetch(`http://localhost:8081/api/bundles/guides/${guideId}`);
    if(!response.ok){
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to fetch Guide: ${response.status}`);
    }
    const data: Guide = await response.json();
    return data;
  } catch (error:any) {
    console.error(`Error fetching Guide ${guideId}:`, error);
    throw error;
  }
}

export const updateGuide = async (
  guideId: number,
  updatedGuide: { name: string; description: string, content:string }
): Promise<void> => {
  try {
    const response = await fetch(`/api/bundles/guides/${guideId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedGuide),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to update Guide: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error updating Guide ${guideId}:`, error);
    throw error;
  }
};


export const fetchGuides = async (): Promise<Guide[]> => {
  try {
    const response = await fetch(`/api/bundles/guides`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || `Failed to fetch Guides: ${response.status}`
      );
    }
    const data: Guide[] = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching Guides:", error);
    throw error;
  }
};


export const fetchBundleImage = async (
  bundleId: number
): Promise<BundleImage | null> => {
  try {
    const response = await fetch(
      `http://localhost:8081/api/images/bundle/${bundleId}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No image found for this product
      }
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to fetch image for bundle ${bundleId}`
      );
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching bundle image:", error);
    return null; // Or throw the error if you want the component to handle it differently
  }
};

export const addBundle = async (
  bundleData: AddBundleRequest
): Promise<Bundle> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bundles/admin/Add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bundleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add new bundle.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error adding bundle:", error);
    throw error;
  }
};

export const uploadBundleImage = async (
  bundleId: number,
  imageFile: File
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `${API_BASE_URL}/images/bundle/upload/${bundleId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload bundle image.");
    }
    // No need to return data for a successful upload (void)
  } catch (error: any) {
    console.error(
      `Error uploading bundle image for bundle ID ${bundleId}:`,
      error
    );
    throw error;
  }
};

export const deleteBundle = async (bundleId: number): Promise<void> => {
  try {
    const response = await fetch(
      `http://localhost:8081/api/bundles/admin/delete/${bundleId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to delete bundle with ID ${bundleId}`
      );
    }
  } catch (error: any) {
    console.error("Error deleting bundle:", error);
    throw error;
  }
};


export const fetchOrders = async (): Promise<AdminOrder[]> => {
  try {
    const response = await fetch('/api/orders');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to fetch orders: ${response.status}`);
    }
    const data: AdminOrder[] = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: number, newStatus: string): Promise<Order> => {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to update order status: ${response.status}`);
    }
    const data: Order = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error;
  }
};

export const fetchPayments = async (statusFilter: string = ''): Promise<Payment[]> => {
  let url = '/api/payments';
  if (statusFilter) {
    url += `?status=${statusFilter}`;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to fetch payments: ${response.status}`);
    }
    const data: Payment[] = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

// Discount Codes
export const fetchDiscounts = async (): Promise<DiscountCode[]> => {
  try {
    const response = await fetch('/api/discounts');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to fetch discounts: ${response.status}`);
    }
    const data: DiscountCode[] = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching discounts:', error);
    throw error;
  }
};

export const addDiscount = async (discountData: Omit<DiscountCode, 'discountId'>): Promise<DiscountCode> => {
  try {
    const response = await fetch('/api/discounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discountData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to add discount: ${response.status}`);
    }
    const data: DiscountCode = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error adding discount:', error);
    throw error;
  }
};

export const fetchDiscount = async (discountId: number): Promise<DiscountCode> => {
  try {
    const response = await fetch(`/api/discounts/${discountId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to fetch discount: ${response.status}`);
    }
    const data: DiscountCode = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error fetching discount ${discountId}:`, error);
    throw error;
  }
};

export const updateDiscount = async (discountId: number, discountData: DiscountCode): Promise<DiscountCode> => {
  try {
    const response = await fetch(`/api/discounts/${discountId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discountData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to update discount: ${response.status}`);
    }
    const data: DiscountCode = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error updating discount ${discountId}:`, error);
    throw error;
  }
};

export const deleteDiscount = async (discountId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/discounts/${discountId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to delete discount: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error deleting discount ${discountId}:`, error);
    throw error;
  }
};


export const fetchReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch('/api/reviews');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to fetch reviews: ${response.status}`);
    }
    const data: Review[] = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to delete review: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error deleting review ${reviewId}:`, error);
    throw error;
  }
};

// Castes

export const fetchCastes = async(): Promise<Caste[]>=>{
  try {
    const response = await fetch(`/api/bundles/castes`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || `Failed to fetch Castes: ${response.status}`
      );
    }
    const data: Caste[] = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching Castes:", error);
    throw error;
  }
}

export const fetchCasteById = async (casteId: number): Promise<Caste> => {
  try {
    const response = await fetch(`http://localhost:8081/api/bundles/caste/${casteId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to fetch caste: ${response.status}`);
    }
    const data: Caste = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error fetching caste ${casteId}:`, error);
    throw error;
  }
};

export const addCaste = async (newCaste: { name: string;}): Promise<Caste> => {
  try {
    const response = await fetch('http://localhost:8081/api/bundles/castes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCaste),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to add caste: ${response.status}`);
    }
    const data: Caste = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error adding caste:', error);
    throw error;
  }
};

export const updateCaste = async (
  casteId: number,
  updatedCaste: { name: string;}
): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:8081/api/bundles/castes/${casteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCaste),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to update caste: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error updating caste ${casteId}:`, error);
    throw error;
  }
};

export const deleteCaste = async (casteId: number): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:8081/api/bundles/castes/${casteId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to delete caste: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error deleting caste ${casteId}:`, error);
    throw error;
  }
};


// BundleCastes

export const fetchBundleCastes = async (): Promise<BundleCaste[]> => {
  try {
    const response = await fetch(`/api/bundles/bundleCastes`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || `Failed to fetch BundleCastes: ${response.status}`
      );
    }
    const data: BundleCaste[] = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching BundleCastes:", error);
    throw error;
  }
};

export const addBundleCaste = async (bundleCasteData: Omit<BundleCaste, 'id'>): Promise<BundleCaste> => {
  try {
    const response = await fetch('/api/bundles/bundlecastes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bundleCasteData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to add bundle caste: ${response.status}`);
    }
    const data: BundleCaste = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error adding bundle caste:', error);
    throw error;
  }
};

export const updateBundleCaste = async (id: number, bundleCasteData: BundleCaste): Promise<BundleCaste> => {
  try {
    const response = await fetch(`/api/bundles/bundlecastes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bundleCasteData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to update bundle caste: ${response.status}`);
    }
    const data: BundleCaste = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error updating bundle caste ${id}:`, error);
    throw error;
  }
};

export const deleteBundleCaste = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/api/bundles/bundlecastes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Failed to delete bundle caste: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error deleting bundle caste ${id}:`, error);
    throw error;
  }
};


