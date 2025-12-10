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
// Business Types
// =============================================
export interface Business {
  id: string;
  user_id: string;
  business_name: string;
  business_email: string;
  business_phone?: string;
  business_address?: string;
  business_city?: string;
  business_state?: string;
  business_country?: string;
  business_postal_code?: string;
  business_description?: string;
  business_logo?: string;
  business_banner?: string;
  business_website?: string;
  tax_id?: string;
  registration_number?: string;
  status: 'active' | 'inactive' | 'suspended';
  is_verified: boolean;
  verification_documents?: string[];
  created_at: string;
  updated_at: string;
}

export interface GetBusinessesParams {
  search?: string;
  status?: 'active' | 'inactive' | 'suspended';
  isVerified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// =============================================
// Business Service
// =============================================
class BusinessService {
  /**
   * Get all businesses with filters
   */
  async getBusinesses(params?: GetBusinessesParams): Promise<{ businesses: Business[]; meta: any }> {
    console.log('🏢 [BusinessService] Fetching businesses with params:', params);
    
    const response = await api.get<ApiResponse<{ businesses: Business[]; pagination: any }>>('/businesses', {
      params,
    });
    
    const businessesData = response.data.data;
    
    console.log('✅ [BusinessService] Businesses fetched:', {
      count: businessesData.businesses?.length,
      total: businessesData.pagination?.total,
    });
    
    return {
      businesses: businessesData.businesses || [],
      meta: businessesData.pagination || {},
    };
  }

  /**
   * Get business by ID
   */
  async getBusinessById(id: string): Promise<Business> {
    console.log('🔍 [BusinessService] Fetching business by ID:', id);
    
    const response = await api.get<ApiResponse<Business>>(`/businesses/${id}`);
    
    console.log('✅ [BusinessService] Business fetched:', response.data.data.business_name);
    
    return response.data.data;
  }

  /**
   * Get current user's business
   */
  async getMyBusiness(): Promise<Business> {
    console.log('👤 [BusinessService] Fetching current user business');
    
    const response = await api.get<ApiResponse<Business>>('/businesses/me');
    
    console.log('✅ [BusinessService] Business fetched:', response.data.data.business_name);
    
    return response.data.data;
  }

  /**
   * Create a new business
   */
  async createBusiness(businessData: Partial<Business>): Promise<Business> {
    console.log('📝 [BusinessService] Creating business:', businessData.business_name);
    
    const response = await api.post<ApiResponse<Business>>('/businesses', businessData);
    
    console.log('✅ [BusinessService] Business created:', response.data.data.business_name);
    
    return response.data.data;
  }

  /**
   * Update business
   */
  async updateBusiness(id: string, businessData: Partial<Business>): Promise<Business> {
    console.log('✏️ [BusinessService] Updating business:', id);
    
    const response = await api.put<ApiResponse<Business>>(`/businesses/${id}`, businessData);
    
    console.log('✅ [BusinessService] Business updated');
    
    return response.data.data;
  }

  /**
   * Delete business
   */
  async deleteBusiness(id: string): Promise<void> {
    console.log('🗑️ [BusinessService] Deleting business:', id);
    
    await api.delete(`/businesses/${id}`);
    
    console.log('✅ [BusinessService] Business deleted');
  }

  /**
   * Get business products
   */
  async getBusinessProducts(businessId: string, params?: any): Promise<any> {
    console.log('🛍️ [BusinessService] Fetching products for business:', businessId);
    
    const response = await api.get(`/businesses/${businessId}/products`, { params });
    
    console.log('✅ [BusinessService] Products fetched');
    
    return response.data.data;
  }
}

export const businessService = new BusinessService();
