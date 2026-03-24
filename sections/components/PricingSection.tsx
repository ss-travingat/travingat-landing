"use client";
import { useState } from "react";

const plans = [
  {
    name: "Explorer",
    price: { monthly: 0, annual: 0 },
    description: "For casual travelers starting their journey",
    buttonStyle: "border border-white/30 text-white hover:bg-white/10",
    features: [
      "Unlimited country flags",
      "Upload photos to 3 countries",
      "Max 10 photos per country",
      "Create folders for unlimited countries (photos locked)",
      "Public profile link",
      '"Built with Travingat" badge on all pages',
    ],
  },
  {
    name: "Traveller",
    price: { monthly: 7, annual: 5.6 },
    description: "For serious travelers building their travel identity",
    buttonStyle:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500",
    features: [
      "Everything in Explorer",
      "Unlimited countries",
      "Unlimited photos and videos per country",
      "Drag & drop reorder of countries and collections",
      "Remove Travingat badge",
      "1 premium template (2 total)",
    ],
  },
  {
    name: "Nomad",
    price: { monthly: 15, annual: 12 },
    description: "For creators, storytellers, and travel personalities",
    buttonStyle:
      "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400",
    features: [
      "Everything in Traveller",
      "6 premium profile templates (total)",
      "Password-protected collections",
      'Featured on Travingat "Featured Profiles" page',
      "Early access to new features",
      "Public sharable links for countries and collections",
    ],
  },
];

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const onboardingUrl = "http://localhost:3000/onboarding";

  return (
    <section id="pricing" className="hidden xl:block px-5 py-10 xl:px-24 xl:py-20">
      <h2 className="text-[28px] leading-[1.2] font-bold text-white text-center mb-3 xl:text-[48px] xl:mb-4">
        Pricing
      </h2>
      <p className="text-sm text-gray-400 text-center mb-8 max-w-[600px] mx-auto xl:text-base xl:mb-12">
        Built for travelers at every stage: from first trips to premium profile
        presence.
      </p>

      {/* Toggle */}
      <div className="flex items-center justify-center gap-2 mb-10 xl:mb-14">
        <div className="bg-[#1a1a1a] rounded-full p-1 flex">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              !isAnnual
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              isAnnual
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Annual
            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-semibold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-6 xl:flex-row xl:justify-center xl:gap-8">
        {plans.map((plan) => {
          const price = isAnnual ? plan.price.annual : plan.price.monthly;
          return (
            <div
              key={plan.name}
              className="bg-[#111] border border-gray-800 rounded-2xl p-6 xl:w-[384px] xl:p-8"
            >
              <h3 className="text-xl font-bold text-white mb-1 xl:text-2xl">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-white xl:text-4xl">
                  ${price}
                </span>
                <span className="text-sm text-gray-400">/per month</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">{plan.description}</p>

              <a
                href={onboardingUrl}
                className={`w-full py-3 rounded-full text-sm font-semibold transition-colors mb-3 inline-flex items-center justify-center ${plan.buttonStyle}`}
              >
                Get Started
              </a>

              <a
                href="/signin"
                className="mb-6 inline-flex w-full items-center justify-center rounded-full border border-[#2a2a2a] px-4 py-3 text-sm text-[#d8d8d8] transition hover:border-[#444] hover:text-white"
              >
                Already traveler? Sign in
              </a>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-rounded text-green-400 text-[18px] mt-0.5 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
                      check
                    </span>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
