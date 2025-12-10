import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

interface StripeProviderWrapperProps {
  publishableKey: string;
  children: React.ReactNode;
}

export const StripeProviderWrapper: React.FC<StripeProviderWrapperProps> = ({
  publishableKey,
  children,
}) => {
  const stripePromise = loadStripe(publishableKey);
  return <Elements stripe={stripePromise}>{children}</Elements>;
};
