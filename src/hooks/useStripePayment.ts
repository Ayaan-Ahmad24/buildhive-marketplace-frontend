// import { useState } from "react";
// import axios from "axios";

// import { useAuth } from "../context/AuthContext";

// export function useStripePayment() {
//   const { token } = useAuth();
//   const [stripeConfig, setStripeConfig] = useState<{ publishableKey: string; mode: string } | null>(null);
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const BASE_URL = "http://localhost:3000";
//   // 1. Fetch Stripe publishable key
//   const fetchStripeConfig = async () => {
//     console.log("[Stripe] Fetching config...");
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(`${BASE_URL}/payment/config`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       console.log("[Stripe] Config response:", res.data);
//       setStripeConfig(res.data);
//     } catch (err: any) {
//       console.error("[Stripe] Config error:", err);
//       setError("Failed to fetch Stripe config");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2. Create payment intent
//   const createPaymentIntent = async (orderId: string) => {
//     console.log("[Stripe] Creating payment intent for orderId:", orderId);
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.post(`${BASE_URL}/payment/create-payment-intent`, { orderId }, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       console.log("[Stripe] Payment intent response:", res.data);
//       setClientSecret(res.data.data?.clientSecret);
//       setPaymentIntentId(res.data.data?.paymentIntentId);
//     } catch (err: any) {
//       console.error("[Stripe] Payment intent error:", err);
//       if (err.response) {
//         console.error("[Stripe] Error response data:", err.response.data);
//       }
//       setError("Failed to create payment intent");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 3. Confirm payment to backend
//   const confirmPaymentToBackend = async (paymentIntentId: string) => {
//     console.log("[Stripe] Confirming payment to backend for paymentIntentId:", paymentIntentId);
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.post("http://localhost:3000/payment/confirm-payment", { paymentIntentId }, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       console.log("[Stripe] Confirm payment response:", res.data);
//     } catch (err: any) {
//       console.error("[Stripe] Confirm payment error:", err);
//       if (err.response) {
//         console.error("[Stripe] Error response data:", err.response.data);
//       }
//       setError("Failed to confirm payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     stripeConfig,
//     clientSecret,
//     paymentIntentId,
//     loading,
//     error,
//     fetchStripeConfig,
//     createPaymentIntent,
//     confirmPaymentToBackend,
//   };
// }






import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export function useStripePayment() {
  const { token } = useAuth();
  const [stripeConfig, setStripeConfig] = useState<{ publishableKey: string; mode: string } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "http://localhost:3000";

  // 1. Fetch Stripe publishable key
  const fetchStripeConfig = async () => {
    console.log("[Stripe] Fetching config...");
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/payment/config`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log("[Stripe] Config response:", res.data);
      setStripeConfig(res.data);
      // CRITICAL: Return the response so CheckoutPage can use it
      return res.data;
    } catch (err: any) {
      console.error("[Stripe] Config error:", err);
      setError("Failed to fetch Stripe config");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 2. Create payment intent
  const createPaymentIntent = async (orderId: string) => {
    console.log("[Stripe] Creating payment intent for orderId:", orderId);
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${BASE_URL}/payment/create-payment-intent`, { orderId }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log("[Stripe] Payment intent response:", res.data);
      setClientSecret(res.data.data?.clientSecret);
      setPaymentIntentId(res.data.data?.paymentIntentId);
      // CRITICAL: Return the response so CheckoutPage can use it
      return res.data;
    } catch (err: any) {
      console.error("[Stripe] Payment intent error:", err);
      if (err.response) {
        console.error("[Stripe] Error response data:", err.response.data);
      }
      setError("Failed to create payment intent");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. Confirm payment to backend
  const confirmPaymentToBackend = async (paymentIntentId: string) => {
    console.log("[Stripe] Confirming payment to backend for paymentIntentId:", paymentIntentId);
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://localhost:3000/payment/confirm-payment", { paymentIntentId }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log("[Stripe] Confirm payment response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[Stripe] Confirm payment error:", err);
      if (err.response) {
        console.error("[Stripe] Error response data:", err.response.data);
      }
      setError("Failed to confirm payment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    stripeConfig,
    clientSecret,
    paymentIntentId,
    loading,
    error,
    fetchStripeConfig,
    createPaymentIntent,
    confirmPaymentToBackend,
  };
}