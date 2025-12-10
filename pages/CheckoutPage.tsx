import React, { useState } from "react";
import { StripeProviderWrapper } from "../src/components/StripeProviderWrapper";
import { StripeCardForm } from "../src/components/StripeCardForm";
import { useStripePayment } from "../src/hooks/useStripePayment";
import { toast } from "react-toastify";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { CartItem } from "../types";
import {
  orderService,
  type CreateOrderData,
} from "../src/services/orderService";
import { addressService } from "../src/services/addressService";
import { useAuth } from "../src/context/AuthContext";

interface CheckoutPageProps {
  cartItems: CartItem[];
  onNavigate: (page: string) => void;
  onPlaceOrder: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  onNavigate,
  onPlaceOrder,
}) => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [stripeConfig, setStripeConfig] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const stripePayment = useStripePayment();
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Pakistan",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address_line1.trim())
      newErrors.address_line1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.postal_code.trim())
      newErrors.postal_code = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      console.log("📦 [Checkout] Cart items before order:", cartItems);

      // Validate cart items have product data
      const invalidItems = cartItems.filter(
        (item) => !item.product || !item.product.price
      );
      if (invalidItems.length > 0) {
        console.error("❌ [Checkout] Invalid cart items:", invalidItems);
        toast.error(
          "Cart data is incomplete. Please refresh the page and try again."
        );
        return;
      }

      // Step 1: Create address first
      console.log("📍 [Checkout] Creating shipping address...");
      if (!user?.id) {
        toast.error("User not found. Please sign in again.");
        return;
      }
      const addressPayload = {
        fullName: formData.full_name,
        addressLine1: formData.address_line1,
        addressLine2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postal_code,
        country: formData.country,
        phone: formData.phone,
        isDefault: false,
      };
      console.log("📤 [Checkout] Address payload:", addressPayload);
      const address = await addressService.createAddress(
        user.id,
        addressPayload
      );
      console.log("✅ [Checkout] Address created:", address.id);

      // Step 2: Create order with address ID
      const orderData: CreateOrderData = {
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product!.price,
        })),
        shippingAddressId: address.id,
        paymentMethod: paymentMethod,
        notes: formData.notes,
      };

      console.log("==== ORDER CREATION DEBUG ====");
      console.log("Order payload:", JSON.stringify(orderData, null, 2));
      console.log("Payment method:", orderData.paymentMethod);
      console.log("Shipping Address ID:", orderData.shippingAddressId);
      console.log("Items:", orderData.items);

      let orderResponse;
      try {
        orderResponse = await orderService.createOrder(orderData);
        console.log("✅ [OrderService] Order response:", orderResponse);
      } catch (orderError) {
        console.error("❌ [OrderService] Order creation error:", orderError);
        throw orderError;
      }































      // Extract order from array if needed
      const order = orderResponse.orders
        ? orderResponse.orders[0]
        : orderResponse;
      setCreatedOrderId(order.id);
      console.log("[Checkout] Extracted order:", order);

      if (paymentMethod === "card") {
        // Stripe payment flow
         // Stripe payment flow
        console.log(
          "[Checkout] Starting Stripe payment flow for order:",
          order.id
        );
        const configRes = await stripePayment.fetchStripeConfig();
        const intentRes = await stripePayment.createPaymentIntent(order.id);
        
        // Extract nested data correctly - API returns {success, message, data: {...}}
        const newStripeConfig = configRes?.data || configRes;
        const newClientSecret = intentRes?.data?.clientSecret || intentRes?.clientSecret;
        const newPaymentIntentId = intentRes?.data?.paymentIntentId || intentRes?.paymentIntentId;
        
        console.log("[Checkout] Extracted Stripe data:", {
          configRes,
          intentRes,
          newStripeConfig,
          newClientSecret,
          newPaymentIntentId,
        });
        
        setStripeConfig(newStripeConfig);
        setClientSecret(newClientSecret);
        setPaymentIntentId(newPaymentIntentId);
        console.log("[Checkout] Stripe local state after payment intent:", {
          newStripeConfig,
          newClientSecret,
          newPaymentIntentId,
        });
        if (newStripeConfig && newClientSecret && newPaymentIntentId) {
          setShowStripeForm(true);
          console.log("[Checkout] Stripe form should now be shown.");
        } else {
          console.error("[Checkout] Stripe payment intent creation failed.");
          toast.error("Failed to start card payment. Please try again.");
        }
        setIsProcessing(false);
        return;
      }

      setOrderNumber(order.order_number);
      setOrderPlaced(true);
      onPlaceOrder(); // Clear cart
      toast.success(`Order placed successfully! Order #${order.order_number}`);
    } catch (error: any) {
      console.error("Failed to place order:", error);
      console.error(
        "❌ [Checkout] Backend error response:",
        error.response?.data
      );








































      // Log detailed validation errors
      if (error.response?.data?.errors) {
        console.error(
          "🔴 [Checkout] Validation errors:",
          error.response.data.errors
        );
        if (Array.isArray(error.response.data.errors)) {
          error.response.data.errors.forEach((err: any, index: number) => {
            console.error(`   Error ${index + 1}:`, err);
            if (typeof err === "object") {
              console.error(
                `     - Field:`,
                err.field || err.path || "unknown"
              );
              console.error(`     - Message:`, err.message || err.msg || err);
            }
          });
        } else {
          // errors is a string
          console.error("   Error:", error.response.data.errors);
        }
      }

      console.log(
        "📋 Full error response object:",
        JSON.stringify(error.response?.data, null, 2)
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (showStripeForm && stripeConfig && clientSecret && paymentIntentId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Enter Card Details
        </h1>
        <p className="mb-8 max-w-md text-gray-500">
          Complete your payment securely using Stripe test card.
        </p>
        <StripeProviderWrapper publishableKey={stripeConfig.publishableKey}>
          <StripeCardForm
            clientSecret={clientSecret}
            paymentIntentId={paymentIntentId}
            onPaymentSuccess={async (paymentIntentId) => {
              await stripePayment.confirmPaymentToBackend(paymentIntentId);
              setOrderPlaced(true);
              setShowStripeForm(false);
              onPlaceOrder();
              toast.success("Payment successful! Your order is confirmed.");
            }}
          />
        </StripeProviderWrapper>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <div className="mb-6 rounded-full bg-green-100 p-8 shadow-sm">
          <Icons.Check className="h-16 w-16 text-green-600" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>
        <p className="mb-8 max-w-md text-gray-500">
          Thank you for shopping with BuildHive. Your order{" "}
          <span className="font-bold text-gray-900">
            #BH-{Math.floor(Math.random() * 100000)}
          </span>{" "}
          has been confirmed and will be shipped shortly.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => onNavigate("home")} variant="outline">
            Back to Home
          </Button>
          <Button onClick={() => onNavigate("products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium">
          <span
            className="text-gray-500 cursor-pointer"
            onClick={() => onNavigate("cart")}
          >
            Cart
          </span>
          <Icons.ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-primary">Checkout</span>
          <Icons.ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-300">Confirmation</span>
        </nav>

        <form
          onSubmit={handlePlaceOrder}
          className="flex flex-col gap-8 lg:flex-row"
        >
          {/* Left Column - Form */}
          <div className="flex-grow space-y-6">
            {/* Contact Info */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Icons.User className="h-5 w-5 text-primary" /> Contact
                Information
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="0300 1234567"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Icons.MapPin className="h-5 w-5 text-primary" /> Shipping
                Address
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      aria-label="Full Name"
                      className={`w-full rounded-lg border ${
                        errors.full_name ? "border-red-500" : "border-gray-200"
                      } bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                    />
                    {errors.full_name && (
                      <p className="text-xs text-red-500">{errors.full_name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0300 1234567"
                      aria-label="Phone"
                      className={`w-full rounded-lg border ${
                        errors.phone ? "border-red-500" : "border-gray-200"
                      } bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Street Address *
                  </label>
                  <input
                    required
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    placeholder="House # 123, Street Name"
                    aria-label="Address Line 1"
                    className={`w-full rounded-lg border ${
                      errors.address_line1
                        ? "border-red-500"
                        : "border-gray-200"
                    } bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                  />
                  {errors.address_line1 && (
                    <p className="text-xs text-red-500">
                      {errors.address_line1}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Apartment, Suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleInputChange}
                    placeholder="Apartment 4B"
                    aria-label="Address Line 2"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Karachi"
                      aria-label="City"
                      className={`w-full rounded-lg border ${
                        errors.city ? "border-red-500" : "border-gray-200"
                      } bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      State/Province *
                    </label>
                    <input
                      required
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Sindh"
                      aria-label="State"
                      className={`w-full rounded-lg border ${
                        errors.state ? "border-red-500" : "border-gray-200"
                      } bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                    />
                    {errors.state && (
                      <p className="text-xs text-red-500">{errors.state}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Postal Code *
                    </label>
                    <input
                      required
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      placeholder="75500"
                      aria-label="Postal Code"
                      className={`w-full rounded-lg border ${
                        errors.postal_code
                          ? "border-red-500"
                          : "border-gray-200"
                      } bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                    />
                    {errors.postal_code && (
                      <p className="text-xs text-red-500">
                        {errors.postal_code}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Order Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special instructions for delivery..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Icons.CreditCard className="h-5 w-5 text-primary" /> Payment
                Method
              </h2>
              <div className="space-y-3">
                {[
                  {
                    id: "cod",
                    name: "Cash on Delivery",
                    icon: Icons.Cash,
                    desc: "Pay when you receive your order",
                  },
                  {
                    id: "card",
                    name: "Credit / Debit Card",
                    icon: Icons.CreditCard,
                    desc: "Secure payment via Stripe",
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm">
                      <method.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {method.name}
                      </div>
                      <div className="text-xs text-gray-500">{method.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-96">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mb-6 max-h-60 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-medium text-gray-900">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  {/* Shipping charges removed */}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span className="font-medium text-gray-900">
                    PKR {tax.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>PKR {total.toLocaleString()}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-8 w-full shadow-lg shadow-primary/25 disabled:opacity-70"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>

              <div className="mt-4 text-center text-xs text-gray-500">
                By placing this order, you agree to our{" "}
                <a href="#" className="underline">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
