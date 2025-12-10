import api from './api';

// =============================================
// API Response Types
// =============================================
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// =============================================
// Category Types
// =============================================
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  display_order?: number;
  product_count?: number;
  _count?: {
    products?: number;
  };
}

// =============================================
// Category Service
// =============================================
class CategoryService {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    console.log('📁 [CategoryService] Fetching all categories...');
    
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    
    console.log('✅ [CategoryService] Categories fetched:', response.data.data.length);
    
    return response.data.data;
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    console.log('🔍 [CategoryService] Fetching category by ID:', id);
    
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    
    console.log('✅ [CategoryService] Category fetched:', response.data.data.name);
    
    return response.data.data;
  }

  /**
   * Get active categories only
   */
  async getActiveCategories(): Promise<Category[]> {
    console.log('✅ [CategoryService] Fetching active categories...');
    
    const categories = await this.getCategories();
    // Handle both camelCase and snake_case field names from API
    const activeCategories = categories.filter(cat => cat.isActive || cat.is_active);
    
    console.log('✅ [CategoryService] Active categories:', activeCategories.length);
    console.log('📋 [CategoryService] Sample category:', categories[0]);
    
    return activeCategories;
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
export default categoryService;
