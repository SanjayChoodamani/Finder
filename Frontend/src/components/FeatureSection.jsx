import React from "react";

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-[#F3F3E0] p-6 sm:p-8 rounded-lg shadow-lg h-full border border-[#CBDCEB]">
        <div className="mb-4 sm:mb-6">{icon}</div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[#133E87]">{title}</h3>
        <p className="text-[#133E87]/80 text-base">{description}</p>
        <button className="mt-4 text-[#133E87] hover:text-[#133E87]/80">Learn more</button>
    </div>
);

// Features Section Component
const FeaturesSection = () => (
    <div className="bg-[#CBDCEB]/30 py-12 sm:py-16 lg:py-20" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-[#133E87]">
                Discover the features that make our platform stand out for you
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <FeatureCard
                    icon={<div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#CBDCEB] rounded-full" />}
                    title="Affordable Services"
                    description="Find services that match your budget perfectly with our transparent pricing system."
                />
                <FeatureCard
                    icon={<div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#CBDCEB] rounded-full" />}
                    title="Seamless Experience"
                    description="Book and manage services with our intuitive interface designed for simplicity."
                />
                <FeatureCard
                    icon={<div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#CBDCEB] rounded-full" />}
                    title="Quality Assured"
                    description="Every service provider is verified and rated to ensure the best experience."
                />
            </div>
        </div>
    </div>
);

export default FeaturesSection;