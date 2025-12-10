import React from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { CartItem } from "../types";

interface CartPageProps {
  cartItems: CartItem[];
  onNavigate: (page: string) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onClearCart: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onNavigate,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
}) => {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = 0; // Shipping calculation disabled for now
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white px-4">
        <div className="mb-6 rounded-full bg-gray-100 p-8">
          <Icons.Cart className="h-16 w-16 text-gray-400" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Your cart is empty
        </h2>
        <p className="mb-8 text-gray-500">
          Looks like you haven't added any construction supplies yet.
        </p>
        <Button
          onClick={() => onNavigate("products")}
          size="lg"
          variant="gradient"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button
              onClick={onClearCart}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              <Icons.Trash className="h-4 w-4" />
              Clear Cart
            </button>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Cart Items List */}
          <div className="flex-grow rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 hidden grid-cols-12 text-sm font-medium text-gray-500 md:grid">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
            </div>

            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 items-center gap-4 py-6 md:grid-cols-12"
                >
                  {/* Product Info */}
                  <div className="col-span-6 flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                      {item.product?.images?.[0]?.image_url ? (
                        <img
                          src={item.product.images[0].image_url}
                          alt={item.product?.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Icons.Image className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-gray-900 line-clamp-1">
                        {item.product?.name || "Product"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.product?.author || ""}
                      </p>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-600 md:hidden"
                      >
                        <Icons.Trash className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 hidden text-center font-medium text-gray-900 md:block">
                    PKR {item.product?.price.toLocaleString() || 0}
                  </div>

                  {/* Quantity Mobile/Desktop */}
                  <div className="col-span-2 flex items-center justify-between md:justify-center">
                    <div className="md:hidden font-bold text-gray-900">
                      PKR {item.product?.price.toLocaleString() || 0}
                    </div>
                    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        aria-label="Decrease quantity"
                        className="p-1 text-gray-500 hover:text-primary"
                      >
                        <Icons.Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="p-1 text-gray-500 hover:text-primary"
                      >
                        <Icons.Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Delete Button Next to Quantity */}
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      aria-label="Remove item"
                      className="ml-2 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Icons.Trash className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-2 flex items-center justify-between md:justify-center">
                    <div className="md:hidden text-xs text-gray-500">
                      Subtotal:
                    </div>
                    <span className="font-bold text-gray-900">
                      PKR{" "}
                      {(
                        (item.product?.price || 0) * item.quantity
                      ).toLocaleString()}
                    </span>
                  </div>

                  {/* Remove Button (Desktop) */}
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    aria-label="Remove item from cart"
                    className="absolute -right-3 -top-3 hidden h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white md:flex"
                  >
                    <Icons.Trash className="h-3.5 w-3.5" />
                  </button>
                  <div className="col-span-2 hidden text-center font-bold text-gray-900 md:block">
                    PKR{" "}
                    {(
                      (item.product?.price || 0) * item.quantity
                    ).toLocaleString()}
                  </div>

                  {/* Desktop Remove */}
                  <div className="hidden justify-end md:flex absolute right-8">
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      aria-label="Remove item from cart"
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Icons.Trash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => onNavigate("products")}
                className="flex items-center gap-2"
              >
                <Icons.ArrowLeft className="h-4 w-4" /> Continue Shopping
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sticky top-24">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Estimate</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0
                      ? "Free"
                      : `PKR ${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax Estimate (5%)</span>
                  <span className="font-medium text-gray-900">
                    PKR {tax.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Order Total</span>
                    <span>PKR {total.toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 text-right">
                    Includes GST where applicable
                  </p>
                </div>
              </div>

              <Button
                onClick={() => onNavigate("checkout")}
                size="lg"
                className="mt-8 w-full shadow-lg shadow-primary/25"
              >
                Proceed to Checkout
              </Button>

              <div className="mt-6 flex justify-center gap-3 text-gray-400">
                <Icons.CreditCard className="h-6 w-6" />
                <Icons.Cash className="h-6 w-6" />
                <Icons.Mobile className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
