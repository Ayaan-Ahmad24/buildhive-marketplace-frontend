import React from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center px-4 py-20">
      {/* Decorative Elements */}
      <div className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-gradient-to-tr from-blue-300 to-cyan-400 opacity-20 blur-3xl"></div>
      <div className="absolute right-[15%] bottom-[25%] h-40 w-40 rounded-full bg-gradient-to-tr from-purple-300 to-pink-400 opacity-20 blur-3xl"></div>

      <div className="relative max-w-2xl text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-2xl"></div>
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100">
              <Icons.Tools className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Coming Soon Badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 text-sm font-semibold text-white shadow-lg">
            <Icons.Clock className="h-4 w-4" />
            Coming Soon
          </span>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
          Services
        </h1>
        <p className="mb-8 text-lg text-gray-600 sm:text-xl">
          We're working hard to bring you an amazing experience with
          professional construction services.
        </p>

        {/* Description */}
        <div className="mb-10 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <p className="text-gray-700 leading-relaxed">
            Our services marketplace is currently under development. Soon you'll
            be able to find and hire verified professionals for all your
            construction needs - from planning and design to execution and
            maintenance.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="gradient"
            onClick={() => onNavigate("home")}
            className="gap-2"
          >
            <Icons.Home className="h-4 w-4" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate("products")}
            className="gap-2"
          >
            <Icons.ShoppingBag className="h-4 w-4" />
            Browse Products
          </Button>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Icons.Team,
              title: "Verified Professionals",
              description: "Trusted contractors and specialists",
            },
            {
              icon: Icons.Clock,
              title: "On-Time Delivery",
              description: "Projects completed as scheduled",
            },
            {
              icon: Icons.Shield,
              title: "Quality Guaranteed",
              description: "Certified work with warranties",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white p-6 shadow-sm border border-gray-100"
            >
              <div className="mb-3 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
