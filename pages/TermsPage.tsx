import React from "react";

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using BuildHive Market, you accept and agree to
              be bound by the terms and provisions of this agreement. If you do
              not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Use License
            </h2>
            <p>
              Permission is granted to temporarily download one copy of the
              materials on BuildHive Market for personal, non-commercial
              transitory viewing only. This is the grant of a license, not a
              transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>
                Use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                Attempt to reverse engineer any software contained on BuildHive
                Market
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
              <li>
                Transfer the materials to another person or "mirror" the
                materials on any other server
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Product Information
            </h2>
            <p>
              We strive to provide accurate product descriptions and pricing
              information. However, we do not warrant that product descriptions,
              pricing, or other content on our site is accurate, complete,
              reliable, current, or error-free. If a product offered by
              BuildHive Market is not as described, your sole remedy is to
              return it in unused condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Account Registration
            </h2>
            <p>
              To access certain features of our service, you may be required to
              register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Provide accurate, current, and complete information during
                registration
              </li>
              <li>Maintain and promptly update your account information</li>
              <li>
                Maintain the security of your password and accept all risks of
                unauthorized access
              </li>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Orders and Payment
            </h2>
            <p>
              All orders placed through BuildHive Market are subject to
              acceptance and availability. We reserve the right to refuse any
              order for any reason. Prices are subject to change without notice.
              Payment must be received by us prior to our acceptance of an
              order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Shipping and Delivery
            </h2>
            <p>
              We will arrange for shipment of ordered products to you. Title and
              risk of loss pass to you upon our delivery to the carrier.
              Shipping and delivery dates are estimates only and cannot be
              guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Returns and Refunds
            </h2>
            <p>
              Our return and refund policy allows you to return products within
              30 days of receipt for a full refund, provided the products are in
              their original condition and packaging. Custom-made or
              personalized items may not be eligible for return.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Limitation of Liability
            </h2>
            <p>
              In no event shall BuildHive Market or its suppliers be liable for
              any damages (including, without limitation, damages for loss of
              data or profit, or due to business interruption) arising out of
              the use or inability to use the materials on BuildHive Market's
              website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Privacy
            </h2>
            <p>
              Your use of BuildHive Market is also governed by our Privacy
              Policy. Please review our Privacy Policy, which also governs the
              site and informs users of our data collection practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Modifications to Terms
            </h2>
            <p>
              BuildHive Market may revise these Terms of Service at any time
              without notice. By using this website, you are agreeing to be
              bound by the then-current version of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <p className="font-medium">
              Email: support@buildhive.com
              <br />
              Phone: +92 300 1234567
              <br />
              Address: Islamabad, Pakistan
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
