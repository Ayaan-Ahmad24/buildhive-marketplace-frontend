import React, { useState } from "react";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/Button";
import { FaRegCreditCard } from "react-icons/fa";

interface StripeCardFormProps {
  clientSecret: string;
  paymentIntentId: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a202c',
      '::placeholder': { color: '#9ca3af' },
      fontFamily: 'inherit',
      letterSpacing: '0.025em',
    },
    invalid: {
      color: '#ef4444',
    },
  },
};

export const StripeCardForm: React.FC<StripeCardFormProps> = ({
  clientSecret,
  paymentIntentId,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError("Card element not found.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntentId);
      } else {
        setError("Payment was not successful. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 flex flex-col items-center">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-primary/10 rounded-full p-4 mb-2">
          <FaRegCreditCard color="var(--color-primary)" size="1.875rem" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Card Payment</h2>
        <p className="text-gray-500 text-sm">Enter your card details below</p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Card Number
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all">
              <CardNumberElement options={cardElementOptions} />
            </div>
          </div>

          {/* Expiry and CVC in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Date
              </label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all">
                <CardExpiryElement options={cardElementOptions} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CVC
              </label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all">
                <CardCvcElement options={cardElementOptions} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm text-center">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isProcessing || !stripe}
          className="w-full py-3 text-lg rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold shadow-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Pay Now"
          )}
        </Button>

        <div className="flex justify-center gap-3 mt-4 opacity-70">
          <img src="https://cdn.jsdelivr.net/gh/stripe/stripe-js@master/docs/demo/card-icons/visa.svg" alt="Visa" className="h-6" />
          <img src="https://cdn.jsdelivr.net/gh/stripe/stripe-js@master/docs/demo/card-icons/mastercard.svg" alt="Mastercard" className="h-6" />
          <img src="https://cdn.jsdelivr.net/gh/stripe/stripe-js@master/docs/demo/card-icons/amex.svg" alt="Amex" className="h-6" />
        </div>
      </form>
    </div>
  );
};