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
// Address Types
// =============================================
export interface Address {
  id: string;
  user_id: string;
  label?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressData {
  full_name?: string;
  label?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default?: boolean;
}

// =============================================
// Address Service
// =============================================
class AddressService {
  /**
   * Create a new address for a user
   */
  async createAddress(userId: string, data: CreateAddressData): Promise<Address> {
    console.log('📍 [AddressService] Creating address for user:', userId);
    const response = await api.post<ApiResponse<Address>>(`/users/${userId}/addresses`, data);
    console.log('✅ [AddressService] Address created:', response.data.data.id);
    return response.data.data;
  }

  /**
   * Get user's addresses
   */
  async getAddresses(userId: string): Promise<Address[]> {
    console.log('📍 [AddressService] Fetching addresses for user:', userId);
    const response = await api.get<ApiResponse<Address[]>>(`/users/${userId}/addresses`);
    const addresses = Array.isArray(response.data.data) ? response.data.data : [];
    console.log('✅ [AddressService] Addresses fetched:', addresses.length);
    return addresses;
  }
}

export const addressService = new AddressService();
