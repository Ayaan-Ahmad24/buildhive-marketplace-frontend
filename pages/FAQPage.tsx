import React, { useState } from "react";
import { Icons } from "../components/Icons";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqs: FAQItem[] = [
    {
      category: "Orders",
      question: "How do I place an order?",
      answer:
        "To place an order, browse our product catalog, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, provide shipping information, and complete payment to finalize your order.",
    },
    {
      category: "Orders",
      question: "Can I modify or cancel my order?",
      answer:
        "You can modify or cancel your order within 1 hour of placing it. After this time, the order enters processing and cannot be changed. Please contact our customer support team immediately if you need to make changes.",
    },
    {
      category: "Orders",
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing the order details in the 'Orders' section.",
    },
    {
      category: "Shipping",
      question: "What are your shipping options?",
      answer:
        "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Shipping costs are calculated at checkout based on your location and selected shipping method.",
    },
    {
      category: "Shipping",
      question: "Do you ship internationally?",
      answer:
        "Currently, we only ship within Pakistan. We're working on expanding our shipping coverage to international destinations in the near future.",
    },
    {
      category: "Shipping",
      question: "What if my order arrives damaged?",
      answer:
        "If your order arrives damaged, please contact us within 48 hours with photos of the damaged items and packaging. We'll arrange for a replacement or refund immediately.",
    },
    {
      category: "Returns",
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of delivery for most items. Products must be in their original condition and packaging. Custom-made or personalized items are not eligible for return unless defective.",
    },
    {
      category: "Returns",
      question: "How do I initiate a return?",
      answer:
        "To initiate a return, log into your account, go to your order history, select the order you want to return, and click 'Request Return'. Follow the instructions to complete your return request.",
    },
    {
      category: "Returns",
      question: "When will I receive my refund?",
      answer:
        "Refunds are processed within 5-7 business days after we receive and inspect your returned item. The refund will be credited to your original payment method.",
    },
    {
      category: "Payment",
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards (Visa, Mastercard, American Express), bank transfers, and cash on delivery (COD) for eligible orders.",
    },
    {
      category: "Payment",
      question: "Is it safe to use my credit card on your site?",
      answer:
        "Yes, absolutely. We use industry-standard SSL encryption to protect your payment information. All transactions are processed securely through our PCI-DSS compliant payment gateway.",
    },
    {
      category: "Payment",
      question: "Do you offer installment payments?",
      answer:
        "Yes, we offer installment payment options for orders above PKR 10,000. You can select this option during checkout if your order qualifies.",
    },
    {
      category: "Account",
      question: "How do I create an account?",
      answer:
        "Click on 'Sign In' in the top navigation, then select 'Create Account'. Fill in your information and click 'Register'. You'll receive a verification email to activate your account.",
    },
    {
      category: "Account",
      question: "I forgot my password. What should I do?",
      answer:
        "Click on 'Forgot Password' on the sign-in page. Enter your email address, and we'll send you instructions to reset your password.",
    },
    {
      category: "Account",
      question: "How do I update my account information?",
      answer:
        "Log into your account and go to 'My Account'. From there, you can update your profile information, email address, password, and saved addresses.",
    },
    {
      category: "Products",
      question: "Are product images accurate?",
      answer:
        "We strive to display products as accurately as possible. However, colors may vary slightly due to monitor settings and lighting conditions. Product dimensions and specifications are provided in the product description.",
    },
    {
      category: "Products",
      question: "Do you offer product warranties?",
      answer:
        "Many of our products come with manufacturer warranties. Warranty details are specified in the product description. Please check individual product pages for specific warranty information.",
    },
    {
      category: "Products",
      question: "How do I know if a product is in stock?",
      answer:
        "Product availability is displayed on each product page. If an item is out of stock, you can sign up for notifications to be alerted when it becomes available again.",
    },
  ];

  const categories = [
    "all",
    ...Array.from(new Set(faqs.map((faq) => faq.category))),
  ];

  const filteredFAQs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about BuildHive Market
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <div className="flex-1">
                  <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded mb-2">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <div className="ml-4">
                  {openIndex === index ? (
                    <Icons.ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Icons.ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 rounded-xl bg-primary/5 border border-primary/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-700 mb-6">
            Can't find the answer you're looking for? Our customer support team
            is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@buildhive.com"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Icons.Mail className="h-5 w-5" />
              Email Support
            </a>
            <a
              href="tel:+923001234567"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors"
            >
              <Icons.Phone className="h-5 w-5" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
