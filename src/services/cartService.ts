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
// Cart Types
// =============================================
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    compare_at_price?: number;
    quantity: number;
    business_name?: string;
    slug: string;
  };
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartData {
  quantity: number;
}

// =============================================
// Cart Service
// =============================================
class CartService {
  /**
   * Get user's cart items
   */
  async getCartItems(): Promise<CartItem[]> {
    console.log('🛒 [CartService] Fetching cart items');
    
    const response = await api.get<ApiResponse<any>>('/cart');
    console.log('📦 [CartService] Raw response:', response.data);
    
    // Handle different response structures
    let rawItems: any[] = [];
    
    if (response.data.data && response.data.data.items) {
      // Response structure: { data: { items: [...], summary: {...} } }
      rawItems = response.data.data.items;
    } else if (Array.isArray(response.data.data)) {
      rawItems = response.data.data;
    } else if (Array.isArray(response.data)) {
      rawItems = response.data;
    }
    
    // Transform items - backend returns 'products' (plural), we need 'product' (singular)
    const cartItems: CartItem[] = rawItems.map(item => ({
      ...item,
      product: item.products || item.product // Handle both 'products' and 'product'
    }));
    
    console.log('✅ [CartService] Cart items fetched:', cartItems.length);
    console.log('📝 [CartService] Cart items detail:', cartItems);
    
    return cartItems;
  }

  /**
   * Add item to cart
   */
  async addToCart(data: AddToCartData): Promise<CartItem> {
    console.log('➕ [CartService] Adding to cart:', data);
    
    const response = await api.post<ApiResponse<CartItem>>('/cart', data);
    console.log('📦 [CartService] Add to cart response:', response.data);
    
    console.log('✅ [CartService] Item added to cart');
    
    // Handle different response structures
    if (response.data.data) {
      return response.data.data;
    } else if (response.data && 'id' in response.data) {
      return response.data as unknown as CartItem;
    }
    
    throw new Error('Invalid response structure from add to cart API');
  }

  /**
   * Update cart item quantity
   * Sets the exact quantity for a cart item using PUT /cart/:cartItemId
   */
  async updateCartItem(cartItemId: string, data: UpdateCartData): Promise<CartItem> {
    console.log('✏️ [CartService] Updating cart item:', cartItemId, data);
    
    const response = await api.put<ApiResponse<CartItem>>(`/cart/${cartItemId}`, data);
    console.log('📦 [CartService] Update response:', response.data);
    console.log('✅ [CartService] Cart item updated successfully');
    
    // Handle different response structures
    if (response.data.data) {
      return response.data.data;
    } else if (response.data && 'id' in response.data) {
      return response.data as unknown as CartItem;
    }
    
    throw new Error('Invalid response structure from update cart API');
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId: string): Promise<void> {
    console.log('🗑️ [CartService] Removing from cart:', cartItemId);
    
    await api.delete(`/cart/${cartItemId}`);
    
    console.log('✅ [CartService] Item removed from cart');
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    console.log('🧹 [CartService] Clearing cart');
    
    await api.delete('/cart/clear/all');
    
    console.log('✅ [CartService] Cart cleared');
  }

  /**
   * Get cart summary (totals, counts)
   */
  async getCartSummary(): Promise<{
    total_items: number;
    subtotal: number;
    total: number;
  }> {
    console.log('📊 [CartService] Fetching cart summary');
    
    const response = await api.get<ApiResponse<any>>('/cart/summary');
    
    console.log('✅ [CartService] Cart summary fetched');
    
    return response.data.data;
  }
}

export const cartService = new CartService();
