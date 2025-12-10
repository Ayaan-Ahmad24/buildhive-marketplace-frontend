// /**
//  * Storage utility with fallback for when localStorage is not available
//  */

// // Check if localStorage is available
// let isLocalStorageAvailable: boolean | null = null;
// let storageCheckPerformed = false;

// // In-memory fallback storage
// const memoryStorage: { [key: string]: string } = {};

// // Safely check storage availability without throwing errors
// function checkStorageAvailability(): boolean {
//   if (storageCheckPerformed) {
//     return isLocalStorageAvailable!;
//   }
  
//   storageCheckPerformed = true;
  
//   try {
//     // Check if we're in a valid browser context
//     if (typeof window === 'undefined' || !window.localStorage) {
//       isLocalStorageAvailable = false;
//       return false;
//     }
    
//     // Try a simple test without logging yet
//     const test = '__storage_test__';
//     window.localStorage.setItem(test, test);
//     window.localStorage.removeItem(test);
//     isLocalStorageAvailable = true;
    
//     // Only log after successful test
//     setTimeout(() => console.log('✅ localStorage is available'), 0);
//     return true;
//   } catch (e) {
//     // Silently fail - this is expected in restricted contexts
//     isLocalStorageAvailable = false;
//     setTimeout(() => console.warn('⚠️ localStorage blocked, using in-memory storage'), 0);
//     return false;
//   }
// }

// export const safeStorage = {
//   /**
//    * Get item from storage (localStorage or memory fallback)
//    */
//   getItem(key: string): string | null {
//     const available = checkStorageAvailability();
//     if (!available) {
//       return memoryStorage[key] || null;
//     }
    
//     try {
//       return window.localStorage.getItem(key);
//     } catch (error) {
//       return memoryStorage[key] || null;
//     }
//   },

//   /**
//    * Set item in storage (localStorage or memory fallback)
//    */
//   setItem(key: string, value: string): void {
//     const available = checkStorageAvailability();
//     if (!available) {
//       memoryStorage[key] = value;
//       return;
//     }
    
//     try {
//       window.localStorage.setItem(key, value);
//     } catch (error) {
//       memoryStorage[key] = value;
//     }
//   },

//   /**
//    * Remove item from storage (localStorage or memory fallback)
//    */
//   removeItem(key: string): void {
//     const available = checkStorageAvailability();
//     if (!available) {
//       delete memoryStorage[key];
//       return;
//     }
    
//     try {
//       window.localStorage.removeItem(key);
//     } catch (error) {
//       delete memoryStorage[key];
//     }
//   },

//   /**
//    * Clear all items from storage
//    */
//   clear(): void {
//     const available = checkStorageAvailability();
    
//     try {
//       if (available) {
//         window.localStorage.clear();
//       }
//     } catch (error) {
//       // Silently fail
//     }
    
//     // Always clear memory storage
//     Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
//   },

//   /**
//    * Check if storage is available
//    */
//   isAvailable(): boolean {
//     return checkStorageAvailability();
//   }
// };




/**
 * Storage utility with fallback for when localStorage is not available
 */

// In-memory fallback storage
const memoryStorage: { [key: string]: string } = {};

// Track if we've logged the storage status
let hasLoggedStatus = false;

// Safely check storage availability without throwing errors
function checkStorageAvailability(): boolean {
  try {
    // Check if we're in a valid browser context
    if (typeof window === 'undefined' || !window.localStorage) {
      if (!hasLoggedStatus) {
        hasLoggedStatus = true;
        console.warn('⚠️ localStorage not available, using in-memory storage');
      }
      return false;
    }
    
    // Try a simple test
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    
    if (!hasLoggedStatus) {
      hasLoggedStatus = true;
      console.log('✅ localStorage is available');
    }
    return true;
  } catch (e) {
    // Storage blocked - silently fail and use memory storage
    if (!hasLoggedStatus) {
      hasLoggedStatus = true;
      console.warn('⚠️ localStorage blocked, using in-memory storage');
    }
    return false;
  }
}

export const safeStorage = {
  /**
   * Get item from storage (localStorage or memory fallback)
   */
  getItem(key: string): string | null {
    try {
      if (checkStorageAvailability()) {
        return window.localStorage.getItem(key);
      }
    } catch (error) {
      // Fall through to memory storage
    }
    
    return memoryStorage[key] || null;
  },

  /**
   * Set item in storage (localStorage or memory fallback)
   */
  setItem(key: string, value: string): void {
    try {
      if (checkStorageAvailability()) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (error) {
      // Fall through to memory storage
    }
    
    memoryStorage[key] = value;
  },

  /**
   * Remove item from storage (localStorage or memory fallback)
   */
  removeItem(key: string): void {
    try {
      if (checkStorageAvailability()) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      // Fall through to memory storage
    }
    
    delete memoryStorage[key];
  },

  /**
   * Clear all items from storage
   */
  clear(): void {
    try {
      if (checkStorageAvailability()) {
        window.localStorage.clear();
      }
    } catch (error) {
      // Silently fail
    }
    
    // Always clear memory storage
    Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
  },

  /**
   * Check if storage is available
   */
  isAvailable(): boolean {
    return checkStorageAvailability();
  }
};