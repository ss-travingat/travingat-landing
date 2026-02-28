"use client";

import { useState } from "react";
import { fontFamily, fontWeight, lineHeight, letterSpacing } from "@/lib/design-system";

const plans = {
    monthly: [
        {
            name: "Explorer",
            price: "$0",
            period: "/per month",
            description: "For casual travelers who are just starting their journey.",
            cta: "Get Started",
            ctaStyle: "btn-light",
            featured: false,
            features: [
                { text: "Unlimited country flags", included: true },
                { text: "Upload photos to 3 countries", included: true },
                { text: "Max 10 photos per country", included: true },
                { text: "Create folders for unlimited countries (photos locked)", included: true },
                { text: "Public profile link", included: true },
                { text: '"Built with Travingat" badge on all pages', included: true },
            ],
        },
        {
            name: "Traveller",
            price: "$7",
            period: "/per month",
            description: "For serious travelers building their travel identity.",
            cta: "Get Started",
            ctaStyle: "btn-primary",
            featured: true,
            features: [
                { text: "Everything in Explorer", included: true },
                { text: "Unlimited countries", included: true },
                { text: "Unlimited photos and videos per country", included: true },
                { text: "Create folders for unlimited countries and collections", included: true },
                { text: "Drag & drop reorder of countries and collections", included: true },
                { text: "Remove Travingat badge", included: true },
                { text: "1 premium template (2 total)", included: true },
            ],
        },
        {
            name: "Nomad",
            price: "$15",
            period: "/per month",
            description: "For creators, storytellers, and travel personalities.",
            cta: "Get Started",
            ctaStyle: "btn-warning",
            featured: false,
            features: [
                { text: "Everything in Traveller", included: true },
                { text: "6 premium profile templates (total)", included: true },
                { text: "Password-protected collections", included: true },
                { text: 'Featured on Travingat "Featured Profiles" page', included: true },
                { text: "Early access to new features", included: true },
                { text: "Public sharable links for countries and collections", included: true },
            ],
        },
    ],
    annual: [
        {
            name: "Explorer",
            price: "$0",
            period: "/per month",
            description: "Great for trying out Frames X component and templates.",
            cta: "Get Started",
            ctaStyle: "btn-light",
            featured: false,
            features: [
                { text: "Unlimited country flags", included: true },
                { text: "Upload photos to 3 countries", included: true },
                { text: "Max 10 photos per country", included: true },
                { text: "Create folders for unlimited countries (photos locked)", included: true },
                { text: "Public profile link", included: true },
                { text: '"Built with Travingat" badge on all pages', included: true },
            ],
        },
        {
            name: "Traveller",
            price: "$9",
            period: "/per month",
            description: "Best for professional freelancers and small teams.",
            cta: "Get Started",
            ctaStyle: "btn-primary",
            featured: true,
            features: [
                { text: "Everything in Explorer", included: true },
                { text: "Unlimited countries", included: true },
                { text: "Unlimited photos and videos per country", included: true },
                { text: "Create folders for unlimited countries and collections", included: true },
                { text: "Drag & drop reorder of countries and collections", included: true },
                { text: "Remove Travingat badge", included: true },
                { text: "1 premium template (2 total)", included: true },
            ],
        },
        {
            name: "Nomad",
            price: "$19",
            period: "/per month",
            description: "Best for growing large company or enterprise design team.",
            cta: "Get Started",
            ctaStyle: "btn-warning",
            featured: false,
            features: [
                { text: "Everything in Traveller", included: true },
                { text: "6 premium profile templates (total)", included: true },
                { text: "Password-protected collections", included: true },
                { text: 'Featured on Travingat "Featured Profiles" page', included: true },
                { text: "Early access to new features", included: true },
                { text: "Public sharable links for countries and collections", included: true },
            ],
        },
    ],
};

function CheckIcon({ muted }: { muted?: boolean }) {
    return (
        <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className={`shrink-0 mt-0.5 ${muted ? "text-gray-600" : "text-white"}`}
        >
            <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Pricing() {
    const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
    const active = plans[billing];

    return (
        <section className="py-16 md:py-24 px-5 md:px-10 lg:px-16 bg-black">
            <div className="max-w-5xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-10 md:mb-14">
                    <h2
                        className="text-white mb-3"
                        style={{
                            fontFamily: fontFamily.display,
                            fontSize: "clamp(2rem, 5vw, 3.5rem)",
                            lineHeight: lineHeight.h2,
                            fontWeight: fontWeight.bold,
                            letterSpacing: letterSpacing.tight,
                        }}
                    >
                        Pricing
                    </h2>
                    <p className="text-white font-medium text-sm md:text-base max-w-md mx-auto">
                        Built for travelers at every stage: from first trips to premium profile presence.
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex justify-center mb-10">
                    <div className="flex items-center gap-1 bg-[#111] border border-gray-800 rounded-full p-1">
                        <button
                            onClick={() => setBilling("monthly")}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${billing === "monthly" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBilling("annual")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${billing === "annual" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
                        >
                            Annual
                            <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-stretch">
                    {active.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-2xl p-6 flex flex-col gap-5 border transition-all h-full ${
                                plan.featured
                                    ? "bg-[#1a1a1a] border-gray-600 shadow-xl shadow-primary/10"
                                    : "bg-[#111] border-gray-800"
                            }`}
                        >
                            {/* Name */}
                            <div>
                                <p className="text-white font-semibold text-base mb-3">{plan.name}</p>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span
                                        className="text-white"
                                        style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: fontWeight.bold, lineHeight: 1 }}
                                    >
                                        {plan.price}
                                    </span>
                                    <span className="text-gray-500 text-sm">{plan.period}</span>
                                </div>
                                <p className="text-gray-400 text-sm leading-snug">{plan.description}</p>
                            </div>

                            {/* CTA */}
                            <button
                                className={`btn btn-md w-full ${plan.ctaStyle}`}
                            >
                                {plan.cta}
                            </button>

                            {/* Divider */}
                            <div className="h-px bg-gray-800" />

                            {/* Features */}
                            <ul className="flex flex-col gap-3">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <CheckIcon />
                                        <span className="text-gray-300 text-sm leading-snug">{f.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
