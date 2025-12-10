// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import {
//   authService,
//   LoginCredentials,
//   RegisterData,
//   AuthResponse,
// } from "../services/authService";

// // =============================================
// // Context Types
// // =============================================
// interface User {
//   id: string;
//   email: string;
//   full_name: string;
//   role: string;
//   email_verified: boolean;
// }

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   login: (credentials: LoginCredentials) => Promise<void>;
//   register: (data: RegisterData) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// // =============================================
// // Create Context
// // =============================================
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // =============================================
// // Provider Component
// // =============================================
// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   // =============================================
//   // Initialize Authentication State
//   // =============================================
//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         const storedToken = authService.getToken();
//         const storedUser = authService.getUser();

//         if (storedToken && storedUser) {
//           setToken(storedToken);
//           setUser(storedUser);
//           setIsAuthenticated(true);

//           // Optionally refresh user data from server
//           try {
//             await refreshUser();
//           } catch (error) {
//             console.error("Failed to refresh user data:", error);
//             // Keep using stored data if refresh fails
//           }
//         }
//       } catch (error) {
//         console.error("Failed to initialize auth from storage:", error);
//         // Continue with unauthenticated state
//       } finally {
//         setLoading(false);
//       }
//     };

//     initAuth();
//   }, []);

//   // =============================================
//   // Login Function
//   // =============================================
//   const login = async (credentials: LoginCredentials): Promise<void> => {
//     try {
//       const authData: AuthResponse = await authService.login(credentials);

//       setToken(authData.token);
//       setUser(authData.user);
//       setIsAuthenticated(true);
//     } catch (error: any) {
//       console.error("Login error:", error);
//       throw new Error(error.response?.data?.message || "Login failed");
//     }
//   };

//   // =============================================
//   // Register Function
//   // =============================================
//   const register = async (data: RegisterData): Promise<void> => {
//     try {
//       const authData: AuthResponse = await authService.register(data);

//       setToken(authData.token);
//       setUser(authData.user);
//       setIsAuthenticated(true);
//     } catch (error: any) {
//       console.error("Registration error:", error);
//       throw new Error(error.response?.data?.message || "Registration failed");
//     }
//   };

//   // =============================================
//   // Logout Function
//   // =============================================
//   const logout = async (): Promise<void> => {
//     try {
//       await authService.logout();
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       setToken(null);
//       setUser(null);
//       setIsAuthenticated(false);
//     }
//   };

//   // =============================================
//   // Refresh User Data
//   // =============================================
//   const refreshUser = async (): Promise<void> => {
//     try {
//       const userData = await authService.getCurrentUser();
//       setUser(userData);
//     } catch (error) {
//       console.error("Failed to refresh user data:", error);
//       throw error;
//     }
//   };

//   // =============================================
//   // Context Value
//   // =============================================
//   const value: AuthContextType = {
//     isAuthenticated,
//     user,
//     token,
//     loading,
//     login,
//     register,
//     logout,
//     refreshUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // =============================================
// // Custom Hook
// // =============================================
// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);

//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }

//   return context;
// };

// export default AuthContext;

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  authService,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "../services/authService";

// =============================================
// Context Types
// =============================================
interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  emailVerified: boolean;
  profileImage: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// =============================================
// Create Context
// =============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================
// Provider Component
// =============================================
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // =============================================
  // Refresh User Data (using useCallback to stabilize reference)
  // =============================================
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      throw error;
    }
  }, []);

  // =============================================
  // Initialize Authentication State
  // =============================================
  useEffect(() => {
    const initAuth = async () => {
      console.log("🔄 [AuthContext] Initializing auth state...");
      try {
        const storedToken = authService.getToken();
        const storedUser = authService.getUser();
        console.log("📦 [AuthContext] Stored data:", {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
          user: storedUser,
        });

        if (storedToken && storedUser) {
          console.log("✅ [AuthContext] Found stored auth, restoring session");
          setToken(storedToken);
          setUser(storedUser);
          setIsAuthenticated(true);

          // Optionally refresh user data from server
          try {
            console.log(
              "🔄 [AuthContext] Attempting to refresh user data from server..."
            );
            await refreshUser();
            console.log("✅ [AuthContext] User data refreshed from server");
          } catch (error) {
            console.warn(
              "⚠️ [AuthContext] Failed to refresh user data, keeping stored data:",
              error
            );
            // Keep using stored data if refresh fails
          }
        } else {
          console.log(
            "ℹ️ [AuthContext] No stored auth found, user not logged in"
          );
        }
      } catch (error) {
        console.error(
          "❌ [AuthContext] Failed to initialize auth from storage:",
          error
        );
        // Continue with unauthenticated state
      } finally {
        setLoading(false);
        console.log("✅ [AuthContext] Auth initialization complete");
      }
    };

    initAuth();
  }, [refreshUser]);

  // =============================================
  // Login Function
  // =============================================
  const login = async (credentials: LoginCredentials): Promise<void> => {
    console.log("🔑 [AuthContext] Attempting login...");
    try {
      const authData: AuthResponse = await authService.login(credentials);
      console.log("✅ [AuthContext] Login successful, setting auth state");

      setToken(authData.accessToken);
      setUser(authData.user);
      setIsAuthenticated(true);
      console.log("✅ [AuthContext] Auth state updated:", {
        userId: authData.user.id,
        email: authData.user.email,
      });
    } catch (error: any) {
      console.error("❌ [AuthContext] Login error:", error);
      console.error("📄 [AuthContext] Error response:", error.response?.data);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // =============================================
  // Register Function
  // =============================================
  const register = async (data: RegisterData): Promise<void> => {
    console.log("📝 [AuthContext] Attempting registration...");
    console.log("📦 [AuthContext] Registration payload:", data);
    try {
      const authData: AuthResponse = await authService.register(data);
      console.log(
        "✅ [AuthContext] Registration successful, setting auth state"
      );

      setToken(authData.accessToken);
      setUser(authData.user);
      setIsAuthenticated(true);
      console.log("✅ [AuthContext] Auth state updated:", {
        userId: authData.user.id,
        email: authData.user.email,
      });
    } catch (error: any) {
      console.error("❌ [AuthContext] Registration error:", error);
      console.error("📄 [AuthContext] Error response:", error.response?.data);
      console.error("📊 [AuthContext] Error status:", error.response?.status);

      // Log validation errors if they exist
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        console.error("🚨 [AuthContext] Validation errors:");
        error.response.data.errors.forEach((err: any, index: number) => {
          console.error(
            `  ${index + 1}. Field: ${
              err.field || err.param || "unknown"
            }, Message: ${err.message || err.msg || JSON.stringify(err)}`
          );
        });
      }

      // Construct error message
      let errorMessage = error.response?.data?.message || "Registration failed";

      // If there are validation errors, include them in the message
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        const validationMessages = error.response.data.errors
          .map((err: any) => err.message || err.msg || JSON.stringify(err))
          .join(", ");
        errorMessage = `${errorMessage}: ${validationMessages}`;
      }

      throw new Error(errorMessage);
    }
  };

  // =============================================
  // Logout Function
  // =============================================
  const logout = async (): Promise<void> => {
    console.log("🚪 [AuthContext] Logging out...");
    try {
      await authService.logout();
      console.log("✅ [AuthContext] Logout API call successful");
    } catch (error) {
      console.error("❌ [AuthContext] Logout error:", error);
    } finally {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      console.log("✅ [AuthContext] Auth state cleared");
    }
  };

  // =============================================
  // Context Value
  // =============================================
  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// =============================================
// Custom Hook
// =============================================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
